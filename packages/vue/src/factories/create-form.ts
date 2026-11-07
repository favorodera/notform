import type { Promisable } from 'type-fest'
import { dequal } from 'dequal'
import { klona } from 'klona'
import { computed, getCurrentScope, onScopeDispose, reactive, ref, shallowReactive, shallowRef, toRaw, toValue, watch } from 'vue'
import type { DeepPartial } from '../types/deep-partial'
import type { FormConfig, FormInstance } from '../types/form'
import type { FieldHost } from '../types/internal'
import type { PathSegments } from '../types/path'
import type { FormSchema, SchemaInput, SchemaOutput } from '../types/schema'
import type { ValidationIssue, ValidationOrigin, ValidationOutcome, ValidationResult } from '../types/validation'
import type { IndexMapper } from '../utils/array'
import { getValueAtPath, isSamePath, setValueAtPath, splitPath } from '../utils/path'
import { createValidationIssueFromError, remapIssueIndex } from '../utils/validation-issue'
import { isFieldAffectedByScope } from '../utils/validation-scope'
import { createFieldScope } from './create-field-scope'
import { createValidationRunRegistry } from './create-validation-run-registry'

/**
 * Builds a complete reactive form: values, errors, validation, submit handling,
 * and the registry that gives every field a stable identity.
 *
 * Single source of truth:
 * - values live in `values`; fields only point at them by path;
 * - errors live in `errors` as the schema reports them (by path); array mutations re-point them;
 * - touched state lives in `touchedFields`, keyed by field id, so it survives reordering;
 * - pending debounced validations live in `fieldTasks`, keyed by field id.
 * @template TSchema - The schema describing the form's data (must be an object schema).
 * @param config Schema, starting values/errors, and the submit handler.
 * @returns The full reactive form.
 * @remarks Internal building block. Prefer the `useForm` composable.
 */
export function createForm<TSchema extends FormSchema>(config: FormConfig<TSchema>): FormInstance<TSchema> {
  type ThisForm = FormInstance<TSchema>

  // State

  /*
   * Starting snapshots, deep-copied so later edits can never alter what the form started with.
   * Never mutated: `reset(values)` replaces them as a whole.
   */
  const initialValues = shallowRef(klona(toRaw(config.initialValues ?? {} as ThisForm['initialValues'])))
  const initialErrors = shallowRef<ValidationIssue[]>(klona(toRaw(config.initialErrors ?? [])))

  /** Live form data (a separate copy of the initial values). */
  const values = reactive(klona(initialValues.value)) as ThisForm['values']

  /** Live validation errors (a separate copy of the initial errors). */
  const errors = reactive(klona(initialErrors.value)) as ValidationIssue[]

  /** Ids of the fields that were blurred. */
  const touchedFields = shallowReactive(new Set<symbol>())

  /** Debounced validations waiting to fire, by field id. */
  const fieldTasks = new Map<symbol, ReturnType<typeof setTimeout>>()

  const isSubmitting = ref(false)
  const submitCount = ref(0)
  const resetCount = ref(0)

  // Derived state

  const isSubmitted = computed(() => {
    return submitCount.value > 0
  })

  const isTouched = computed(() => {
    return isSubmitted.value || touchedFields.size > 0
  })

  const isDirty = computed(() => {
    return !dequal(values, initialValues.value)
  })

  const isValid = computed(() => {
    return errors.length === 0
  })

  // Touched state and delayed tasks (by field id)

  function touchField(id: symbol): void {
    touchedFields.add(id)
  }

  function untouchField(id: symbol): void {
    touchedFields.delete(id)
  }

  function isFieldTouched(id: symbol): boolean {
    return isSubmitted.value || touchedFields.has(id)
  }

  function cancelFieldTask(id: symbol): void {
    const timer = fieldTasks.get(id)

    if (timer === undefined) {
      return
    }

    clearTimeout(timer)
    fieldTasks.delete(id)
  }

  function cancelAllFieldTasks(): void {
    for (const timer of fieldTasks.values()) {
      clearTimeout(timer)
    }

    fieldTasks.clear()
  }

  function scheduleFieldTask(id: symbol, delay: number, task: () => void): void {
    cancelFieldTask(id)

    fieldTasks.set(id, setTimeout(() => {
      fieldTasks.delete(id)
      task()
    }, delay))
  }

  // Validation plumbing

  /** Tracks running validations so outdated results can be discarded. */
  const validationRuns = createValidationRunRegistry()

  /**
   * Increases every time a submit starts. A submit loop keeps going only while its own
   * attempt id is still the latest, so bumping this elsewhere cancels the submit in progress.
   */
  let latestSubmitAttemptId = 0

  const isValidating = computed(() => {
    return validationRuns.activeRuns.size > 0
  })

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
   * Runs one validation and reports whether it was replaced meanwhile.
   * Never throws: a crashing schema becomes a normal issue.
   * @param origin What started this validation.
   * @param path Dot-notation field path. Leave out for a whole-form run.
   * @returns The schema result and whether it went stale.
   */
  async function runValidation(origin: ValidationOrigin, path?: string): Promise<ValidationOutcome<SchemaOutput<TSchema>>> {
    const run = validationRuns.startRun(origin, path)

    try {
      let result: ValidationResult<SchemaOutput<TSchema>>

      try {
        result = await validateAgainstSchema()
      } catch (error) {
        result = { issues: [createValidationIssueFromError(error, path)] }
      }

      return { isStale: run.isStale, result }
    } finally {
      validationRuns.finishRun(run)
    }
  }

  // any change to the data or the schema makes every running validation outdated
  watch(
    () => {
      return toValue(config.schema)
    },
    () => {
      validationRuns.markAllRunsStale()
    },
    { flush: 'sync' },
  )

  watch(
    values,
    () => {
      validationRuns.markAllRunsStale()
    },
    { deep: true, flush: 'sync' },
  )

  // Values and errors

  function getValue(path: string): unknown {
    return getValueAtPath(values, path)
  }

  function setValue(path: string, value: unknown): void {
    setValueAtPath(values, path, value)
  }

  function replaceErrors(nextErrors: ValidationIssue[]): void {
    errors.splice(0, errors.length, ...nextErrors)
  }

  function clearErrors(): void {
    errors.length = 0
  }

  function getFieldErrors(path: string): ValidationIssue[] {
    const targetPath = splitPath(path)

    return errors.filter((error) => {
      return isSamePath(error.path, targetPath)
    })
  }

  /**
   * Replaces the errors sitting exactly at a path. Leaves the other errors alone.
   * @param segments The path whose errors are replaced.
   * @param nextIssues The new errors for that path.
   */
  function replaceErrorsAt(segments: PathSegments, nextIssues: ValidationIssue[]): void {
    const keptErrors = errors.filter((error) => {
      return !isSamePath(error.path, segments)
    })

    // nothing to remove and nothing to add: don't wake up everything that watches `errors`
    if (keptErrors.length === errors.length && nextIssues.length === 0) {
      return
    }

    replaceErrors([...keptErrors, ...nextIssues])
  }

  function setError(error: ValidationIssue): void {
    if (error.path) {
      replaceErrorsAt(error.path, [error])
    } else {
      errors.push(error)
    }
  }

  /**
   * Re-points the errors inside an array after it was mutated, so each error stays with its item.
   * @param arrayPath Path of the mutated array.
   * @param mapIndex Translates an item's old index to its new one (`undefined` drops the error).
   */
  function remapArrayErrors(arrayPath: string, mapIndex: IndexMapper): void {
    const arraySegments = splitPath(arrayPath)
    const remappedErrors: ValidationIssue[] = []
    let hasChanged = false

    for (const error of errors) {
      const remapped = remapIssueIndex(error, arraySegments, mapIndex)

      if (remapped !== error) {
        hasChanged = true
      }

      if (remapped) {
        remappedErrors.push(remapped)
      }
    }

    if (hasChanged) {
      replaceErrors(remappedErrors)
    }
  }

  // Validation actions

  function isFieldValidating(path: string): boolean {
    const fieldSegments = splitPath(path)

    for (const activeRun of validationRuns.activeRuns.values()) {
      if (isFieldAffectedByScope(activeRun.scope, fieldSegments)) {
        return true
      }
    }

    return false
  }

  /**
   * Validates a single field and updates only that field's errors.
   * The whole form is checked against the schema, but only issues sitting exactly at `path` are kept.
   * @param path Dot-notation path to the field.
   * @returns `{ issues }` if the field is invalid, otherwise `{ value }` with its current input value.
   * A result made obsolete by a newer run is returned, but the errors are left untouched.
   */
  async function validateField(path: string): Promise<ValidationResult<unknown>> {
    const { isStale, result } = await runValidation('field', path)
    const fieldSegments = splitPath(path)

    const fieldIssues = (result.issues ?? []).filter((issue) => {
      return isSamePath(issue.path, fieldSegments)
    })

    if (!isStale) {
      replaceErrorsAt(fieldSegments, fieldIssues)
    }

    return fieldIssues.length > 0
      ? { issues: fieldIssues }
      : { value: getValue(path) }
  }

  /**
   * Validates the whole form and replaces all errors with the outcome.
   * @returns The schema result. If a newer validation replaced this one, errors are left untouched.
   */
  async function validate(): Promise<ValidationResult<SchemaOutput<TSchema>>> {
    const { isStale, result } = await runValidation('form')

    if (!isStale) {
      replaceErrors(result.issues ? [...result.issues] : [])
    }

    return result
  }

  /**
   * Validates the whole form and, if valid, calls `config.onSubmit` with the parsed data.
   *
   * - Ignored while a submit is already running.
   * - If validation is replaced mid-flight (the user kept typing), it is simply run again.
   * - On failure, errors are shown and `onSubmit` is not called.
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

        // another attempt (or a reset) took over while we were validating
        if (thisSubmitAttemptId !== latestSubmitAttemptId) {
          return
        }

        if (isStale) {
          continue
        }

        if (result.issues) {
          replaceErrors([...result.issues])
          return
        }

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

  // Reset

  function reset(nextValues?: DeepPartial<SchemaInput<TSchema>>, nextErrors?: ValidationIssue[]): void
  function reset(event: Event): void
  function reset(nextValues?: DeepPartial<SchemaInput<TSchema>> | Event, nextErrors?: ValidationIssue[]): void {
    // used directly as an event handler (`@reset="form.reset"`), the first argument is the event
    const freshValues = isEvent(nextValues) ? undefined : nextValues

    validationRuns.markAllRunsStale()
    cancelAllFieldTasks()
    latestSubmitAttemptId++
    isSubmitting.value = false

    if (freshValues !== undefined) {
      initialValues.value = klona(toRaw(freshValues))
    }

    if (nextErrors !== undefined) {
      initialErrors.value = klona(toRaw(nextErrors))
    }

    replaceRecordContents(values as Record<string, unknown>, klona(initialValues.value))
    replaceErrors(klona(initialErrors.value))

    touchedFields.clear()
    submitCount.value = 0

    // array fields renew their item ids the next time they are read
    resetCount.value++
  }

  // Fields

  /** What fields need from the form. Fields never touch the form's state directly. */
  const host: FieldHost = {
    cancelFieldTask,
    getFieldErrors,
    getInitialValue: (path) => {
      return getValueAtPath(initialValues.value, path)
    },
    getResetCount: () => {
      return resetCount.value
    },
    getValue,
    isFieldTouched,
    isFieldValidating,
    remapArrayErrors,
    scheduleFieldTask,
    setValue,
    touchField,
    untouchField,
    validateField,
  }

  /** The root scope: `form.field(path)` and `form.arrayField(path)` live here. */
  const rootScope = createFieldScope(host, () => {
    return ''
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      validationRuns.markAllRunsStale()
      cancelAllFieldTasks()
      rootScope.dispose()
    })
  }

  // Assemble

  /*
   * `reactive()` unwraps refs and computed values, so consumers read `form.isDirty`, not `form.isDirty.value`.
   * The internals use plain string paths; the typed signatures are declared on `FormInstance`.
   */
  return reactive({
    arrayField: rootScope.arrayField,
    clearErrors,
    errors,
    field: rootScope.field,
    getFieldErrors,
    getValue,
    initialErrors,
    initialValues,
    isDirty,
    isFieldValidating,
    isSubmitted,
    isSubmitting,
    isTouched,
    isValid,
    isValidating,
    replaceErrors,
    reset,
    resetCount,
    setError,
    setValue,
    submit,
    submitCount,
    validate,
    validateField,
    values,
  }) as unknown as ThisForm
}

/**
 * Tells an event apart from starting values.
 * @param value The first argument given to `reset`.
 * @returns `true` if it is a DOM event.
 */
function isEvent(value: unknown): value is Event {
  return typeof Event !== 'undefined' && value instanceof Event
}

/**
 * Empties a reactive record and refills it, keeping the same object identity.
 * @param target The record to replace the contents of.
 * @param source The new contents.
 */
function replaceRecordContents(target: Record<string, unknown>, source: object): void {
  for (const key of Object.keys(target)) {
    // eslint-disable-next-line typescript/no-dynamic-delete
    delete target[key]
  }

  Object.assign(target, source)
}
