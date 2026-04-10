import type { MaybeRefOrGetter } from 'vue'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { DeepPartial, ObjectSchema, ValidationTrigger } from './shared'

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
   * The validation triggers of the form.
   * @default { onBlur: true, onChange: true, onInput: true }
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>
  /**
   * Callback triggered when form validation passes and the form is submitted.
   * @param values The validated output data from the schema.
   */
  onSubmit?: (values: StandardSchemaV1.InferOutput<TSchema>) => void | Promise<void>
}


