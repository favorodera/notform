import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import { dequal } from 'dequal'
import { getProperty, parsePath, setProperty, stringifyPath } from 'dot-prop'
import { klona } from 'klona'
import { computed, reactive, ref, toRaw, toValue, watch } from 'vue'
import type { FormInstance, FormInstanceSettings } from '../types/instance'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema, Path, Paths } from '../types/shared'
import { areIssuePathsEqual } from '../helpers/issues'
import { isPathWithinScope } from '../helpers/segments'

/** A validation scope is either the whole form or one path subtree. */
type ValidationScope
  = | { kind: 'form' }
    | { kind: 'path', segments: ReadonlyArray<number | string> }

type ValidationKind = 'field' | 'submit' | 'validate'

interface ValidationRun {
  id: number
  kind: ValidationKind
  scope: ValidationScope
  stale: boolean
}

interface ValidationExecution<TOutput> {
  result: StandardSchemaV1.Result<TOutput>
  stale: boolean
}

/**
 * Builds the reactive form instance used by `useNotForm` and field components.
 * @param settings
 */
export function createFormInstance<TSchema extends ObjectSchema>(settings: FormInstanceSettings<TSchema>): FormInstance<TSchema> {
  type Instance = FormInstance<TSchema>

  // #region State

  /** Plain reset baseline. May intentionally be a partial schema input. */
  const initialValues = klona(settings.initialValues ?? {} as DeepPartial<InferInput<TSchema>>)

  /** Stable reactive object so existing v-model bindings survive reset(). */
  const values = reactive(klona(initialValues)) as DeepPartial<InferInput<TSchema>>

  /** Plain baseline issues for reset(). */
  const initialErrors = klona(settings.initialErrors ?? [] as Array<Issue>)

  /** Current validation issues. Kept in place for reactive consumers. */
  const errors = reactive<Array<Issue>>([...initialErrors])

  /** Explicitly touched paths. Unlike dirty state, touch is interaction state. */
  const touchedFields = reactive(new Set<Path<TSchema>>())

  /** Number of submit attempts since the last reset. */
  const submitCount = ref(0)
  const isSubmitted = computed(() => submitCount.value > 0)

  /** Dirty state is derived from values and the reset baseline; no path bookkeeping. */
  const isDirty = computed(() => !dequal(values, initialValues))

  /** Whether the form has been interacted with or a submit has been attempted. */
  const isTouched = computed(() => isSubmitted.value || touchedFields.size > 0)

  /** Whether there are no current issues. */
  const isValid = computed(() => errors.length === 0)

  /** Active validation runs. Each run owns one scoped contribution to this set. */
  const activeValidationRuns = reactive(new Map<number, ValidationRun>())
  let nextValidationRunId = 0

  /** True while the submit transaction is running. */
  const isSubmitting = ref(false)

  /** A reset cancels the current submit transaction instead of allowing it to retry. */
  let submitCancellationVersion = 0

  /** Avoids repeated validation cancellation while reset replaces multiple keys. */
  let isSuppressValueInvalidation = false

  // #endregion

  // #region Paths / state helpers

  /**
   * @param path
   */
  function canonicalizePath(path: string): Path<TSchema> {
    return stringifyPath(parsePath(path), { preferDotForIndices: true }) as Path<TSchema>
  }

  /**
   * @param path
   */
  function getScope(path?: Path<TSchema>): ValidationScope {
    return path === undefined
      ? { kind: 'form' }
      : { kind: 'path', segments: parsePath(path) }
  }

  /**
   * @param left
   * @param right
   */
  function scopesOverlap(left: ValidationScope, right: ValidationScope) {
    if (left.kind === 'form' || right.kind === 'form') {
      return true
    }

    return isPathWithinScope(left.segments, right.segments)
      || isPathWithinScope(right.segments, left.segments)
  }

  /**
   * Starts a run. New validation wins over older overlapping validation, except
   * that a normal field/form validation never cancels an already-running submit.
   * @param kind
   * @param path
   */
  function beginValidation(kind: ValidationKind, path?: Path<TSchema>) {
    const run: ValidationRun = {
      id: ++nextValidationRunId,
      kind,
      scope: getScope(path),
      stale: false,
    }

    for (const [id, previous] of activeValidationRuns) {
      const isSubmitIsProtected = previous.kind === 'submit' && kind !== 'submit'

      if (isSubmitIsProtected || !scopesOverlap(previous.scope, run.scope)) {
        continue
      }

      previous.stale = true
      activeValidationRuns.delete(id)
    }

    activeValidationRuns.set(run.id, run)
    return run
  }

  /**
   * @param run
   */
  function settleValidation(run: ValidationRun) {
    activeValidationRuns.delete(run.id)
  }

  /** Cancels all current runs without changing current errors. */
  function invalidateValidation() {
    for (const run of activeValidationRuns.values()) {
      run.stale = true
    }
    activeValidationRuns.clear()
  }

  /**
   * @param path
   */
  function isPathValidating(path: Path<TSchema>) {
    const target = parsePath(path)

    for (const run of activeValidationRuns.values()) {
      if ((run.scope.kind === 'form') || isPathWithinScope(target, run.scope.segments)
        || isPathWithinScope(run.scope.segments, target)) {
        return true
      }
    }

    return false
  }

  /**
   * @param path
   */
  function isPathTouched(path: Path<TSchema>) {
    if (isSubmitted.value) {
      return true
    }

    return touchedFields.has(canonicalizePath(path))
  }

  /**
   * @param path
   */
  function isPathTouchedWithin(path: Path<TSchema>) {
    if (isSubmitted.value) {
      return true
    }

    const scope = parsePath(path)

    return [...touchedFields].some(touchedPath => (
      isPathWithinScope(parsePath(touchedPath), scope)
      || isPathWithinScope(scope, parsePath(touchedPath))
    ))
  }

  /**
   * @param path
   */
  function isPathDirty(path: Path<TSchema>) {
    const currentValue = getProperty(values, path)
    const baselineValue = getProperty(initialValues, path)
    return !dequal(currentValue, baselineValue)
  }

  // #endregion

  // #region Schema execution

  /**
   *
   */
  function executeSchemaValidation() {
    const schema = toValue(settings.schema)
    const snapshot = klona(toRaw(values)) as InferInput<TSchema>
    return schema['~standard'].validate(snapshot)
  }

  /**
   * @param error
   * @param path
   */
  function validationErrorToIssue(error: unknown, path?: Path<TSchema>): Issue {
    if (error instanceof Error) {
      return { message: error.message, ...(path && { path: parsePath(path) }) }
    }

    if (typeof error === 'string') {
      return { message: error, ...(path && { path: parsePath(path) }) }
    }

    return { message: 'Validation failed', ...(path && { path: parsePath(path) }) }
  }

  /**
   * @param kind
   * @param path
   */
  async function executeValidation(kind: ValidationKind, path?: Path<TSchema>): Promise<ValidationExecution<InferOutput<TSchema>>> {
    const run = beginValidation(kind, path)

    try {
      let result: StandardSchemaV1.Result<InferOutput<TSchema>>

      try {
        result = await executeSchemaValidation()
      } catch (error) {
        result = { issues: [validationErrorToIssue(error, path)] }
      }

      return {
        result,
        stale: run.stale,
      }
    } finally {
      settleValidation(run)
    }
  }

  // #endregion

  // #region Values

  /**
   * @param path
   * @param value
   */
  function setValue<TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) {
    setProperty(values, path, value)
  }

  // Any direct v-model or nested mutation goes through this watcher, so async
  // validation can never write a result produced from a previous value tree.
  watch(
    values,
    () => {
      if (!isSuppressValueInvalidation) {
        invalidateValidation()
      }
    },
    { deep: true, flush: 'sync' },
  )

  // Invalidate in-flight validation when a reactive schema is replaced.
  // Synchronous invalidation prevents an outdated result from being committed.
  watch(
    () => toValue(settings.schema),
    () => invalidateValidation(),
    { flush: 'sync' },
  )

  // #endregion

  // #region Errors

  /**
   * @param error
   */
  function setError(error: Issue) {
    const existingIndex = errors.findIndex((existing: Issue) => areIssuePathsEqual(existing.path, error.path))

    if (existingIndex === -1) {
      errors.push(error)
    } else {
      errors[existingIndex] = error
    }
  }

  /**
   * @param nextErrors
   */
  function replaceErrors(nextErrors: Array<Issue>) {
    errors.splice(0, errors.length, ...nextErrors)
  }

  /**
   *
   */
  function clearErrors() {
    errors.length = 0
  }

  /**
   * @param path
   */
  function getFieldErrors(path: Path<TSchema>) {
    const targetPath = parsePath(path)
    return errors.filter((error: Issue) => areIssuePathsEqual(error.path, targetPath))
  }

  // #endregion

  // #region Touch

  /**
   * @param path
   */
  function markFieldAsTouched(path: Path<TSchema>) {
    touchedFields.add(canonicalizePath(path))
  }

  /**
   * @param path
   */
  function unmarkFieldAsTouched(path: Path<TSchema>) {
    touchedFields.delete(canonicalizePath(path))
  }

  /**
   *
   */
  function unmarkAllFieldsAsTouched() {
    touchedFields.clear()
  }

  // #endregion

  // #region Validation

  /**
   *
   */
  async function validate() {
    const { result, stale } = await executeValidation('validate')

    if (stale) {
      return result
    }

    replaceErrors(result.issues ? [...result.issues] : [])
    return result
  }

  /**
   * @param path
   */
  async function validateField(path: Path<TSchema>) {
    const { result, stale } = await executeValidation('field', path)

    if (stale) {
      return result
    }

    const targetPath = parsePath(path)

    for (let errorIndex = errors.length - 1; errorIndex >= 0; errorIndex--) {
      const issuePath = errors[errorIndex]?.path

      if (issuePath !== undefined && isPathWithinScope(issuePath, targetPath)) {
        errors.splice(errorIndex, 1)
      }
    }

    const fieldIssues = (result.issues ?? []).filter(issue => (
      issue.path !== undefined && isPathWithinScope(issue.path, targetPath)
    ))

    errors.push(...fieldIssues)
    return result
  }

  // #endregion

  // #region Submit

  /**
   * @param event
   */
  async function submit(event?: SubmitEvent) {
    // A DOM `reset`/`submit` listener may pass an Event-shaped object. The
    // public submit contract is intentionally event-tolerant at runtime.
    event?.preventDefault()

    if (isSubmitting.value) {
      return
    }

    isSubmitting.value = true
    submitCount.value++
    const submissionVersion = ++submitCancellationVersion

    try {
      while (submissionVersion === submitCancellationVersion) {
        const { result, stale } = await executeValidation('submit')

        if (submissionVersion !== submitCancellationVersion) {
          return
        }

        // Values changed while the schema was awaiting. Validate the current
        // snapshot again instead of silently dropping the submit attempt.
        if (stale) {
          continue
        }

        if (result.issues) {
          replaceErrors([...result.issues])
          return
        }

        clearErrors()
        await settings.onSubmit?.(result.value)
        return
      }
    } finally {
      // A cancelled submission must not clear the state of a newer submission.
      if (submissionVersion === submitCancellationVersion) {
        isSubmitting.value = false
      }
    }
  }

  // #endregion

  // #region Reset

  /**
   * @param nextValues
   * @param nextErrors
   */
  function reset(nextValues?: DeepPartial<InferInput<TSchema>>, nextErrors?: Array<Issue>) {
    // Event objects are not valid reset baselines. This also makes
    // `@reset="form.reset"` safe even when used directly as a listener.
    if (typeof Event !== 'undefined' && nextValues instanceof Event) {
      nextValues = undefined
    }

    invalidateValidation()
    submitCancellationVersion++

    // Release submission state immediately, even if the old validator is pending.
    isSubmitting.value = false

    isSuppressValueInvalidation = true

    try {
      if (nextValues !== undefined) {
        const freshValues = klona(nextValues)

        for (const key of Object.keys(initialValues)) {
          delete initialValues[key as keyof typeof initialValues]
        }

        Object.assign(initialValues, freshValues)
      }

      if (nextErrors !== undefined) {
        initialErrors.splice(0, initialErrors.length, ...klona(nextErrors))
      }

      for (const key of Object.keys(values)) {
        delete values[key as keyof typeof values]
      }
      Object.assign(values, klona(initialValues))

      replaceErrors(klona(initialErrors))
      unmarkAllFieldsAsTouched()
      submitCount.value = 0
    } finally {
      isSuppressValueInvalidation = false
    }
  }

  // #endregion

  const instance: Instance = reactive({
    clearErrors,
    errors,
    getFieldErrors,
    invalidateValidation,
    isDirty,
    isPathDirty,
    isPathTouched,
    isPathTouchedWithin,
    isPathValidating,
    isSubmitted,
    isSubmitting,
    isTouched,
    isValid,
    isValidating: computed(() => activeValidationRuns.size > 0),
    markFieldAsTouched,
    replaceErrors,
    reset,
    setError,
    setValue,
    submit,
    submitCount,
    touchedFields,
    unmarkAllFieldsAsTouched,
    unmarkFieldAsTouched,
    validate,
    validateField,
    values,
  })

  return instance
}
