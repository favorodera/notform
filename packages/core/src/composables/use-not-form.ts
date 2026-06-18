import type { StandardSchemaV1 } from '@standard-schema/spec'
import { dequal } from 'dequal'
import { deepKeys, deleteProperty, getProperty, hasProperty, parsePath, setProperty } from 'dot-prop'
import { klona } from 'klona/full'
import { computed, markRaw, reactive, ref, toValue } from 'vue'
import type { NotFormInstance } from '../types/not-form'
import type { DeepPartial, ObjectSchema, Paths } from '../types/shared'
import type { UseNotFormConfig } from '../types/use-not-form'
import { isIssuePathEqual, normalizeSegment } from '../utils/form-utils'

/**
 * Creates a NotFormInstance with reactive state for form values, errors, touched fields, and dirty fields.
 * @template TSchema The validation schema type derived from `ObjectSchema`.
 * @param config Configuration object for the form instance.
 * @returns An instance of NotFormInstance.
 */
export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  type TInput = StandardSchemaV1.InferInput<TSchema>
  type TIssue = StandardSchemaV1.Issue
  type TInstance = NotFormInstance<TSchema>

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

  const validateOn: TInstance['validateOn'] = {
    onBlur: config.validateOn?.onBlur ?? true,
    onChange: config.validateOn?.onChange ?? true,
    onFocus: config.validateOn?.onFocus ?? false,
    onInput: config.validateOn?.onInput ?? true,
    onMount: config.validateOn?.onMount ?? false,
  }

  const validationMode: TInstance['validationMode'] = {
    eager: config.validationMode?.eager ?? true,
    lazy: config.validationMode?.lazy ?? false,
  }

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
  const errors = reactive<Array<TIssue>>([...initialErrors])

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

  const touchedFields = reactive(new Set<Paths<TInput>>())
  const dirtyFields = reactive(new Set<Paths<TInput>>())

  const isValid = computed(() => errors.length === 0)
  const isDirty = computed(() => dirtyFields.size > 0)
  const isTouched = computed(() => touchedFields.size > 0)

  const errorsMap = computed(() => {
    const result: Partial<Record<Paths<TInput>, string>> = {}

    for (const issue of errors) {
      if (issue.path) {
        const path = issue.path.map(element => normalizeSegment(element)).join('.') as Paths<TInput>

        if (path && !result[path]) {
          result[path] = issue.message
        }
      }
    }

    return result
  })

  const touchField: TInstance['touchField'] = (path) => {
    touchedFields.add(path)
  }

  const touchAllFields = () => {
    for (const path of deepKeys(values)) touchedFields.add(path)
  }

  const dirtyField: TInstance['dirtyField'] = (path) => {
    dirtyFields.add(path)
  }

  const unDirtyField = (path: Paths<TInput>) => {
    dirtyFields.delete(path)
  }

  const setError: TInstance['setError'] = (newIssue) => {
    const newPath = newIssue.path?.map(element => normalizeSegment(element)).join('.')

    const existingIndex = errors.findIndex(error => error.path
      ?.map(element => normalizeSegment(element))
      .join('.') === newPath)

    if (existingIndex === -1) {
      errors.push(newIssue)
    } else {
      errors[existingIndex] = newIssue
    }
  }

  const setErrors: TInstance['setErrors'] = (newIssues) => {
    errors.splice(0, errors.length, ...newIssues)
  }

  const setValue: TInstance['setValue'] = (path, value) => {
    setProperty(values, path, value)

    const isClean = dequal(value, getProperty(initialValues, path))
    if (isClean) unDirtyField(path)
    else dirtyField(path)
  }

  const clearErrors: TInstance['clearErrors'] = () => {
    errors.splice(0)
  }

  const getFieldErrors: TInstance['getFieldErrors'] = (path) => {
    const pathSegments = parsePath(path)
    return errors.filter(error => isIssuePathEqual(error.path, pathSegments))
  }

  const runSchema = () => {
    const schema = toValue(config.schema)
    return schema['~standard'].validate(values)
  }

  const dirtyAllFields = () => {
    for (const path of deepKeys(values)) dirtyFields.add(path)
  }

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
      const staleIndices: Array<number> = []
      for (const [
        index,
        error,
      ] of errors.entries()) {
        if (isIssuePathEqual(error.path, pathSegments)) {
          staleIndices.push(index)
        }
      }

      for (let index = staleIndices.length - 1; index >= 0; index--) {
        errors.splice(staleIndices[index], 1)
      }

      if (result?.issues) {
        const fieldIssues = result.issues.filter(issue => isIssuePathEqual(issue.path, pathSegments))
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

  // `initialValues` and `initialErrors` are exposed via getters so consumers
  // always read the post-reset snapshot rather than the stale reference
  // captured at construction time. The `readonly` modifier on the type
  // prevents external assignment — setters are intentionally omitted.
  const instance: TInstance = {
    get initialErrors() {
      return initialErrors as TInstance['initialErrors']
    },
    get initialValues() {
      return initialValues as TInstance['initialValues']
    },

    validateOn,
    validationMode,

    setValue,
    values,

    isTouched,
    touchedFields,
    touchField,

    dirtyField,
    dirtyFields,
    isDirty,

    clearErrors,
    errors,
    errorsMap,
    getFieldErrors,
    setError,
    setErrors,

    isValid,
    isValidating,
    validate,
    validateField,

    isSubmitting,
    submit,

    reset,
  }

  return markRaw(instance)
}
