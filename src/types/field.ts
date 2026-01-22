import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema } from './shared'
import type { Paths } from './utils'
import { type VNodeChild } from 'vue'

/**
 * Properties accepted by the Field component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type FieldProps<TSchema extends ObjectSchema> = {
  /**
   * The name of the field.
   */
  name: Paths<StandardSchemaV1.InferInput<TSchema>>
}

/**
 * The context provided to the Field component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type FieldContext<TSchema extends ObjectSchema> = {
  /**
   * The name of the field.
   */
  name: Paths<StandardSchemaV1.InferInput<TSchema>>
  /**
   * The validation errors for the field.
   */
  errors: string[]
  /**
   * Whether the field has been touched.
   */
  isTouched: boolean
  /**
   * Whether the field has been modified.
   */
  isDirty: boolean
  /**
   * Whether the field is valid.
   */
  isValid: boolean
  /**
   * Methods to handle field events.
   */
  validate: () => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>
  methods: {
    /**
     * Handles the blur event for the field.
     */
    onBlur: () => void
    /**
     * Handles the change event for the field.
     */
    onChange: () => void
    /**
     * Handles the input event for the field.
     */
    onInput: () => void
    /**
     * Handles the focus event for the field.
     */
    onFocus: () => void
  }
}

export type FieldSlots<TSchema extends ObjectSchema> = {
  default: (props: FieldContext<TSchema>) => VNodeChild
}

