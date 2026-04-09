import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { DeepPartial, ObjectSchema, Paths, ValidationTrigger } from './shared'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'

/**
 * Configuration options for initializing a new form instance.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type UseNotFormConfig<TSchema extends ObjectSchema> = {
  /** The validation schema used to parse and validate form data */
  schema: MaybeRefOrGetter<TSchema>


  /** The initial values of the form */
  initialValues?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>
  /** The initial errors of the form */
  initialErrors?: StandardSchemaV1.Issue[]


  /**
   * The validation triggers of the form
   * @default { onBlur: true, onChange: true, onInput: true }
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>
}

/**
 * The core state and methods provided by a form instance.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type UseNotFormInstance<TSchema extends ObjectSchema> = {
  /**
   * Validates and then triggers form submission.
   * @param event The original form submission event.
   */
  submit: (event: Event) => Promise<void>
  /**
   * Validates the entire form.
   * @returns A promise that resolves to the validation result.
   */
  validate: () => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>
  /**
   * Resets the form to its initial state.
   * @param values Optional new initial values.
   * @param errors Optional new initial errors.
   */
  reset: (values?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, errors?: StandardSchemaV1.Issue[]) => void


  /**
   * A convenience self-reference to the form instance if you prefer to destructure the composable return value
   */
  instance: UseNotFormInstance<TSchema>


  /** Deeply reactive object of field values */
  values: Ref<StandardSchemaV1.InferInput<TSchema>>
  /**
   * Updates a specific field value.
   * @param value The new value to apply.
   */
  setValue: <const TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>>(path: TPath, value: Get<StandardSchemaV1.InferInput<TSchema>, TPath, { strict: false }>) => void
  /**
   * Updates single or multiple field values.
   * @param values The new values to apply.
   */
  setValues: (values: DeepPartial<StandardSchemaV1.InferInput<TSchema>>) => void


  /** The raw issues from the last validation */
  errors: Ref<StandardSchemaV1.Issue[]>
  /**
   * A flat object mapping paths to their first error message.
   * Useful for quick template access: errorsMap['user.email']
   */
  errorsMap: ComputedRef<Partial<Record<Paths<StandardSchemaV1.InferInput<TSchema>>, string>>>
  /**
   * Directly sets a single field error.
   * @param error The error to apply.
   */
  setError: (error: StandardSchemaV1.Issue) => void
  /**
   * Directly sets single or multiple field errors.
   * @param errors The new set of errors.
   */
  setErrors: (errors: StandardSchemaV1.Issue[]) => void
  /** Removes all active validation issues */
  clearErrors: () => void
}
