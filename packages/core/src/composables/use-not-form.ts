import { computed, markRaw, reactive, ref, toValue } from 'vue'
import { klona } from 'klona/full'
import { dequal } from 'dequal'
import { getProperty, parsePath, setProperty, deepKeys, hasProperty, deleteProperty } from 'dot-prop'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { DeepPartial, ObjectSchema, Paths } from '../types/shared'
import type { UseNotFormConfig } from '../types/use-not-form'
import type { NotFormInstance } from '../types/not-form'
import { isIssuePathEqual, normalizeSegment } from '../utils/form-utils'

export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  type TInput = StandardSchemaV1.InferInput<TSchema>
  type TIssue = StandardSchemaV1.Issue
  type TInstance = NotFormInstance<TSchema>


  // INTERNAL UTILITIES


  /** Runs the schema against the current values and returns the raw result. */
  const runSchema = () => {
    const schema = toValue(config.schema)
    return schema['~standard'].validate(values)
  }

  /**
   * Marks all current leaf paths as touched.
   * Called internally on submit so all field errors surface at once.
   */
  const touchAllFields = () => {
    deepKeys(values).forEach(path =>
      touchedFields.add(path),
    )
  }

  /**
   * Marks all current leaf paths as dirty.
   * Called internally on submit so required-field errors are not suppressed.
   */
  const dirtyAllFields = () => {
    deepKeys(values).forEach(path =>
      dirtyFields.add(path),
    )
  }

  /** Removes a path from the dirty set without exposing the operation publicly. */
  const unDirtyField = (path: Paths<TInput>) => {
    dirtyFields.delete(path)
  }


  // BASELINE


  /**
   * Mutable so `reset()` can replace the reference when new values are provided.
   * Always deep-cloned to prevent external mutation from affecting the baseline.
   *
   * These are intentionally `let` — `reset()` replaces them, and the instance
   * exposes them via getters so consumers always read the current snapshot.
   * The `readonly` modifier on the type prevents external assignment while still
   * allowing the getter to return the latest value after a reset.
   */
  let initialValues = klona(config.initialValues ?? ({} as DeepPartial<TInput>))
  let initialErrors = klona(config.initialErrors ?? [])


  // OPTIONS


  const validateOn: TInstance['validateOn'] = {
    onBlur: config.validateOn?.onBlur ?? true,
    onChange: config.validateOn?.onChange ?? true,
    onInput: config.validateOn?.onInput ?? true,
    onMount: config.validateOn?.onMount ?? false,
    onFocus: config.validateOn?.onFocus ?? false,
  }

  const validationMode: TInstance['validationMode'] = {
    eager: config.validationMode?.eager ?? true,
    lazy: config.validationMode?.lazy ?? false,
  }


  // STATE


  /**
   * Deeply reactive object — access directly as `form.values.email`.
   * Using `reactive()` instead of `ref()` keeps behaviour consistent
   * across components, composables, and Pinia stores (which auto-unwrap refs).
   */
  const values = reactive(klona(initialValues)) as TInput

  /**
   * Reactive array mutated in-place to preserve reactivity.
   * Using `reactive()` instead of `ref()` prevents Pinia from unwrapping
   * the array and losing its reactive proxy.
   */
  const errors = reactive<TIssue[]>([...initialErrors])

  const isSubmitting = ref(false)
  const isValidating = ref(false)

  /**
   * Counter-based validation tracking.
   *
   * A boolean flag flips to `false` as soon as the first concurrent
   * validation resolves, even if others are still running.
   * A counter fixes this: `isValidating` stays `true` until every
   * in-flight call has settled.
   */
  let validatingCount = 0

  /** Increments the validation counter and sets `isValidating` to true. */
  const beginValidating = () => {
    validatingCount++
    isValidating.value = true
  }

  /** Decrements the validation counter and sets `isValidating` to false if the counter reaches zero. */
  const endValidating = () => {
    validatingCount--
    if (validatingCount === 0) isValidating.value = false
  }

  /**
   * Reactive Sets using `reactive()` for the same Pinia-compatibility reason
   * as `errors` above — `ref(new Set())` would be unwrapped to a plain Set.
   */
  const touchedFields = reactive(new Set<Paths<TInput>>())
  const dirtyFields = reactive(new Set<Paths<TInput>>())


  // COMPUTED


  const isValid = computed(() => errors.length === 0)
  const isDirty = computed(() => dirtyFields.size > 0)
  const isTouched = computed(() => touchedFields.size > 0)

  const errorsMap = computed(() => {
    return errors.reduce((errorsByPath, issue) => {
      if (!issue.path) return errorsByPath

      const path = issue.path.map(normalizeSegment).join('.') as Paths<TInput>

      if (path && !errorsByPath[path]) errorsByPath[path] = issue.message

      return errorsByPath
    }, {} as Partial<Record<Paths<TInput>, string>>)
  })


  // VALUES


  const setValue: TInstance['setValue'] = (path, value) => {
    setProperty(values, path, value)

    const isClean = dequal(value, getProperty(initialValues, path))
    if (isClean) unDirtyField(path)
    else dirtyField(path)
  }


  // TOUCH


  const touchField: TInstance['touchField'] = (path) => {
    touchedFields.add(path)
  }


  // DIRTY


  const dirtyField: TInstance['dirtyField'] = (path) => {
    dirtyFields.add(path)
  }


  // ERRORS


  const setError: TInstance['setError'] = (newIssue) => {
    const newPath = newIssue.path?.map(normalizeSegment).join('.')

    const existingIndex = errors.findIndex(
      error => error.path
        ?.map(normalizeSegment)
        .join('.') === newPath,
    )

    if (existingIndex !== -1) errors.splice(existingIndex, 1, newIssue)
    else errors.push(newIssue)
  }

  const setErrors: TInstance['setErrors'] = (newIssues) => {
    errors.splice(0, errors.length, ...newIssues)
  }

  const clearErrors: TInstance['clearErrors'] = () => {
    errors.splice(0, errors.length)
  }

  const getFieldErrors: TInstance['getFieldErrors'] = (path) => {
    const pathSegments = parsePath(path)
    return errors.filter(error => isIssuePathEqual(error.path, pathSegments))
  }


  // VALIDATION


  const validate: TInstance['validate'] = async () => {
    beginValidating()
    try {
      const result = await runSchema()

      if (result?.issues) {
        setErrors([...result.issues])
        return { issues: result.issues }
      }

      clearErrors()
      return { value: result.value }
    } finally {
      endValidating()
    }
  }

  const validateField: TInstance['validateField'] = async (path) => {
    beginValidating()
    try {
      const result = await runSchema()
      const pathSegments = parsePath(path)

      // Remove stale errors for this field in-place, back-to-front to preserve indices
      const staleIndices = errors.reduce<number[]>((indices, error, index) => {
        if (isIssuePathEqual(error.path, pathSegments)) indices.push(index)
        return indices
      }, [])
      for (let index = staleIndices.length - 1; index >= 0; index--) {
        errors.splice(staleIndices[index], 1)
      }

      if (result?.issues) {
        const fieldIssues = result.issues.filter(issue =>
          isIssuePathEqual(issue.path, pathSegments),
        )
        if (fieldIssues.length > 0) {
          errors.push(...fieldIssues)
          return { issues: fieldIssues }
        }
        // Form has issues but not for this field — return the field's current value
        return { value: getProperty(values, path) }
      }

      return { value: getProperty(result.value, path) }
    } finally {
      endValidating()
    }
  }


  // SUBMISSION


  const submit: TInstance['submit'] = async (event) => {
    isSubmitting.value = true

    try {
      touchAllFields()
      dirtyAllFields()

      const result = await validate()

      if (result?.issues) {
        // Validation failed — block native submission and stay on page
        event.preventDefault()
        return
      }

      if (config.onSubmit) {
        // Developer provided a JS handler — prevent native redirect and run it
        event.preventDefault()
        await config.onSubmit(result.value)
      }
      // No onSubmit provided — allow native form submission via the action attribute
    } catch {
      // Unexpected error during validation or submission — stay on page
      event.preventDefault()
    } finally {
      isSubmitting.value = false
    }
  }


  // RESET


  const reset: TInstance['reset'] = (newValues, newErrors) => {
    if (newValues) initialValues = klona(newValues)
    if (newErrors) initialErrors = klona(newErrors)

    const freshValues = klona(initialValues)
    const current = values

    // Remove top-level keys no longer present in the baseline
    for (const key of Object.keys(current)) {
      if (!hasProperty(freshValues, key)) {
        deleteProperty(values, key)
      }
    }

    // Restore baseline — top-level assignment lets Vue's reactive() re-wrap
    // nested structures and avoids sparse-array holes that arise from
    // leaf-by-leaf array element deletion
    for (const key of Object.keys(freshValues)) {
      setProperty(values, key, getProperty(freshValues, key))
    }

    errors.splice(0, errors.length, ...klona(initialErrors))
    touchedFields.clear()
    dirtyFields.clear()
  }


  // INSTANCE
  //
  // `initialValues` and `initialErrors` are exposed via getters so consumers
  // always read the post-reset snapshot rather than the stale reference
  // captured at construction time. The `readonly` modifier on the type
  // prevents external assignment — setters are intentionally omitted.


  const instance: TInstance = {
    get initialValues() { return initialValues as TInstance['initialValues'] },
    get initialErrors() { return initialErrors as TInstance['initialErrors'] },

    validateOn,
    validationMode,

    values,
    setValue,

    touchedFields,
    touchField,
    isTouched,

    dirtyFields,
    dirtyField,
    isDirty,

    errors,
    errorsMap,
    setError,
    setErrors,
    clearErrors,
    getFieldErrors,

    isValidating,
    validate,
    validateField,
    isValid,

    isSubmitting,
    submit,

    reset,
  }

  return markRaw(instance)
}
