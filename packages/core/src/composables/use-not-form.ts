import type { StandardSchemaV1 } from '@standard-schema/spec'
import { dequal } from 'dequal'
import { deepKeys, deleteProperty, getProperty, hasProperty, parsePath, setProperty } from 'dot-prop'
import { klona } from 'klona/full'
import { computed, markRaw, reactive, ref, toValue } from 'vue'
import type { NotFormInstance } from '../types/not-form'
import type { DeepPartial, ObjectSchema, Paths } from '../types/shared'
import type { UseNotFormConfig } from '../types/use-not-form'
import { isIssuePathEqual, normalizeSegment } from '../utils/form'

/**
 * Creates a reactive NotFormInstance for managing form state and validation.
 * @template TSchema The standard schema type.
 * @param config Configuration object.
 * @returns A reactive NotFormInstance.
 */
export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  // Types & Aliases

  type TInput = StandardSchemaV1.InferInput<TSchema>
  type TIssue = StandardSchemaV1.Issue
  type TInstance = NotFormInstance<TSchema>

  // Internal State

  let initialValues = klona(config.initialValues ?? ({} as DeepPartial<TInput>))
  let initialErrors = klona(config.initialErrors ?? [])

  // Public State

  const validateOn: TInstance['validateOn'] = {
    onBlur: config.validateOn?.onBlur ?? true,
    onChange: config.validateOn?.onChange ?? true,
    onFocus: config.validateOn?.onFocus ?? false,
    onInput: config.validateOn?.onInput ?? true,
    onMount: config.validateOn?.onMount ?? false,
  }

  const validationMode: TInstance['validationMode'] = config.validationMode || 'eager'

  const values = reactive(klona(initialValues)) as TInput
  const errors = reactive<Array<TIssue>>([...initialErrors])

  const touchedFields = reactive(new Set<Paths<TInput>>())
  const dirtyFields = reactive(new Set<Paths<TInput>>())

  const isSubmitting = ref(false)

  // Public Computed

  const isValid = computed(() => errors.length === 0)
  const isDirty = computed(() => dirtyFields.size > 0)
  const isTouched = computed(() => touchedFields.size > 0)

  const errorsMap = computed(() => {
    const result: Partial<Record<Paths<TInput>, string>> = {}

    for (const issue of errors) {
      if (!issue.path) {
        continue
      }

      const path = issue.path.map(element => normalizeSegment(element)).join('.') as Paths<TInput>

      if (path && !Object.hasOwn(result, path)) {
        result[path] = issue.message
      }
    }

    return result
  })

  // Public Validation State

  /** Whether one or more validation operations are currently running. */
  const isValidating = ref(false)

  // Internal Validation State

  /** Number of validation operations currently in progress. */
  const validatingCount = ref(0)

  /** Identifier of the latest validation cycle. */
  let validationCycle = 0

  /**
   * Starts a validation operation.
   * @returns The identifier of the new validation cycle.
   */
  function beginValidation() {
    validatingCount.value++
    isValidating.value = true

    return ++validationCycle
  }

  /** Marks a validation operation as finished. */
  function endValidation() {
    validatingCount.value--

    if (validatingCount.value === 0) {
      isValidating.value = false
    }
  }

  /**
   * Checks whether a validation cycle is still the latest cycle.
   * @param cycle The validation cycle identifier.
   * @returns Whether the cycle is still current.
   */
  function isCurrentValidation(cycle: number) {
    return cycle === validationCycle
  }

  // Internal Helpers & Setters

  /**
   * Resolves and executes the standard schema validation.
   * @returns The validation result containing either `value` or `issues`.
   */
  function runSchema() {
    const schema = toValue(config.schema)
    return schema['~standard'].validate(values)
  }

  /** Iterates through deeply nested keys to mark all as touched. */
  function touchAllFields() {
    for (const path of deepKeys(values)) {
      touchedFields.add(path)
    }
  }

  /**
   * Removes a specific field path from the dirty tracking set.
   * @param path The field path to mark as clean.
   */
  function unDirtyField(path: Paths<TInput>) {
    dirtyFields.delete(path)
  }

  /** Iterates through deeply nested keys to mark all as dirty. */
  function dirtyAllFields() {
    for (const path of deepKeys(values)) {
      dirtyFields.add(path)
    }
  }

  // Public Setters

  /**
   * Marks a specific field path as touched.
   * @param path The field path to mark as touched.
   */
  function touchField(path: Paths<TInput>) {
    touchedFields.add(path)
  }

  /**
   * Marks a specific field path as dirty.
   * @param path The field path to mark as dirty.
   */
  function dirtyField(path: Paths<TInput>) {
    dirtyFields.add(path)
  }

  /**
   * Sets a value at the specified path and updates dirty tracking based on comparison with initial values.
   * @param path The field path to set the value at.
   * @param value The value to set.
   */
  function setValue(path: Paths<TInput>, value: any) {
    setProperty(values, path, value)

    const isClean = dequal(value, getProperty(initialValues, path))

    if (isClean) {
      unDirtyField(path)
    } else {
      dirtyField(path)
    }
  }

  /**
   * Sets or updates an error issue in the errors array, replacing any existing issue for the same path.
   * @param newIssue The issue to set.
   */
  function setError(newIssue: TIssue) {
    const newPath = newIssue.path?.map(element => normalizeSegment(element)).join('.')

    const existingIndex = errors.findIndex((error) => {
      return error
        .path
        ?.map(element => normalizeSegment(element))
        .join('.') === newPath
    })

    if (existingIndex === -1) {
      errors.push(newIssue)
    } else {
      errors[existingIndex] = newIssue
    }
  }

  /**
   * Sets multiple error issues in the errors array, replacing all existing issues.
   * @param newIssues The array of issues to set.
   */
  function setErrors(newIssues: Array<TIssue>) {
    errors.splice(0, errors.length, ...newIssues)
  }

  /** Clears all error issues from the errors array. */
  function clearErrors() {
    errors.length = 0
  }

  /**
   * Retrieves all error issues associated with a specific field path.
   * @param path The field path to retrieve errors for.
   * @returns An array of error issues associated with the field path.
   */
  function getFieldErrors(path: Paths<TInput>): Array<TIssue> {
    const pathSegments = parsePath(path)

    return errors.filter(error => isIssuePathEqual(error.path, pathSegments))
  }

  // Public Actions

  /**
   * Validates the entire form against the schema, updating errors and returning the result.
   *
   * Only the latest validation cycle is allowed to mutate form validation state.
   * @returns An object containing either `value` or `issues` based on validation outcome.
   */
  async function validate() {
    const cycle = beginValidation()

    try {
      const result = await runSchema()

      // Ignore stale results. The result is still returned to preserve
      // the public Standard Schema result type.
      if (!isCurrentValidation(cycle)) {
        return result
      }

      if (result.issues) {
        const issues = [...result.issues]

        setErrors(issues)

        return { issues }
      }

      clearErrors()

      return { value: result.value }
    } finally {
      endValidation()
    }
  }

  /**
   * Validates a specific field against the schema, updating errors and returning the result.
   *
   * Only the latest validation cycle is allowed to mutate form validation state.
   * @param path The field path to validate.
   * @returns An object containing either `value` or `issues` based on validation outcome.
   */
  async function validateField(path: Paths<TInput>) {
    const cycle = beginValidation()

    try {
      const result = await runSchema()

      // Ignore stale results from mutating form error state.
      if (!isCurrentValidation(cycle)) {
        return result
      }

      const pathSegments = parsePath(path)

      // Remove stale errors in-place, back-to-front to preserve indices.
      const staleIndices: Array<number> = []

      for (const [index, error] of errors.entries()) {
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

        return {
          value: getProperty(values, path),
        }
      }

      return {
        value: getProperty(result.value as Record<string, any>, path),
      }
    } finally {
      endValidation()
    }
  }

  /**
   * Submits the form, validating it and executing the submit handler if provided.
   *
   * Duplicate submissions are ignored while a submission is already in progress.
   * @param event The submit event.
   */
  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault()

    if (isSubmitting.value) {
      return
    }

    isSubmitting.value = true

    const cycle = beginValidation()

    try {
      touchAllFields()
      dirtyAllFields()

      const result = await runSchema()

      // A newer validation started while the submission was validating.
      if (!isCurrentValidation(cycle)) {
        return
      }

      // Validation failed.
      if (result.issues) {
        setErrors([...result.issues])
        return
      }

      clearErrors()

      if (config.onSubmit) {
        await config.onSubmit(result.value)
      }
    } finally {
      endValidation()
      isSubmitting.value = false
    }
  }

  /**
   * Resets the form to its initial state.
   * @param newValues The new values to reset the form with.
   * @param newErrors The new errors to reset the form with.
   */
  function reset(newValues?: DeepPartial<TInput>, newErrors?: Array<TIssue>) {
    if (newValues) {
      initialValues = klona(newValues)
    }

    if (newErrors) {
      initialErrors = klona(newErrors)
    }

    const freshValues = klona(initialValues)

    // Remove top-level keys no longer present in the baseline.
    for (const key of Object.keys(values)) {
      if (!hasProperty(freshValues, key)) {
        deleteProperty(values, key)
      }
    }

    // Restore baseline cleanly to trigger Vue's nested reactivity.
    for (const key of Object.keys(freshValues)) {
      setProperty(values, key, getProperty(freshValues, key))
    }

    errors.splice(0, errors.length, ...klona(initialErrors))
    touchedFields.clear()
    dirtyFields.clear()
  }

  // Instance Assembly & Return

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
