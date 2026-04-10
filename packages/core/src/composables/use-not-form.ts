import { computed, ref, toValue } from 'vue'
import type { Ref } from 'vue'
import { klona } from 'klona/full'
import { dequal } from 'dequal'
import { deepKeys, getProperty, parsePath, setProperty } from 'dot-prop'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { DeepPartial, ObjectSchema, Paths } from '../types/shared'
import type { UseNotFormConfig } from '../types/use-not-form'
import type { NotFormInstance } from '../types/not-form'
import { isIssuePathEqual } from '../utils/form-utils'

export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormInstance<TSchema> {
  type TInput = StandardSchemaV1.InferInput<TSchema>
  type TIssue = StandardSchemaV1.Issue
  type TInstance = NotFormInstance<TSchema>


  // BASELINE
  let initialValues = klona(config.initialValues ?? ({} as DeepPartial<TInput>))
  let initialErrors = [...(config.initialErrors ?? [])]


  // OPTIONS
  const validateOn = {
    onBlur: config.validateOn?.onBlur ?? true,
    onChange: config.validateOn?.onChange ?? true,
    onInput: config.validateOn?.onInput ?? true,
    onMount: config.validateOn?.onMount ?? false,
    onFocus: config.validateOn?.onFocus ?? false,
  }


  // REACTIVE STATE
  const values = ref(klona(initialValues)) as Ref<TInput>

  const errors = ref<TIssue[]>([...initialErrors])

  const touchedFields = ref(new Set<Paths<TInput>>()) as Ref<Set<Paths<TInput>>>

  const dirtyFields = ref(new Set<Paths<TInput>>()) as Ref<Set<Paths<TInput>>>

  const isSubmitting = ref(false)

  const validatingFields = ref(new Set<Paths<TInput>>()) as Ref<Set<Paths<TInput>>>


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

  const isDirty = computed(() => dirtyFields.value.size > 0)

  const isTouched = computed(() => touchedFields.value.size > 0)

  const isValidating = computed(() => validatingFields.value.size > 0)

  const isValid = computed(() => errors.value.length === 0)


  // TOUCH
  const touchField: TInstance['touchField'] = (path) => {
    touchedFields.value.add(path)
  }

  const unTouchField: TInstance['unTouchField'] = (path) => {
    touchedFields.value.delete(path)
  }

  const touchAllFields: TInstance['touchAllFields'] = () => {
    deepKeys(values.value).forEach(path => touchedFields.value.add(path as Paths<TInput>))
  }

  const unTouchAllFields: TInstance['unTouchAllFields'] = () => {
    touchedFields.value.clear()
  }


  // DIRTY
  const dirtyField: TInstance['dirtyField'] = (path) => {
    dirtyFields.value.add(path)
  }

  const unDirtyField: TInstance['unDirtyField'] = (path) => {
    dirtyFields.value.delete(path)
  }

  const dirtyAllFields: TInstance['dirtyAllFields'] = () => {
    deepKeys(values.value).forEach(path => dirtyFields.value.add(path as Paths<TInput>))
  }

  const unDirtyAllFields: TInstance['unDirtyAllFields'] = () => {
    dirtyFields.value.clear()
  }


  // VALUES
  const setValue: TInstance['setValue'] = (path, value) => {
    setProperty(values.value, path, value)
    touchField(path)

    const isFieldClean = dequal(value, getProperty(initialValues, path))

    if (isFieldClean) {
      unDirtyField(path)
      return
    }

    dirtyField(path)
  }

  const setValues: TInstance['setValues'] = (newValues) => {
    for (const [path, value] of Object.entries(newValues)) {
      setValue(path as Paths<TInput>, value)
    }
  }


  // ERRORS
  const setError: TInstance['setError'] = (newIssue) => {
    const newPath = newIssue.path?.join('.')
    // Filter out any existing error for this path then append the new one
    // ensures the array stays unique by path
    errors.value = [
      ...errors.value.filter(error => error.path?.join('.') !== newPath),
      newIssue,
    ]
  }

  const setErrors: TInstance['setErrors'] = (newIssues) => {
    errors.value = [...newIssues]
  }

  const clearErrors: TInstance['clearErrors'] = () => {
    errors.value = []
  }

  const getFieldErrors: TInstance['getFieldErrors'] = (path) => {
    const pathArray = parsePath(path)
    return errors.value.filter(error => isIssuePathEqual(error.path, pathArray))
  }


  // VALIDATION
  const validate: TInstance['validate'] = async () => {
    // Use all field paths as the validating signal for full-form validation
    const allPaths = deepKeys(values.value) as Paths<TInput>[]
    allPaths.forEach(path => validatingFields.value.add(path))

    try {
      const schema = toValue(config.schema)
      const result = await schema['~standard'].validate(values.value)

      if (result?.issues) {
        setErrors([...result.issues])
        return { issues: result.issues }
      }

      clearErrors()
      return { value: result.value }
    } finally {
      validatingFields.value.clear()
    }
  }

  const validateField: TInstance['validateField'] = async (path) => {
    validatingFields.value.add(path)

    try {
      const schema = toValue(config.schema)
      const result = await schema['~standard'].validate(values.value)
      const pathArray = parsePath(path)

      // Replace errors for this field only, leaving other fields untouched
      errors.value = errors.value.filter(error => !isIssuePathEqual(error.path, pathArray))

      if (result?.issues) {
        const fieldIssues = result.issues.filter(issue => isIssuePathEqual(issue.path, pathArray))
        if (fieldIssues.length > 0) {
          errors.value = [...errors.value, ...fieldIssues]
          return { issues: fieldIssues }
        }
        // Form has issues but not for this field — return current field value from state
        return { value: getProperty(values.value, path) }
      }

      return { value: getProperty(result.value, path) }
    } finally {
      validatingFields.value.delete(path)
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
    if (newErrors) initialErrors = [...newErrors]

    values.value = klona(initialValues) as TInput
    errors.value = [...initialErrors]

    touchedFields.value.clear()
    dirtyFields.value.clear()
  }


  // INSTANCE
  const instance = {
    initialValues,
    initialErrors,
    validateOn,

    values,
    setValue,
    setValues,

    touchedFields,
    touchField,
    unTouchField,
    touchAllFields,
    unTouchAllFields,
    isTouched,

    dirtyFields,
    dirtyField,
    unDirtyField,
    dirtyAllFields,
    unDirtyAllFields,
    isDirty,

    errors,
    errorsMap,
    setError,
    setErrors,
    clearErrors,
    getFieldErrors,

    validatingFields,
    isValidating,
    validate,
    validateField,
    isValid,

    isSubmitting,
    submit,

    reset,
  } satisfies Omit<TInstance, 'instance'>

  const resolvedInstance = instance as TInstance
  resolvedInstance.instance = resolvedInstance

  return resolvedInstance
}
