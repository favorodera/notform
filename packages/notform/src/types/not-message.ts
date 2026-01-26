import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Paths } from 'type-fest'
import type { ObjectSchema } from './shared'
import type { NotFieldContext } from './not-field'
import type { VNodeChild } from 'vue'

/**
 * Configuration properties for the NotMessage component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotMessageProps<TSchema extends ObjectSchema> = {
  /** The name/path of the field whose error message should be displayed */
  name: Paths<StandardSchemaV1.InferInput<TSchema>>
}

/**
 * State provided to the NotMessage component's scope.
 */
export type NotMessageContext = {
  /** The first active validation error message for the specified field */
  message: NotFieldContext['errors'][number]
}

/**
 * Slots provided by the NotMessage component.
 */
export type NotMessageSlots = {
  /** The default slot receives the error message context for custom rendering */
  default: (props: NotMessageContext) => VNodeChild
}
