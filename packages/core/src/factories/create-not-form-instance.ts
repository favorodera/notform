import type { Get } from 'type-fest'
import { dequal } from 'dequal'
import { deepKeys, deleteProperty, getProperty, parsePath, setProperty } from 'dot-prop'
import { klona } from 'klona'
import { computed, reactive, ref, toValue } from 'vue'
import type { UseNotFormConfig } from '../types/not-form-config'
import type { NotFormInstance } from '../types/not-form-instance'
import type { DeepPartial, InferInput, Issue, ObjectSchema, Paths } from '../types/shared'
import { areIssuePathsEqual } from '../utils/issues'

/**
 * Builds the full reactive form instance used by `useNotForm` and field components.
 * @template TSchema The form schema.
 * @internal
 * @param config Schema, initial values/errors, and submit handler.
 * @returns Assembled {@linkcode NotFormInstance}.
 */
export function createNotFormInstance<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  type Instance = NotFormInstance<TSchema>

  // #region State

  /** Baseline values for reset. */
  // Cloned so mutating `values` later can never leak back into this baseline.
  const initialValues = klona(config.initialValues ?? {} as InferInput<TSchema>)

  /** Live field values. */
  // Cloned again from `initialValues` (not the same reference) so `values`
  // and `initialValues` can diverge independently once fields change.
  const values = reactive(klona(initialValues))

  /** Baseline issues for reset. */
  const initialErrors = klona(config.initialErrors ?? [] as Array<Issue>)

  /** Current validation issues. */
  const errors = reactive<Array<Issue>>([...initialErrors])

  /** Paths the user has interacted with. */
  const touchedFields = reactive(new Set<Paths<TSchema>>())

  const isTouched = computed(() => touchedFields.size > 0)

  /** Paths whose value differs from the baseline. */
  const dirtyFields = reactive(new Set<Paths<TSchema>>())

  const isDirty = computed(() => dirtyFields.size > 0)

  /** Paths with an in-flight validation. */
  const validatingFields = reactive(new Set<Paths<TSchema>>())

  const isValid = computed(() => errors.length === 0)

  const isValidating = computed(() => validatingFields.size > 0)

  const isSubmitting = ref(false)

  /**
   * Bumped by validate, submit, and reset. Older in-flight runs are discarded:
   * each still resolves with its own result, but only the run matching the
   * current generation when it finishes gets to write to `errors`.
   */
  let generation = 0

  /** Latest per-field validation cycle id, used to drop stale field results. */
  const fieldValidationCycleMap = new Map<Paths<TSchema>, number>()

  /** Active validation count per path so overlapping runs do not clear too early. */
  const validatingFieldCounts = new Map<Paths<TSchema>, number>()

  // #endregion

  // #region Schema execution

  /**
   * Runs the current schema against `values`. Resolves `config.schema`
   * first via `toValue`, so a ref or a getter function works the same as
   * passing the schema directly.
   * @returns Standard Schema result.
   */
  function executeSchemaValidation() {
    const schema = toValue(config.schema)
    return schema['~standard'].validate(values)
  }

  // #endregion

  // #region Values

  /**
   * Sets a field value and syncs its dirty flag. Does not validate.
   * @template TPath Field path.
   * @param path Dot path.
   * @param value Value to assign.
   */
  function setValue<TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) {
    setProperty(values, path, value)
    syncDirtyState(path)
  }

  // #endregion

  // #region Errors

  /**
   * Upserts an issue at the same path, or appends it.
   * @param error Issue to set.
   */
  function setError(error: Issue) {
    const existingIndex = errors.findIndex(existing => areIssuePathsEqual(existing.path, error.path))

    if (existingIndex === -1) {
      errors.push(error)
    } else {
      errors[existingIndex] = error
    }
  }

  /**
   * Replaces the entire error list.
   * @internal
   * @param nextErrors Replacement issues.
   */
  function replaceErrors(nextErrors: Array<Issue>) {
    // Splice in place rather than reassigning `errors` — it's a `reactive()`
    // array, so replacing the reference would break existing subscriptions.
    errors.splice(0, errors.length, ...nextErrors)
  }

  /**
   * Removes every issue.
   * @internal
   */
  function clearErrors() {
    errors.length = 0
  }

  /**
   * Issues whose path exactly equals `path` — see the same note on
   * {@linkcode NotFormInstance.getFieldErrors}.
   * @param path Dot path.
   * @returns Matching issues.
   */
  function getFieldErrors(path: Paths<TSchema>) {
    const targetPath = parsePath(path)
    return errors.filter(error => areIssuePathsEqual(error.path, targetPath))
  }

  // #endregion

  // #region Dirty

  /**
   * Forces a field dirty.
   * @internal
   * @param path Dot path.
   */
  function markFieldAsDirty(path: Paths<TSchema>) {
    dirtyFields.add(path)
  }

  /**
   * Forces every current leaf field dirty. Only paths present in `values`
   * right now are affected — see the note on
   * {@linkcode NotFormInstance.markAllFieldsAsTouched}.
   * @internal
   */
  function markAllFieldsAsDirty() {
    for (const path of deepKeys(values)) {
      dirtyFields.add(path)
    }
  }

  /**
   * Clears dirty state for one field.
   * @internal
   * @param path Dot path.
   */
  function unmarkFieldAsDirty(path: Paths<TSchema>) {
    dirtyFields.delete(path)
  }

  /**
   * Clears dirty state for all fields.
   * @internal
   */
  function unmarkAllFieldsAsDirty() {
    dirtyFields.clear()
  }

  /**
   * Sets dirty from a deep compare against the baseline.
   * @internal
   * @param path Dot path.
   */
  function syncDirtyState(path: Paths<TSchema>) {
    const currentValue = getProperty(values, path)
    const baselineValue = getProperty(initialValues, path)

    // Deep compare (not `===`) since values can be objects/arrays — dirty
    // means "differs in content from baseline," not "different reference."
    const isUnchanged = dequal(currentValue, baselineValue)

    if (isUnchanged) {
      unmarkFieldAsDirty(path)
    } else {
      markFieldAsDirty(path)
    }
  }

  /**
   * Recalculates dirty state for every current leaf path.
   * @internal
   */
  function syncAllDirtyStates() {
    for (const path of deepKeys(values)) {
      syncDirtyState(path)
    }
  }

  // #endregion

  // #region Touch

  /**
   * Marks a field as touched.
   * @internal
   * @param path Dot path.
   */
  function markFieldAsTouched(path: Paths<TSchema>) {
    touchedFields.add(path)
  }

  /**
   * Marks every current leaf field as touched. Only paths present in
   * `values` right now are affected — see the note on
   * {@linkcode NotFormInstance.markAllFieldsAsTouched}.
   * @internal
   */
  function markAllFieldsAsTouched() {
    for (const path of deepKeys(values)) {
      touchedFields.add(path)
    }
  }

  /**
   * Clears touched state for one field.
   * @internal
   * @param path Dot path.
   */
  function unmarkFieldAsTouched(path: Paths<TSchema>) {
    touchedFields.delete(path)
  }

  /**
   * Clears touched state for all fields.
   * @internal
   */
  function unmarkAllFieldsAsTouched() {
    touchedFields.clear()
  }

  // #endregion

  // #region Validation

  /**
   * Increments the in-flight validation count for each path.
   * @internal
   * @param paths Field paths.
   */
  function markFieldsAsValidating(paths: Iterable<Paths<TSchema>>) {
    for (const path of paths) {
      // A count, not a boolean flag: `validate()` and `validateField()` can
      // both be running against the same path at once, and the path must
      // stay "validating" until *every* overlapping run has finished.
      validatingFieldCounts.set(path, (validatingFieldCounts.get(path) ?? 0) + 1)
      validatingFields.add(path)
    }
  }

  /**
   * Decrements in-flight counts and clears a path when the count hits zero.
   * @internal
   * @param paths Field paths.
   */
  function unmarkFieldsAsValidating(paths: Iterable<Paths<TSchema>>) {
    for (const path of paths) {
      const nextCount = (validatingFieldCounts.get(path) ?? 0) - 1

      // Only clear once every overlapping run for this path has finished —
      // an earlier finisher must not mark the path as done for a later one.
      if (nextCount <= 0) {
        validatingFieldCounts.delete(path)
        validatingFields.delete(path)
      } else {
        validatingFieldCounts.set(path, nextCount)
      }
    }
  }

  /**
   * Validates the whole form, replacing all errors. Bumps `generation`; see
   * {@linkcode NotFormInstance.validate} for the concurrency guarantee this gives.
   * @returns Standard Schema result.
   */
  async function validate() {
    const cycle = ++generation
    const paths = [...deepKeys(values)] as Array<Paths<TSchema>>
    markFieldsAsValidating(paths)

    try {
      const result = await executeSchemaValidation()

      // A newer `validate()`/`submit()`/`reset()` started while this one was
      // awaiting the schema — let it resolve normally, but don't let its
      // (now stale) result overwrite whatever the newer run already wrote.
      if (cycle !== generation) {
        return result
      }

      if (result.issues) {
        const issues = [...result.issues]

        replaceErrors(issues)

        return { issues }
      }

      clearErrors()

      return { value: result.value }
    } finally {
      unmarkFieldsAsValidating(paths)
    }
  }

  /**
   * Validates the form and writes issues only for `path`. `path` can be any
   * granularity — see {@linkcode NotFormInstance.validateField}.
   *
   * Dropped if a newer call for the same path or a newer whole-form generation starts.
   * @param path Dot path.
   * @returns Standard Schema result.
   */
  async function validateField(path: Paths<TSchema>) {
    const cycle = (fieldValidationCycleMap.get(path) ?? 0) + 1
    fieldValidationCycleMap.set(path, cycle)

    const startGeneration = generation

    markFieldsAsValidating([path])

    try {
      const result = await executeSchemaValidation()

      // Two independent staleness checks: `generation` catches a whole-form
      // `validate()`/`submit()`/`reset()` that superseded this call, while
      // the per-path cycle id catches a *newer* `validateField()` call for
      // this same path — either one means this result must not be written.
      if (generation !== startGeneration || fieldValidationCycleMap.get(path) !== cycle) {
        return result
      }

      const targetPath = parsePath(path)

      // Iterate backwards so splicing mid-loop doesn't skip the element
      // that shifts into the current index.
      for (let errorIndex = errors.length - 1; errorIndex >= 0; errorIndex--) {
        if (areIssuePathsEqual(errors[errorIndex].path, targetPath)) {
          errors.splice(errorIndex, 1)
        }
      }

      const fieldIssues = (result.issues ?? []).filter(issue => areIssuePathsEqual(issue.path, targetPath))
      errors.push(...fieldIssues)

      if (fieldIssues.length > 0) {
        return {
          issues: fieldIssues,
        }
      }

      return {
        value: getProperty(values, path),
      }
    } finally {
      unmarkFieldsAsValidating([path])
    }
  }

  // #endregion

  // #region Submit

  /**
   * Touches all fields, validates, then runs `onSubmit` when valid.
   * @param event Optional submit event. `event.preventDefault()` is called
   * immediately if `event` is given, before checking whether a submission
   * is already in flight or whether validation passes.
   */
  async function submit(event?: SubmitEvent) {
    event?.preventDefault()

    // Guards against double-submit (e.g. a rapid double-click) — a second
    // call while one is already running is simply ignored.
    if (isSubmitting.value) {
      return
    }

    markAllFieldsAsTouched()
    syncAllDirtyStates()

    const cycle = ++generation
    const paths = [...deepKeys(values)] as Array<Paths<TSchema>>
    markFieldsAsValidating(paths)
    isSubmitting.value = true

    try {
      const result = await executeSchemaValidation()

      // Same staleness guard as `validate()`: something newer (another
      // submit, a validate, or a reset) has already taken over.
      if (cycle !== generation) {
        return
      }

      if (result.issues) {
        replaceErrors([...result.issues])
        return
      }

      clearErrors()
      await config.onSubmit?.(result.value)
    } finally {
      unmarkFieldsAsValidating(paths)
      isSubmitting.value = false
    }
  }

  // #endregion

  // #region Reset

  /**
   * Restores values and errors to the baseline. Optional arguments become
   * the new baseline and fully replace the previous one — see
   * {@linkcode NotFormInstance.reset} for the "replace, not merge" detail.
   * @param nextValues New baseline values.
   * @param nextErrors New baseline issues.
   */
  function reset(nextValues?: DeepPartial<InferInput<TSchema>>, nextErrors?: Array<Issue>) {
    // Bumping `generation` here (rather than just clearing the maps below)
    // is what makes any `validate()`/`submit()` already in flight land as a
    // no-op instead of overwriting what reset is about to set.
    generation++
    fieldValidationCycleMap.clear()
    validatingFieldCounts.clear()
    validatingFields.clear()

    if (nextValues) {
      const freshValues = klona(nextValues)

      // Delete-then-assign instead of reassigning `initialValues` itself:
      // it's a plain object referenced elsewhere by closure, so the object
      // identity has to be preserved — only its contents can change.
      for (const key of Object.keys(initialValues)) {
        deleteProperty(initialValues, key)
      }

      Object.assign(initialValues, freshValues)
    }

    if (nextErrors) {
      initialErrors.splice(0, initialErrors.length, ...klona(nextErrors))
    }

    // Same delete-then-assign pattern here, but for a stronger reason:
    // `values` is `reactive()`, so replacing the object outright would
    // break every existing binding/computed that closed over this reference.
    for (const key of Object.keys(values)) {
      deleteProperty(values, key)
    }
    Object.assign(values, klona(initialValues))

    replaceErrors(klona(initialErrors))

    unmarkAllFieldsAsTouched()
    unmarkAllFieldsAsDirty()
  }

  // #endregion

  // #region Instance assembly

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
    syncAllDirtyStates,
    syncDirtyState,
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
