import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Paths } from 'type-fest'
import type { ObjectSchema } from './shared'
import type { FieldContext } from './field'
import type { VNodeChild } from 'vue'

/**
 * Properties accepted by the Message component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type MessageProps<TSchema extends ObjectSchema> = {
  /**
   * The name of the field.
   */
  name: Paths<StandardSchemaV1.InferInput<TSchema>>
}


/**
 * The context provided to the Message component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type MessageContext<TSchema extends ObjectSchema> = {
  /**
   * The validation error for the field.
   */
  message: FieldContext<TSchema>['errors'][number]
}

/**
 * The slots provided to the Message component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type MessageSlots<TSchema extends ObjectSchema> = {
  default: (props: MessageContext<TSchema>) => VNodeChild
}
