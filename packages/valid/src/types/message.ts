import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Paths } from 'type-fest'
import type { ObjectSchema } from './shared'
import type { FieldContext } from './field'
import type { VNodeChild } from 'vue'

/**
 * Configuration properties for the Message component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type MessageProps<TSchema extends ObjectSchema> = {
  /** The name/path of the field whose error message should be displayed */
  name: Paths<StandardSchemaV1.InferInput<TSchema>>
}

/**
 * State provided to the Message component's scope.
 */
export type MessageContext = {
  /** The first active validation error message for the specified field */
  message: FieldContext['errors'][number]
}

/**
 * Slots provided by the Message component.
 */
export type MessageSlots = {
  /** The default slot receives the error message context for custom rendering */
  default: (props: MessageContext) => VNodeChild
}
