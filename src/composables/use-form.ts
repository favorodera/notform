import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormContext, UseFormOptions, UseFormReturn } from '../types/form'
import type { Ref } from 'vue'
import { computed, provide, ref, toValue, useId } from 'vue'
import type { ObjectSchema } from '../types/shared'
import { getFormContextKey } from '../utils/form-context'
import type { DeepPartial, Paths } from '../types/utils'
import { getProperty, parsePath } from 'dot-prop'
import { isIssuePathEqual } from '../utils/helpers'

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
  } = options

  // Create a computed reference for the schema to support dynamic updates
  const schema = computed(() => toValue(_schema))

  // Create a clean copy of the initial state to prevent mutations of the original input
  const initialState = structuredClone(_initialState) as StandardSchemaV1.InferInput<TSchema>

  // Initialize the reactive form state with a clone of the initial state
  const state = ref(structuredClone(initialState)) as Ref<StandardSchemaV1.InferInput<TSchema>>

  // Initialize the reactive form errors with a clone of the initial errors
  const initialErrors = structuredClone(_initialErrors) as StandardSchemaV1.Issue[]

  // Initialize reactive errors with any provided initial validation issues
  const errors = ref<StandardSchemaV1.Issue[]>([...initialErrors])

  // Track the asynchronous validation process status
  const isValidating = ref(false)

  /** @see {@link FormContext.validate} */
  async function validate(): Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>> {
    isValidating.value = true
    
    try {
      // Execute the validation logic defined in the standard schema
      const result = await schema.value['~standard'].validate(state.value)
      
      // If schema validation failed, return early with issues
      if (result.issues) {
        errors.value = [...result.issues]
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
          return { issues: [formLevelError] }
        }
        
        if (Array.isArray(customResult) && customResult.length > 0) {
          // Field-specific validation errors
          errors.value = customResult
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
  function reset() {
    // Restore the form state from the initial snapshot
    state.value = structuredClone(initialState)
    // Clear or restore the initial errors
    errors.value = structuredClone(initialErrors)
    // Ensure validation status is reset
    isValidating.value = false
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

  // Assemble the form context object with all state and methods
  /** @see {@link FormContext} */
  const context: FormContext<TSchema> = {
    id,
    state,
    setState,
    initialState,
    errors,
    setErrors,
    getFieldErrors,
    initialErrors,
    schema,
    mode,
    validateOn,
    isValidating,
    validate,
    validateField,
    reset,
  }

  // Register and provide the form context using a unique injection key
  provide(getFormContextKey<TSchema>(id), context)

  // Return the context for local use within the component calling the composable
  return context
}

export default useForm
