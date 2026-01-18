import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormContext, UseFormOptions, UseFormReturn } from '../types/form'
import type { Ref } from 'vue'
import { computed, provide, ref, toValue, useId } from 'vue'
import type { ObjectSchema } from '../types/shared'
import { getFormContextKey } from '../utils/form-context'

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
    initialErrors = [],
    initialState: _initialState = {},
    mode = 'lazy',
    validateOn = ['blur', 'input', 'change'],
  } = options

  // Create a computed reference for the schema to support dynamic updates
  const schema = computed(() => toValue(_schema))

  // Create a clean copy of the initial state to prevent mutations of the original input
  const initialState = structuredClone(_initialState) as StandardSchemaV1.InferInput<TSchema>

  // Initialize the reactive form state with a clone of the initial state
  const state = ref(structuredClone(initialState)) as Ref<StandardSchemaV1.InferInput<TSchema>>

  // Initialize reactive errors with any provided initial validation issues
  const errors = ref<StandardSchemaV1.Issue[]>([...initialErrors])

  // Track the asynchronous validation process status
  const isValidating = ref(false)

  /**
   * Validates the current form state against the resolved schema.
   * Updates the errors reactive reference with any issues found.
   * @returns A promise resolving to the validation result containing either issues or parsed data.
   */
  async function validate(): Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>> {
    isValidating.value = true

    // Execute the validation logic defined in the standard schema
    const result = await schema.value['~standard'].validate(state.value)

    // Assign any validation issues back to the reactive errors array
    errors.value = result.issues ? [...result.issues] : []
    isValidating.value = false

    // Return the result following the Standard Schema result structure
    return result.issues ? { issues: result.issues } : { value: result.value }
  }

  /**
   * Resets the form state and error tracking to their original starting values.
   */
  function reset() {
    // Restore the form state from the initial snapshot
    state.value = structuredClone(initialState)
    // Clear or restore the initial errors
    errors.value = [...initialErrors]
    // Ensure validation status is reset
    isValidating.value = false
  }

  // Assemble the form context object with all state and methods
  const context: FormContext<TSchema> = {
    id,
    state,
    initialState,
    errors,
    initialErrors,
    schema,
    mode,
    validateOn,
    isValidating,
    validate,
    reset,
  }

  // Register and provide the form context using a unique injection key
  provide(getFormContextKey<TSchema>(id), context)

  // Return the context for local use within the component calling the composable
  return context
}

export default useForm
