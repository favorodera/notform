import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { MaybeRefOrGetter } from 'vue'
import type { DeepPartial, ObjectSchema, ValidationMode, ValidationTrigger } from './shared'

/**
 * Configuration options for initializing a new form instance.
 * @template TSchema The form schema.
 */
export interface UseNotFormConfig<TSchema extends ObjectSchema> {
  /** The validation schema used to parse and validate form data */
  schema: MaybeRefOrGetter<TSchema>

  /** The initial values of the form */
  initialValues?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>

  /** The initial errors of the form */
  initialErrors?: Array<StandardSchemaV1.Issue>

  /**
   * The validation triggers of the form.
   * @default { onBlur: true, onChange: true, onInput: true }
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>

  /**
   * The validation mode of the form.
   * @default { eager: true }
   */
  validationMode?: Partial<Record<ValidationMode, boolean>>

  /**
   * Callback triggered when form validation passes and the form is submitted.
   * @param values The validated output data from the schema.
   */
  onSubmit?: (values: StandardSchemaV1.InferOutput<TSchema>) => Promise<void> | void
}
