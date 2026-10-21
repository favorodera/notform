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
  = | {
    /** Path-subtree validation scope. */
    kind: 'path'

    /** Parsed path used to compare overlapping scopes. */
    segments: ReadonlyArray<number | string>
  }
  | {
    /** Whole-form validation scope. */
    kind: 'form'
  }

/** Operation that started a validation run. */
type ValidationKind = 'field' | 'submit' | 'validate'

/** Tracks a validation run and whether newer state has invalidated it. */
interface ValidationRun {
  /** Monotonic identifier used to remove this run. */
  id: number

  /** Operation that started the run. */
  kind: ValidationKind

  /** Form or field subtree covered by the run. */
  scope: ValidationScope

  /** Set when newer values, schema, or validation supersede this result. */
  stale: boolean
}

/**
 * Result returned by a validation run together with its freshness state.
 * @template TOutput Parsed schema output type.
 */
interface ValidationExecution<TOutput> {
  /** Parsed output or validation issues returned by the schema. */
  result: StandardSchemaV1.Result<TOutput>

  /** Whether the run was invalidated before it completed. */
  stale: boolean
}

/**
 * Creates the reactive form state and all form operations.
 * @template TSchema Object schema used to infer form input and output.
 * @param settings Schema, initial values, initial issues, and submit callback.
 * @returns The full reactive form instance.
 */
export function createFormInstance<TSchema extends ObjectSchema>(settings: FormInstanceSettings<TSchema>): FormInstance<TSchema> {
  /** Concrete instance shape returned after reactive wrapping. */
  type Instance = FormInstance<TSchema>

  // State

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

  /** Submission state derives from the accepted attempt count. */
  const isSubmitted = computed(() => submitCount.value > 0)

  /** Dirty state is derived from values and the reset baseline; no path bookkeeping. */
  const isDirty = computed(() => !dequal(values, initialValues))

  /** Whether the form has been interacted with or a submit has been attempted. */
  const isTouched = computed(() => isSubmitted.value || touchedFields.size > 0)

  /** Whether there are no current issues. */
  const isValid = computed(() => errors.length === 0)

  /** Active validation runs. Each run owns one scoped contribution to this set. */
  const activeValidationRuns = reactive(new Map<number, ValidationRun>())

  /** Monotonic id used to distinguish overlapping validation runs. */
  let nextValidationRunId = 0

  /** True while the submit transaction is running. */
  const isSubmitting = ref(false)

  /** A reset cancels the current submit transaction instead of allowing it to retry. */
  let submitCancellationVersion = 0

  /** Avoids repeated validation cancellation while reset replaces multiple keys. */
  let isSuppressValueInvalidation = false

  // Paths / state helpers

  /**
   * Normalizes equivalent path notation to a stable dot path.
   * @param path Path string to normalize.
   * @returns Canonical path with dot-separated array indices.
   */
  function canonicalizePath(path: string): Path<TSchema> {
    return stringifyPath(parsePath(path), { preferDotForIndices: true }) as Path<TSchema>
  }

  /**
   * Converts an optional field path into a form or subtree validation scope.
   * @param path Field path; omitted for whole-form validation.
   * @returns The validation scope for this operation.
   */
  function getScope(path?: Path<TSchema>): ValidationScope {
    return path === undefined
      ? { kind: 'form' }
      : { kind: 'path', segments: parsePath(path) }
  }

  /**
   * Checks whether two validation scopes can affect the same field.
   * @param left First validation scope.
   * @param right Second validation scope.
   * @returns `true` when either scope contains or overlaps the other.
   */
  function didScopesOverlap(left: ValidationScope, right: ValidationScope): boolean {
    if (left.kind === 'form' || right.kind === 'form') {
      return true
    }

    return isPathWithinScope(left.segments, right.segments)
      || isPathWithinScope(right.segments, left.segments)
  }

  /**
   * Starts a run. New validation wins over older overlapping validation, except
   * that a normal field/form validation never cancels an already-running submit.
   * @param kind Operation starting the run.
   * @param path Optional field path for scoped validation.
   * @returns The new run record, registered as active.
   */
  function beginValidation(kind: ValidationKind, path?: Path<TSchema>): ValidationRun {
    /** New run owns one validation scope until it settles or becomes stale. */
    const run: ValidationRun = {
      id: ++nextValidationRunId,
      kind,
      scope: getScope(path),
      stale: false,
    }

    for (const [id, previous] of activeValidationRuns) {
      // Field and manual validation must not cancel an accepted submit run.
      const isSubmitProtected = previous.kind === 'submit' && kind !== 'submit'

      if (isSubmitProtected || !didScopesOverlap(previous.scope, run.scope)) {
        continue
      }

      previous.stale = true
      activeValidationRuns.delete(id)
    }

    activeValidationRuns.set(run.id, run)
    return run
  }

  /**
   * Removes a completed run from the active validation set.
   * @param run Run to settle.
   */
  function settleValidation(run: ValidationRun): void {
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
   * Checks whether a validation run overlaps the supplied path.
   * @param path Field path to inspect.
   * @returns `true` while the path overlaps an active validation scope.
   */
  function isPathValidating(path: Path<TSchema>): boolean {
    /** Parsed once so every active scope can be checked against the same path. */
    const target = parsePath(path)

    for (const run of activeValidationRuns.values()) {
      if (
        run.scope.kind === 'form'
        || isPathWithinScope(target, run.scope.segments)
        || isPathWithinScope(run.scope.segments, target)
      ) {
        return true
      }
    }

    return false
  }

  /**
   * Checks whether a field was touched or the form was submitted.
   * @param path Field path to inspect.
   * @returns Whether the path is considered touched.
   */
  function isPathTouched(path: Path<TSchema>): boolean {
    if (isSubmitted.value) {
      return true
    }

    return touchedFields.has(canonicalizePath(path))
  }

  /**
   * Checks whether a path or any ancestor/descendant has been touched.
   * @param path Field or subtree path to inspect.
   * @returns Whether the path overlaps explicit touched state.
   */
  function isPathTouchedWithin(path: Path<TSchema>): boolean {
    if (isSubmitted.value) {
      return true
    }

    /** Parsed path used to include both touched ancestors and descendants. */
    const scope = parsePath(path)

    return [...touchedFields].some(touchedPath => (
      isPathWithinScope(parsePath(touchedPath), scope)
      || isPathWithinScope(scope, parsePath(touchedPath))
    ))
  }

  /**
   * Compares a field value with its reset baseline.
   * @param path Field path to compare.
   * @returns Whether the current and baseline values differ.
   */
  function isPathDirty(path: Path<TSchema>): boolean {
    /** Current value at the requested path. */
    const currentValue = getProperty(values, path)

    /** Value at the same path in the reset baseline. */
    const baselineValue = getProperty(initialValues, path)
    return !dequal(currentValue, baselineValue)
  }

  // Schema execution

  /**
   * Validates a detached snapshot with the currently resolved schema.
   * @returns The Standard Schema validation result.
   */
  function executeSchemaValidation() {
    const schema = toValue(settings.schema)
    // Clone raw values so validators cannot mutate the reactive form state.
    const snapshot = klona(toRaw(values)) as InferInput<TSchema>
    return schema['~standard'].validate(snapshot)
  }

  /**
   * Converts a thrown validator error into a displayable issue.
   * @param error Value thrown by the schema validator.
   * @param path Optional field path associated with this validation.
   * @returns A normalized issue with a message and optional path.
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
   * Runs schema validation and reports whether the result became stale.
   * @param kind Operation starting the validation.
   * @param path Optional field path for a scoped operation.
   * @returns Parsed output or issues, plus the run's freshness state.
   */
  async function executeValidation(kind: ValidationKind, path?: Path<TSchema>): Promise<ValidationExecution<InferOutput<TSchema>>> {
    const run = beginValidation(kind, path)

    try {
      /** Keep the validator result separate from freshness tracking. */
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

  // Values

  /**
   * Updates a field value without triggering validation directly.
   * @template TPath Exact path within the schema input.
   * @param path Field path to update.
   * @param value Input value accepted at that path.
   */
  function setValue<TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>): void {
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

  // Validation issues

  /**
   * Adds an issue or replaces the issue with the same normalized path.
   * @param error Issue to add or replace.
   */
  function setError(error: Issue): void {
    /** Replace the existing issue for this path instead of duplicating it. */
    const existingIndex = errors.findIndex((existing: Issue) => areIssuePathsEqual(existing.path, error.path))

    if (existingIndex === -1) {
      errors.push(error)
    } else {
      errors[existingIndex] = error
    }
  }

  /**
   * Replaces the existing issue list without replacing its reactive array.
   * @param nextErrors Complete issue list to apply.
   */
  function replaceErrors(nextErrors: Array<Issue>): void {
    errors.splice(0, errors.length, ...nextErrors)
  }

  /** Removes all current issues while preserving the reactive array. */
  function clearErrors(): void {
    errors.length = 0
  }

  /**
   * Returns issues whose normalized path exactly matches a field path.
   * @param path Field path to match.
   * @returns Matching issues in their current order.
   */
  function getFieldErrors(path: Path<TSchema>): Array<Issue> {
    const targetPath = parsePath(path)
    return errors.filter((error: Issue) => areIssuePathsEqual(error.path, targetPath))
  }

  // Touched state

  /**
   * Marks a normalized field path as touched.
   * @param path Field path to mark.
   */
  function markFieldAsTouched(path: Path<TSchema>): void {
    touchedFields.add(canonicalizePath(path))
  }

  /**
   * Clears touched state for a normalized field path.
   * @param path Field path to clear.
   */
  function unmarkFieldAsTouched(path: Path<TSchema>): void {
    touchedFields.delete(canonicalizePath(path))
  }

  /** Clears all explicitly touched paths. */
  function unmarkAllFieldsAsTouched(): void {
    touchedFields.clear()
  }

  // Validation

  /**
   * Validates the entire form and replaces all current issues.
   * @returns The Standard Schema result for the current values.
   */
  async function validate(): Promise<StandardSchemaV1.Result<InferOutput<TSchema>>> {
    const { result, stale } = await executeValidation('validate')

    if (stale) {
      return result
    }

    replaceErrors(result.issues ? [...result.issues] : [])
    return result
  }

  /**
   * Validates the schema and updates only issues inside a field path.
   * @param path Field or subtree path whose issues should be updated.
   * @returns The full Standard Schema result for the current values.
   */
  async function validateField(path: Path<TSchema>): Promise<StandardSchemaV1.Result<InferOutput<TSchema>>> {
    const { result, stale } = await executeValidation('field', path)

    if (stale) {
      return result
    }

    /** Only issues inside this field subtree are replaced. */
    const targetPath = parsePath(path)

    for (let errorIndex = errors.length - 1; errorIndex >= 0; errorIndex--) {
      /** Pathless issues belong to the form and must remain untouched. */
      const issuePath = errors[errorIndex]?.path

      if (issuePath !== undefined && isPathWithinScope(issuePath, targetPath)) {
        errors.splice(errorIndex, 1)
      }
    }

    /** Keep only issues covered by this field validation. */
    const fieldIssues = (result.issues ?? []).filter(issue => (
      issue.path !== undefined && isPathWithinScope(issue.path, targetPath)
    ))

    errors.push(...fieldIssues)
    return result
  }

  // Submission

  /**
   * Validates current values and calls `onSubmit` once they are valid.
   * @param event Optional native submit event; its default is prevented.
   */
  async function submit(event?: SubmitEvent): Promise<void> {
    // A DOM `reset`/`submit` listener may pass an Event-shaped object. The
    // public submit contract is intentionally event-tolerant at runtime.
    event?.preventDefault()

    if (isSubmitting.value) {
      return
    }

    isSubmitting.value = true
    submitCount.value++

    /** A reset or newer transaction changes this token and cancels this loop. */
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

  // Reset

  /**
   * Restores the form to a baseline and cancels active validation/submission.
   * @param nextValues Optional replacement baseline values.
   * @param nextErrors Optional replacement baseline issues.
   */
  function reset(nextValues?: DeepPartial<InferInput<TSchema>>, nextErrors?: Array<Issue>): void

  /**
   * Resets the form when called as a native event handler.
   *
   * The event is ignored, and the existing baseline is restored.
   * @param event Native reset event.
   */
  function reset(event: Event): void
  function reset(nextValues?: DeepPartial<InferInput<TSchema>> | Event, nextErrors?: Array<Issue>): void {
    // Event objects are not valid reset baselines.
    // This makes `@reset="form.reset"` safe even when used directly as a listener.
    if (typeof Event !== 'undefined' && nextValues instanceof Event) {
      nextValues = undefined
    }

    // Version changes cancel the old submit loop; invalidation stops old results committing.
    invalidateValidation()
    submitCancellationVersion++

    // Release submission state immediately, even if the old validator is pending.
    isSubmitting.value = false

    isSuppressValueInvalidation = true

    try {
      if (nextValues !== undefined) {
        /** Clone caller input so later external mutation cannot change the baseline. */
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
