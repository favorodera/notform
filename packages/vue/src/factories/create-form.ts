import type { Promisable } from 'type-fest'
import { dequal } from 'dequal'
import { klona } from 'klona'
import { computed, reactive, ref, toRaw, toValue } from 'vue'
import type { FieldConfig } from '../types/field'
import type { FormConfig, FormInstance } from '../types/form'
import type { InputPath, InputPathValue, OutputPathValue } from '../types/path'
import type { FormSchema, SchemaInput, SchemaOutput } from '../types/schema'
import type { ValidationIssue, ValidationOrigin, ValidationOutcome, ValidationResult } from '../types/validation'
import { getValueAtPath, isSamePath, setValueAtPath, splitPath } from '../utils/path'
import { createValidationIssueFromError } from '../utils/validation-issue'
import { createField } from './create-field'
import { createValidationRunRegistry } from './create-validation-run-registry'

/**
 * Builds a complete reactive form: values, errors, validation, and submit handling.
 * @template TSchema - The schema describing the form's data (must be an object schema).
 * @param config Schema, starting values/errors, and the submit handler.
 * @returns The full reactive form.
 * @remarks Internal building block. Prefer the `useForm` composable.
 * @see useForm
 */
export function createForm<TSchema extends FormSchema>(config: FormConfig<TSchema>) {
  type ThisForm = FormInstance<TSchema>

  /*
   * ── 1. Starting snapshots ──────────────────────────────────────────
   * Deep-copied so later edits to `values` / `errors` can never alter what the form started with.
   */

  const initialValues = klona(config.initialValues ?? {} as ThisForm['initialValues'])
  const initialErrors = klona(config.initialErrors ?? [] as ThisForm['initialErrors'])

  // ── 2. Live state ──────────────────────────────────────────────────

  /** Live form data (a separate copy of `initialValues`). */
  const values = reactive(klona(initialValues)) as ThisForm['values']

  /** Live validation errors (a separate copy of `initialErrors`). */
  const errors = reactive(klona(initialErrors)) as ThisForm['errors']

  /** `true` while a submit is in progress (validating or running `onSubmit`). */
  const isSubmitting = ref(false)

  /** How many times submit has been attempted. */
  const submitCount = ref(0)

  // ── 3. Derived state ───────────────────────────────────────────────

  /** `true` once submit has been attempted at least once. */
  const isSubmitted = computed(() => {
    return submitCount.value > 0
  })

  /** `true` when `values` differ (deep comparison) from `initialValues`. */
  const isDirty = computed(() => {
    return !dequal(values, initialValues)
  })

  /** `true` when there are no errors. */
  const isValid = computed(() => {
    return errors.length === 0
  })

  // ── 4. Validation plumbing ─────────────────────────────────────────

  /** Tracks running validations so outdated results can be discarded. */
  const validationRuns = createValidationRunRegistry()

  /**
   * Increases every time a submit starts. A submit loop keeps going only while
   * its own attempt id is still the latest, so bumping this number elsewhere
   * would cancel the submit in progress.
   */
  let latestSubmitAttemptId = 0

  /**
   * Validates a snapshot of the current values against the schema.
   * @returns The schema result (`{ value }` or `{ issues }`), sync or async.
   */
  function validateAgainstSchema() {
    const schema = toValue(config.schema)

    // validate a plain deep copy: the user may keep typing while validation is still running
    const valuesSnapshot = klona(toRaw(values)) as SchemaInput<TSchema>

    return schema['~standard'].validate(valuesSnapshot) as Promisable<ValidationResult<SchemaOutput<TSchema>>>
  }

  /**
   * Runs one validation and reports whether it was replaced by a newer one meanwhile.
   * Never throws: a crashing schema becomes a normal issue.
   * @param origin What started this validation.
   * @param path Dot-notation field path. Leave out for a whole-form run.
   * @returns The schema result and whether it went stale.
   */
  async function runValidation(origin: ValidationOrigin, path?: InputPath<TSchema>): Promise<ValidationOutcome<SchemaOutput<TSchema>>> {
    const run = validationRuns.startRun(origin, path)

    try {
      let result: ValidationResult<SchemaOutput<TSchema>>

      try {
        result = await validateAgainstSchema()
      } catch (error) {
        result = { issues: [createValidationIssueFromError(error, path)] }
      }

      return {
        isStale: run.isStale,
        result,
      }
    } finally {
      validationRuns.finishRun(run)
    }
  }

  // ── 5. Actions ─────────────────────────────────────────────────────

  /**
   * Writes a value into the form at the given path.
   * @param path Dot-notation path, e.g. `'address.city'`.
   * @param value The new value.
   */
  function setValue<TPath extends InputPath<TSchema>>(path: TPath, value: InputPathValue<TSchema, TPath>): void {
    setValueAtPath(values, path, value)
  }

  /**
   * Replaces all current errors with the given ones.
   * @param nextErrors The errors the form should now show.
   */
  function replaceErrors(nextErrors: ValidationIssue[]): void {
    errors.splice(0, errors.length, ...nextErrors)
  }

  /** Removes every error from the form. */
  function clearErrors(): void {
    errors.length = 0
  }

  /**
   * Validates a single field and updates only that field's errors.
   * The whole form is checked against the schema, but only issues sitting
   * exactly at `path` are kept.
   * @param path Dot-notation path to the field.
   * @returns `{ issues }` if the field is invalid, otherwise `{ value }`.
   * If a newer validation replaced this one, the raw result is returned and errors are left untouched.
   */
  async function validateField<TPath extends InputPath<TSchema>>(path: TPath): Promise<ValidationResult<OutputPathValue<TSchema, TPath>>> {
    const { isStale, result } = await runValidation('field', path)

    // outdated result: don't touch the errors
    if (isStale) {
      return result as ValidationResult<OutputPathValue<TSchema, TPath>>
    }

    const fieldSegments = splitPath(path)

    // drop this field's old errors (backwards, so removing one doesn't shift the ones still to check)
    for (let errorIndex = errors.length - 1; errorIndex >= 0; errorIndex--) {
      if (isSamePath(errors[errorIndex].path, fieldSegments)) {
        errors.splice(errorIndex, 1)
      }
    }

    // keep only the new issues that belong to this exact field
    const fieldIssues = (result.issues ?? []).filter((issue) => {
      return isSamePath(issue.path, fieldSegments)
    })

    errors.push(...fieldIssues)

    if (fieldIssues.length > 0) {
      return {
        issues: fieldIssues,
      }
    }

    return {
      value: getValueAtPath(values, path) as OutputPathValue<TSchema, TPath>,
    }
  }

  /**
   * Validates the whole form and replaces all errors with the outcome.
   * @returns The schema result. If a newer validation replaced this one, errors are left untouched.
   */
  async function validate(): Promise<ValidationResult<SchemaOutput<TSchema>>> {
    const { isStale, result } = await runValidation('form')

    if (isStale) {
      return result
    }

    replaceErrors(result.issues ? [...result.issues] : [])

    return result
  }

  /**
   * Validates the whole form and, if it is valid, calls `config.onSubmit` with the parsed data.
   *
   * - Ignored while a submit is already running.
   * - If validation is replaced by a newer one mid-flight, it is simply run again.
   * - On validation failure, errors are shown and `onSubmit` is not called.
   * @param event Browser submit event; its default page reload is prevented.
   * @throws Whatever `config.onSubmit` throws (after `isSubmitting` has been reset).
   */
  async function submit(event?: SubmitEvent): Promise<void> {
    event?.preventDefault()

    // double-click guard
    if (isSubmitting.value) {
      return
    }

    isSubmitting.value = true
    submitCount.value++

    const thisSubmitAttemptId = ++latestSubmitAttemptId

    /* eslint-disable no-unmodified-loop-condition, no-await-in-loop, require-atomic-updates */
    try {
      // loops only to retry after a stale validation; every other path returns
      while (thisSubmitAttemptId === latestSubmitAttemptId) {
        const { isStale, result } = await runValidation('submit')

        // another attempt took over while we were validating
        if (thisSubmitAttemptId !== latestSubmitAttemptId) {
          return
        }

        // validation was replaced mid-flight: run it again
        if (isStale) {
          continue
        }

        // invalid: show errors and stop
        if (result.issues) {
          replaceErrors([...result.issues])
          return
        }

        // valid: clear old errors and hand the parsed data over
        clearErrors()
        await config.onSubmit?.(result.value)
        return
      }
    } finally {
      // only the latest attempt may reset the flag, so an old attempt can't switch off a newer one
      if (thisSubmitAttemptId === latestSubmitAttemptId) {
        isSubmitting.value = false
      }
    }
    /* eslint-enable no-unmodified-loop-condition, no-await-in-loop, require-atomic-updates */
  }

  // ── 6. Fields ──────────────────────────────────────────────────────

  /**
   * Creates a field bound to this form (exposed as `form.field`).
   * @param path Dot-notation path to the value.
   * @param fieldConfig Optional per-field behaviour settings.
   * @returns A reactive field.
   */
  function createFormField<TPath extends InputPath<TSchema>>(path: TPath, fieldConfig?: FieldConfig) {
    // eslint-disable-next-line no-use-before-define
    return createField<TSchema, TPath>(form, path, fieldConfig)
  }

  // ── 7. Assemble ────────────────────────────────────────────────────

  // `reactive()` unwraps refs and computed values, so consumers read `form.isDirty`, not `form.isDirty.value`
  const form = reactive({
    clearErrors,
    errors,
    field: createFormField,
    initialErrors,
    initialValues,
    isDirty,
    isSubmitted,
    isSubmitting,
    isValid,
    replaceErrors,
    setValue,
    submit,
    submitCount,
    validate,
    validateField,
    values,
  }) as ThisForm

  return form
}
