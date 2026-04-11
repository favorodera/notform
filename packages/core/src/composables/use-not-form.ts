import { computed, ref, toValue } from 'vue'
import type { Ref } from 'vue'
import { klona } from 'klona/full'
import { dequal } from 'dequal'
import { getProperty, parsePath, setProperty } from 'dot-prop'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { DeepPartial, ObjectSchema, Paths } from '../types/shared'
import type { UseNotFormConfig } from '../types/use-not-form'
import type { NotFormInstance } from '../types/not-form'
import { isIssuePathEqual } from '../utils/form-utils'

export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  type TInput = StandardSchemaV1.InferInput<TSchema>
  type TIssue = StandardSchemaV1.Issue
  type TInstance = NotFormInstance<TSchema>

  // INTERNALS
  const runSchema = () => {
    const schema = toValue(config.schema)
    return schema['~standard'].validate(values.value)
  }


  // BASELINE
  let initialValues = klona(config.initialValues ?? ({} as DeepPartial<TInput>))
  let initialErrors = klona(config.initialErrors ?? [])


  // OPTIONS
  const validateOn = {
    onBlur: config.validateOn?.onBlur ?? true,
    onChange: config.validateOn?.onChange ?? true,
    onInput: config.validateOn?.onInput ?? true,
    onMount: config.validateOn?.onMount ?? false,
    onFocus: config.validateOn?.onFocus ?? false,
  }
  const validationMode = {
    eager: config.validationMode?.eager ?? true,
    lazy: config.validationMode?.lazy ?? false,
  }


  // REACTIVE STATE
  const values = ref(klona(initialValues)) as Ref<TInput>

  const errors = ref<TIssue[]>([...initialErrors])

  const isSubmitting = ref(false)

  const isValidating = ref(false)

  const allTouched = ref(false)
  const touchedFields = ref(new Set<Paths<TInput>>()) as Ref<Set<Paths<TInput>>>

  const allDirty = ref(false)
  const dirtyFields = ref(new Set<Paths<TInput>>()) as Ref<Set<Paths<TInput>>>


  // COMPUTED STATE
  const errorsMap = computed(() => {
    return errors.value.reduce((accumulator, issue) => {
      const path = issue.path?.join('.') as Paths<TInput>
      // Only keeps the first error per field path
      if (path && !accumulator[path]) {
        accumulator[path] = issue.message
      }
      return accumulator
    }, {} as Partial<Record<Paths<TInput>, string>>)
  })

  const isDirty = computed(() => dirtyFields.value.size > 0 || allDirty.value)

  const isTouched = computed(() => touchedFields.value.size > 0 || allTouched.value)

  const isValid = computed(() => errors.value.length === 0)


  // TOUCH
  const touchField: TInstance['touchField'] = (path) => {
    touchedFields.value.add(path)
  }

  const unTouchField: TInstance['unTouchField'] = (path) => {
    touchedFields.value.delete(path)
  }

  const touchAllFields: TInstance['touchAllFields'] = () => {
    allTouched.value = true
  }

  const unTouchAllFields: TInstance['unTouchAllFields'] = () => {
    touchedFields.value.clear()
    allTouched.value = false
  }


  // DIRTY
  const dirtyField: TInstance['dirtyField'] = (path) => {
    dirtyFields.value.add(path)
  }

  const unDirtyField: TInstance['unDirtyField'] = (path) => {
    dirtyFields.value.delete(path)
  }

  const dirtyAllFields: TInstance['dirtyAllFields'] = () => {
    allDirty.value = true
  }

  const unDirtyAllFields: TInstance['unDirtyAllFields'] = () => {
    dirtyFields.value.clear()
    allDirty.value = false
  }


  // VALUES
  const setValue: TInstance['setValue'] = (path, value) => {
    setProperty(values.value, path, value)
    touchField(path)

    const isFieldClean = dequal(value, getProperty(initialValues, path))

    if (isFieldClean) {
      unDirtyField(path)
    } else {
      dirtyField(path)
    }

    if (validateOn.onChange) {
      validateField(path)
    }
  }

  const setValues: TInstance['setValues'] = (newValues) => {
    for (const [path, value] of Object.entries(newValues)) {
      setValue(path as Paths<TInput>, value)
    }
  }


  // ERRORS
  const setError: TInstance['setError'] = (newIssue) => {
    const newPath = newIssue.path?.join('.')
    const index = errors.value.findIndex(error => error.path?.join('.') === newPath)

    if (index !== -1) {
      errors.value.splice(index, 1, newIssue) // replace existing
    } else {
      errors.value.push(newIssue) // append new
    }
  }

  const setErrors: TInstance['setErrors'] = (newIssues) => {
    errors.value.splice(0, errors.value.length, ...newIssues)
  }

  const clearErrors: TInstance['clearErrors'] = () => {
    errors.value.splice(0, errors.value.length)
  }

  const getFieldErrors: TInstance['getFieldErrors'] = (path) => {
    const pathArray = parsePath(path)
    return errors.value.filter(error => isIssuePathEqual(error.path, pathArray))
  }


  // VALIDATION
  const validate: TInstance['validate'] = async () => {
    isValidating.value = true

    try {
      const result = await runSchema()

      if (result?.issues) {
        setErrors([...result.issues])
        return { issues: result.issues }
      }

      clearErrors()
      return { value: result.value }
    } finally {
      isValidating.value = false
    }
  }

  const validateField: TInstance['validateField'] = async (path) => {
    isValidating.value = true

    try {
      const result = await runSchema()
      const pathArray = parsePath(path)

      // Remove this field's errors in-place
      const toRemove = errors.value.reduce<number[]>((accumulator, error, index) => {
        if (isIssuePathEqual(error.path, pathArray)) accumulator.push(index)
        return accumulator
      }, [])

      for (let index = toRemove.length - 1; index >= 0; index--) {
        errors.value.splice(toRemove[index], 1)
      }

      if (result?.issues) {
        const fieldIssues = result.issues.filter(issue => isIssuePathEqual(issue.path, pathArray))

        if (fieldIssues.length > 0) {
          errors.value.push(...fieldIssues) // in-place
          return { issues: fieldIssues }
        }

        // Form has issues but not for this field — return current field value from state
        return { value: getProperty(values.value, path) }
      }

      return { value: getProperty(result.value, path) }
    } finally {
      isValidating.value = false
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
        event.preventDefault()
        return
      }

      if (config.onSubmit) {
        // Developer provided onSubmit — handle in JS, prevent native redirect
        event.preventDefault()
        await config.onSubmit(result.value)
      }
      // No onSubmit — allow native form submission via action attribute
    } catch {
      event.preventDefault()
    } finally {
      isSubmitting.value = false
    }
  }


  // RESET
  const reset: TInstance['reset'] = (newValues, newErrors) => {
    if (newValues) initialValues = klona(newValues)
    if (newErrors) initialErrors = klona(newErrors)

    values.value = klona(initialValues)
    errors.value.splice(0, errors.value.length, ...klona(initialErrors))

    unTouchAllFields() // also resets isSubmitted
    unDirtyAllFields() // also resets allDirty
  }


  // INSTANCE
  const instance: TInstance = {
    initialValues,
    initialErrors,

    validateOn,
    validationMode,

    values,
    setValue,
    setValues,

    touchedFields,
    touchField,
    unTouchField,
    touchAllFields,
    unTouchAllFields,
    isTouched,
    allTouched,

    dirtyFields,
    dirtyField,
    unDirtyField,
    dirtyAllFields,
    unDirtyAllFields,
    isDirty,
    allDirty,

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

  return instance
}
