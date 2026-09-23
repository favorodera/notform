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
 * @returns Assembled {@link NotFormInstance}.
 */
export function createNotFormInstance<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  type Instance = NotFormInstance<TSchema>

  // #region State

  /** Baseline values for reset. */
  const initialValues = klona(config.initialValues ?? {} as InferInput<TSchema>)

  /** Live field values. */
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

      if (cycle !== generation) {
        return result
      }

      if (result.issues) {
        replaceErrors([...result.issues])
      } else {
        clearErrors()
      }

      return result
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

      if (generation !== startGeneration || fieldValidationCycleMap.get(path) !== cycle) {
        return result
      }

      const targetPath = parsePath(path)

      for (let errorIndex = errors.length - 1; errorIndex >= 0; errorIndex--) {
        if (areIssuePathsEqual(errors[errorIndex].path, targetPath)) {
          errors.splice(errorIndex, 1)
        }
      }

      const fieldIssues = (result.issues ?? []).filter(issue => areIssuePathsEqual(issue.path, targetPath))
      errors.push(...fieldIssues)

      return result
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
    generation++
    fieldValidationCycleMap.clear()
    validatingFieldCounts.clear()
    validatingFields.clear()

    if (nextValues) {
      const freshValues = klona(nextValues)

      for (const key of Object.keys(initialValues)) {
        deleteProperty(initialValues, key)
      }

      Object.assign(initialValues, freshValues)
    }

    if (nextErrors) {
      initialErrors.splice(0, initialErrors.length, ...klona(nextErrors))
    }

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