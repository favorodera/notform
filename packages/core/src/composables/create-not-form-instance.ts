import type { Get } from 'type-fest'
import { dequal } from 'dequal'
import { deepKeys, deleteProperty, getProperty, parsePath, setProperty } from 'dot-prop'
import { klona } from 'klona'
import { computed, reactive, ref, toValue } from 'vue'
import type { UseNotFormConfig } from '../types/not-form-config'
import type { NotFormInstance } from '../types/not-form-instance'
import type { InferInput, Issue, ObjectSchema, Paths } from '../types/shared'
import { areIssuePathsEqual } from '../utils/issues'

/**
 * Constructs the complete, reactive form instance.
 *
 * Only consumed by `use-not-form.ts` (public entry-point) and
 * `use-not-form-instance.ts` (provide/inject bridge).
 * @template TSchema - The validation schema.
 * @internal
 * @param config Form configuration (schema, initial values, callbacks).
 * @returns A fully assembled {@link NotFormInstance}.
 */
export function createNotFormInstance<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  /** Convenience alias to avoid repeating the generic everywhere. */
  type Instance = NotFormInstance<TSchema>

  // ──────────────────────────────────────────────
  // #region State — reactive primitives
  // ──────────────────────────────────────────────

  /** Deep-cloned snapshot of the starting field values (used as reset baseline). */
  const initialValues = klona(config.initialValues ?? {} as InferInput<TSchema>)

  /** Deeply reactive object holding live field values. */
  const values = reactive(klona(initialValues))

  /** Deep-cloned snapshot of the starting errors (used as reset baseline). */
  const initialErrors = klona(config.initialErrors ?? [] as Array<Issue>)

  /** Reactive list of current validation issues. */
  const errors = reactive<Array<Issue>>([...initialErrors])

  /** Set of dot-notated paths the user has interacted with. */
  const touchedFields = reactive(new Set<Paths<TSchema>>())

  /** `true` when at least one field has been touched. */
  const isTouched = computed(() => touchedFields.size > 0)

  /** Set of dot-notated paths whose value differs from the baseline. */
  const dirtyFields = reactive(new Set<Paths<TSchema>>())

  /** `true` when at least one field is dirty. */
  const isDirty = computed(() => dirtyFields.size > 0)

  /** Set of dot-notated paths currently being validated asynchronously. */
  const validatingFields = reactive(new Set<Paths<TSchema>>())

  /** `true` when there are zero validation issues. */
  const isValid = computed(() => errors.length === 0)

  /** `true` while any validation is running. */
  const isValidating = computed(() => validatingFields.size > 0)

  /** `true` while the submit handler is executing. */
  const isSubmitting = ref(false)

  /**
   * Monotonic counter incremented by whole-form operations (validate, submit, reset).
   * In-flight field validations started before the current generation are discarded
   * on resolution, preventing stale results from overwriting fresh state.
   */
  let generation = 0

  /**
   * Maps each field path to its latest per-field validation cycle id.
   * Used to discard stale async results when the same field is validated again
   * before the previous run completes.
   */
  const fieldValidationCycleMap = new Map<Paths<TSchema>, number>()

  // #endregion

  // ──────────────────────────────────────────────
  // #region Schema execution
  // ──────────────────────────────────────────────

  /**
   * Resolves the (possibly ref/getter) schema and runs its Standard Schema
   * validation against the current `values`.
   * @returns The Standard Schema result containing either `value` or `issues`.
   */
  function executeSchemaValidation() {
    const schema = toValue(config.schema)
    return schema['~standard'].validate(values)
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Values
  // ──────────────────────────────────────────────

  /**
   * Sets a field's value by dot-notated path and synchronizes its dirty state.
   * @template TPath - The dot-notated field path.
   * @param path Dot-notated path to the target field.
   * @param value The value to assign.
   */
  function setValue<TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) {
    setProperty(values, path, value)
    // Keep dirty tracking in sync whenever a value changes
    syncDirtyState(path)
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Errors
  // ──────────────────────────────────────────────

  /**
   * Upserts a validation issue — replaces an existing issue at the same path,
   * or appends it if no matching issue exists.
   * @param error The validation issue to set.
   */
  function setError(error: Issue) {
    const existingIndex = errors.findIndex(existing => areIssuePathsEqual(existing.path, error.path))

    if (existingIndex === -1) {
      // No issue at this path yet — append
      errors.push(error)
    } else {
      // Replace existing issue in-place to preserve reactivity
      errors[existingIndex] = error
    }
  }

  /**
   * Replaces the entire error list with a new set of issues.
   * @param newErrors The replacement validation issues.
   */
  function replaceErrors(newErrors: Array<Issue>) {
    errors.splice(0, errors.length, ...newErrors)
  }

  /**
   * Removes all validation issues.
   * @internal
   */
  function clearErrors() {
    errors.length = 0
  }

  /**
   * Returns every validation issue whose path matches the given field.
   * @param path Dot-notated field path.
   * @returns Filtered array of matching issues.
   */
  function getFieldErrors(path: Paths<TSchema>) {
    const targetPath = parsePath(path)
    return errors.filter(error => areIssuePathsEqual(error.path, targetPath))
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Dirty tracking
  // ──────────────────────────────────────────────

  /**
   * Forces a field's dirty flag on.
   * @internal
   * @param path Dot-notated field path.
   */
  function markFieldAsDirty(path: Paths<TSchema>) {
    dirtyFields.add(path)
  }

  /**
   * Forces the dirty flag on for every leaf field in `values`.
   * @internal
   */
  function markAllFieldsAsDirty() {
    for (const path of deepKeys(values)) {
      dirtyFields.add(path)
    }
  }

  /**
   * Clears the dirty flag for a single field.
   * @internal
   * @param path Dot-notated field path.
   */
  function unmarkFieldAsDirty(path: Paths<TSchema>) {
    dirtyFields.delete(path)
  }

  /**
   * Clears the dirty flag for all fields.
   * @internal
   */
  function unmarkAllFieldsAsDirty() {
    dirtyFields.clear()
  }

  /**
   * Compares a field's current value against its initial value and
   * updates the dirty flag accordingly.
   * @internal
   * @param path Dot-notated field path.
   */
  function syncDirtyState(path: Paths<TSchema>) {
    const currentValue = getProperty(values, path)
    const baselineValue = getProperty(initialValues, path)

    // Deep equality check — if unchanged, clear dirty; otherwise mark dirty
    const isUnchanged = dequal(currentValue, baselineValue)

    if (isUnchanged) {
      unmarkFieldAsDirty(path)
    } else {
      markFieldAsDirty(path)
    }
  }

  /**
   * Recalculates dirty state for every leaf field in `values`.
   * @internal
   */
  function syncAllDirtyStates() {
    for (const path of deepKeys(values)) {
      syncDirtyState(path)
    }
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Touch tracking
  // ──────────────────────────────────────────────

  /**
   * Records a field as touched (user has interacted with it).
   * @internal
   * @param path Dot-notated field path.
   */
  function markFieldAsTouched(path: Paths<TSchema>) {
    touchedFields.add(path)
  }

  /**
   * Records every leaf field as touched.
   * @internal
   */
  function markAllFieldsAsTouched() {
    for (const path of deepKeys(values)) {
      touchedFields.add(path)
    }
  }

  /**
   * Removes the touched flag from a single field.
   * @internal
   * @param path Dot-notated field path.
   */
  function unmarkFieldAsTouched(path: Paths<TSchema>) {
    touchedFields.delete(path)
  }

  /**
   * Removes the touched flag from all fields.
   * @internal
   */
  function unmarkAllFieldsAsTouched() {
    touchedFields.clear()
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Validating-field tracking
  // ──────────────────────────────────────────────

  /**
   * Adds multiple fields to the "currently validating" set.
   * @internal
   * @param paths Iterable of dot-notated field paths.
   */
  function markFieldsAsValidating(paths: Iterable<Paths<TSchema>>) {
    for (const path of paths) validatingFields.add(path)
  }

  /**
   * Removes multiple fields from the "currently validating" set.
   * @internal
   * @param paths Iterable of dot-notated field paths.
   */
  function unmarkFieldsAsValidating(paths: Iterable<Paths<TSchema>>) {
    for (const path of paths) validatingFields.delete(path)
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Whole-form validation
  // ──────────────────────────────────────────────

  /**
   * Validates the entire form against the schema, replacing all current errors.
   *
   * Bumps the shared generation counter, invalidating any in-flight per-field
   * validations as well as other whole-form validations already in progress.
   * @returns The Standard Schema validation result.
   */
  async function validate() {
    // Increment generation so any in-flight validation (field or form) becomes stale
    const cycle = ++generation
    const paths = [...deepKeys(values)] as Array<Paths<TSchema>>
    markFieldsAsValidating(paths)

    try {
      const result = await executeSchemaValidation()

      // Discard if a newer whole-form operation started while we were awaiting
      if (cycle !== generation) return result

      if (result.issues) replaceErrors([...result.issues])
      else clearErrors()

      return result
    } finally {
      unmarkFieldsAsValidating(paths)
    }
  }

  // ──────────────────────────────────────────────
  // #region Single-field validation
  // ──────────────────────────────────────────────

  /**
   * Validates a single field against the schema, updating only that field's errors.
   *
   * Staleness is checked on two axes:
   * 1. **Per-field cycle** — a newer call for the *same* field cancels this one.
   * 2. **Generation** — any whole-form operation that started after this call cancels it.
   *
   * Calls for *different* fields never cancel each other.
   * @param path Dot-notated field path.
   * @returns The Standard Schema validation result.
   */
  async function validateField(path: Paths<TSchema>) {
    // Assign a per-field cycle id so only the latest call for this path wins
    const cycle = (fieldValidationCycleMap.get(path) ?? 0) + 1
    fieldValidationCycleMap.set(path, cycle)

    // Capture generation at call-time to detect whole-form invalidation later
    const startGeneration = generation

    validatingFields.add(path)

    try {
      const result = await executeSchemaValidation()

      // Discard stale: a newer form-wide op or a newer per-field call superseded us
      if (generation !== startGeneration || fieldValidationCycleMap.get(path) !== cycle) {
        return result
      }

      const targetPath = parsePath(path)

      // Remove existing errors for this specific field (reverse iteration for safe splicing)
      for (let index = errors.length - 1; index >= 0; index--) {
        if (areIssuePathsEqual(errors[index].path, targetPath)) errors.splice(index, 1)
      }

      // Append only this field's issues from the fresh result
      const fieldIssues = (result.issues ?? []).filter(issue => areIssuePathsEqual(issue.path, targetPath))
      errors.push(...fieldIssues)

      return result
    } finally {
      validatingFields.delete(path)
    }
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Submit
  // ──────────────────────────────────────────────

  /**
   * Validates the form and invokes `onSubmit` when validation passes.
   *
   * Before validation, all fields are marked as touched and dirty state is
   * synchronized so every potential error surfaces. If validation fails,
   * submission is aborted silently.
   * @param event Optional native submit event (`preventDefault` is called automatically).
   */
  async function submit(event?: SubmitEvent) {
    event?.preventDefault()

    // Prevent multiple submissions
    if (isSubmitting.value) return

    // Surface all errors by marking everything as touched + dirty-synced
    markAllFieldsAsTouched()
    syncAllDirtyStates()

    // Bump generation so stale in-flight validations are discarded
    const cycle = ++generation
    const paths = [...deepKeys(values)] as Array<Paths<TSchema>>
    markFieldsAsValidating(paths)
    isSubmitting.value = true

    try {
      const result = await executeSchemaValidation()

      // Abort if a newer whole-form operation superseded this submission
      if (cycle !== generation) return

      if (result.issues) {
        replaceErrors([...result.issues])
        return
      }

      // Validation passed — clear errors and invoke the consumer's handler
      clearErrors()
      await config.onSubmit?.(result.value)
    } finally {
      unmarkFieldsAsValidating(paths)
      isSubmitting.value = false
    }
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Reset
  // ──────────────────────────────────────────────

  /**
   * Resets the form to its initial state (or to new baselines if provided).
   *
   * Invalidates all in-flight validations, clears touched/dirty tracking,
   * and restores values and errors to their baselines.
   * @param nextValues Optional new baseline values.
   * @param nextErrors Optional new baseline errors.
   */
  function reset(nextValues?: Partial<InferInput<TSchema>>, nextErrors?: Array<Issue>) {
    // Invalidate every in-flight validation (whole-form + per-field)
    generation++
    fieldValidationCycleMap.clear()
    validatingFields.clear()

    // Update baselines if new ones were provided
    if (nextValues) {
      Object.assign(initialValues, klona(nextValues))
    }

    if (nextErrors) {
      initialErrors.splice(0, initialErrors.length, ...klona(nextErrors))
    }

    // Wipe current values, then restore from baseline
    for (const key of Object.keys(values)) {
      deleteProperty(values, key)
    }
    Object.assign(values, klona(initialValues))

    // Restore errors from baseline
    replaceErrors(klona(initialErrors))

    // Clear all interaction tracking
    unmarkAllFieldsAsTouched()
    unmarkAllFieldsAsDirty()
  }

  // #endregion

  // ──────────────────────────────────────────────
  // #region Instance assembly
  // ──────────────────────────────────────────────

  /** The assembled instance, wrapped in `reactive()` for deep reactivity. */
  const instance: Instance = reactive({
    clearErrors,
    dirtyFields,
    errors,
    getFieldErrors,
    isDirty,
    isSubmitting,
    isTouched,
    isValid,
    isValidating,
    markAllFieldsAsDirty,
    markAllFieldsAsTouched,
    markFieldAsDirty,
    markFieldAsTouched,
    replaceErrors,
    reset,
    setError,
    setValue,
    submit,
    touchedFields,
    unmarkAllFieldsAsDirty,
    unmarkAllFieldsAsTouched,
    unmarkFieldAsDirty,
    unmarkFieldAsTouched,
    validate,
    validateField,
    validatingFields,
    values,
  })

  return instance

  // #endregion
}
