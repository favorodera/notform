import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormContext, UseFormOptions, UseFormReturn } from '../types/form'
import type { Ref } from 'vue'
import { computed, provide, ref, toValue, useId } from 'vue'
import type { ObjectSchema } from '../types/shared'
import { getFormContextKey } from '../utils/form-context'
import type { DeepPartial, Paths } from '../types/utils'
import { getProperty, parsePath } from 'dot-prop'
import { getObjectPaths, isIssuePathEqual } from '../utils/helpers'

/**
 * Initializes a form instance with validation logic, reactive state, and lifecycle methods.
 * It sets up the internal reactivity and provides the form context to descendant components.
 * @template TSchema The validation schema type extending ObjectSchema.
 * @param options Configuration object for the form behavior and initial state.
 * @returns An object containing the form context and management methods.
 */
function useForm<TSchema extends ObjectSchema>(options: UseFormOptions<TSchema>): UseFormReturn<TSchema> {
  // Destructure options with default values for ID, errors, state, and validation behavior
  const {
    id = useId(),
    schema: _schema,
    initialErrors: _initialErrors = [],
    initialState: _initialState = {},
    mode = 'lazy',
    validateOn = ['blur', 'input', 'change'],
    onValidate,
    onReset,
    onError,
  } = options

  // Create a computed reference for the schema to support dynamic updates
  /** @see {@link FormContext.schema} */
  const schema = computed(() => toValue(_schema))

  // Create a clean copy of the initial state to prevent mutations of the original input
  /** @see {@link FormContext.initialState} */
  const initialState = structuredClone(_initialState) as StandardSchemaV1.InferInput<TSchema>

  // Initialize the reactive form state with a clone of the initial state
  /** @see {@link FormContext.state} */
  const state = ref(structuredClone(initialState)) as Ref<StandardSchemaV1.InferInput<TSchema>>

  // Initialize the reactive form errors with a clone of the initial errors
  /** @see {@link FormContext.initialErrors} */
  const initialErrors = structuredClone(_initialErrors) as StandardSchemaV1.Issue[]

  // Initialize reactive errors with any provided initial validation issues
  /** @see {@link FormContext.errors} */
  const errors = ref<StandardSchemaV1.Issue[]>([...initialErrors])

  // Track the state set by the last reset() call with custom values
  // Used as the baseline for dirty field comparison when not null
  const onResetState = ref<StandardSchemaV1.InferInput<TSchema> | null>(null)

  // Track the errors set by the last reset() call with custom values
  // Used as the baseline for error comparison when not null
  const onResetErrors = ref<StandardSchemaV1.Issue[] | null>(null)

  // Track the asynchronous validation process status
  /** @see {@link FormContext.isValidating} */
  const isValidating = ref(false)

  // Track the form validation status
  /** @see {@link FormContext.isValid} */
  const isValid = computed(() => errors.value.length === 0)

  // Track touched fields
  /** @see {@link FormContext.touchedFields} */
  const touchedFields = ref(new Set<string>()) as Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>

  // Track if any field has been touched
  /** @see {@link FormContext.isTouched} */
  const isTouched = computed(() => touchedFields.value.size > 0)

  // Track dirty fields
  /** @see {@link FormContext.dirtyFields} */
  const dirtyFields = ref(new Set<string>()) as Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>

  // Track if any field has been dirty
  /** @see {@link FormContext.isDirty} */
  const isDirty = computed(() => dirtyFields.value.size > 0)

  /** @see {@link FormContext.validate} */
  async function validate(): Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>> {
    isValidating.value = true

    try {
      // Execute the validation logic defined in the standard schema
      const result = await schema.value['~standard'].validate(state.value)

      // If schema validation failed, return early with issues
      if (result.issues) {
        errors.value = [...result.issues]

        // Call onError if provided
        if (onError) {
          onError([...result.issues])
        }

        return { issues: result.issues }
      }

      // Schema validation passed - run custom validation if provided
      if (onValidate) {
        const customResult = await onValidate(result.value)

        // Handle different return types
        if (customResult === false) {
          // Form-level validation failed (no specific field errors)
          const formLevelError: StandardSchemaV1.Issue = {
            message: 'Validation failed',
            path: [],
          }
          errors.value = [formLevelError]

          // Call onError if provided
          if (onError) {
            onError([formLevelError])
          }

          return { issues: [formLevelError] }
        }

        if (Array.isArray(customResult) && customResult.length > 0) {
          // Field-specific validation errors
          errors.value = customResult

          // Call onError if provided
          if (onError) {
            onError(customResult)
          }

          return { issues: customResult }
        }

        // customResult is true, void, or empty array - validation passed
      }

      // All validations passed
      errors.value = []
      return { value: result.value }
    }
    finally {
      isValidating.value = false
    }
  }

  /** @see {@link FormContext.reset} */
  function reset(_state?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _errors?: StandardSchemaV1.Issue[], _validate: boolean = false) {
    if (_state) {
      // Custom state provided completely overrides, store as onResetState
      onResetState.value = structuredClone(_state) as StandardSchemaV1.InferInput<TSchema>
      state.value = structuredClone(_state) as StandardSchemaV1.InferInput<TSchema>
    }
    else {
      // No custom state provided, clear onResetState and use initialState
      onResetState.value = null
      state.value = structuredClone(initialState)
    }

    if (_errors) {
      // Custom errors provided completely override, store as onResetErrors
      onResetErrors.value = structuredClone(_errors)
      errors.value = [..._errors]
    }
    else {
      // No custom errors provided, clear onResetErrors and use initialErrors
      onResetErrors.value = null
      errors.value = [...initialErrors]
    }

    // Clear touched fields
    touchedFields.value.clear()
    // Clear dirty fields
    dirtyFields.value.clear()

    // Run reset callback if provided
    if (onReset) {
      onReset()
    }

    // Validate if required
    if (_validate) {
      validate()
    }
  }

  /** @see {@link FormContext.setState} */
  function setState(_state: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _validate: boolean = true) {
    // Update the state with the new values
    state.value = { ...state.value, ..._state }
    // Validate if required
    if (_validate) {
      validate()
    }
  }

  /** @see {@link FormContext.setErrors} */
  function setErrors(_errors: StandardSchemaV1.Issue[]) {
    errors.value = [...errors.value, ..._errors]
  }

  /** @see {@link FormContext.clearErrors} */
  function clearErrors() {
    errors.value = []
  }

  /** @see {@link FormContext.validateField} */
  async function validateField(path: Paths<StandardSchemaV1.InferInput<TSchema>>) {
    isValidating.value = true

    try {
      // Validate current state
      const result = await schema.value['~standard'].validate(state.value)

      // Parse the path
      const pathArray = parsePath(path)

      // Remove existing errors for the field
      errors.value = errors.value.filter(error => !isIssuePathEqual(error.path, pathArray))

      if (result.issues) {
        // Extract errors for this specific path
        const errorsForPath = result.issues.filter(error => isIssuePathEqual(error.path, pathArray))

        if (errorsForPath.length > 0) {
          // This field has errors
          errors.value = [...errors.value, ...errorsForPath]
          return { issues: errorsForPath }
        }

        // This field is valid, but other fields have errors
        // Extract value from current state (which we know is valid for this field)
        const valueForPath = getProperty(state.value, path)
        return { value: valueForPath }
      }

      // Full validation success
      const valueForPath = getProperty(result.value, path)
      return { value: valueForPath }
    }
    finally {
      isValidating.value = false
    }
  }

  /** @see {@link FormContext.getFieldErrors} */
  function getFieldErrors(field: Paths<StandardSchemaV1.InferInput<TSchema>>) {
    // Parse the path
    const pathArray = parsePath(field)
    // Filter errors for this specific path
    return errors.value.filter(error => isIssuePathEqual(error.path, pathArray))
  }

  /** @see {@link FormContext.touchField} */
  function touchField(field: Paths<StandardSchemaV1.InferInput<TSchema>>) {
    touchedFields.value.add(field)
  }

  /** @see {@link FormContext.touchAllFields} */
  function touchAllFields() {
    const paths = getObjectPaths(state.value) as Paths<StandardSchemaV1.InferInput<TSchema>>[]
    touchedFields.value = new Set(paths)
  }

  /** @see {@link FormContext.dirtyField} */
  function dirtyField(field: Paths<StandardSchemaV1.InferInput<TSchema>>) {
    const currentValue = getProperty(state.value, field)
    // Use onResetState if available (custom reset was called), otherwise use initialState
    const baselineState = onResetState.value ?? initialState
    const baselineValue = getProperty(baselineState, field)

    if (currentValue !== baselineValue) {
      dirtyFields.value.add(field)
    }
    else {
      dirtyFields.value.delete(field)
    }
  }

  /** @see {@link FormContext.dirtyAllFields} */
  function dirtyAllFields() {
    const paths = getObjectPaths(state.value) as Paths<StandardSchemaV1.InferInput<TSchema>>[]
    dirtyFields.value = new Set(paths)
  }

  /**
 * Submits the form.
 */
  async function submit(event?: Event, callback?: (data: StandardSchemaV1.InferOutput<TSchema>) => void | Promise<void>) {
    // Prevent default event behavior
    event?.preventDefault()
    event?.stopPropagation()

    // Validate the form
    const result = await validate()

    // If there are errors, return the result
    if (result.issues) {
      errors.value = [...result.issues]
      return
    }

    // Validation is successful...

    // Mark all fields as touched
    touchAllFields()

    // Mark all fields as dirty
    dirtyAllFields()

    // Call the callback if provided
    if (callback) {
      await callback(result.value)
    }
  }

  // Assemble the form context object with all state and methods
  /** @see {@link FormContext} */
  const context: FormContext<TSchema> = {
    id,
    state,
    setState,
    initialState,
    errors,
    setErrors,
    clearErrors,
    getFieldErrors,
    initialErrors,
    schema,
    mode,
    validateOn,
    isValidating,
    validate,
    validateField,
    reset,
    isValid,
    isTouched,
    isDirty,
    touchedFields,
    dirtyFields,
    touchField,
    touchAllFields,
    dirtyField,
    dirtyAllFields,
    submit,
  }

  // Register and provide the form context using a unique injection key
  provide(getFormContextKey<TSchema>(id), context)

  // Return the context for local use within the component calling the composable
  return context
}

export default useForm
