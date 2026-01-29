import type { NotFieldContext } from './not-field'
import type { VNodeChild } from 'vue'

/**
 * Configuration properties for the NotMessage component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotMessageProps = {
  /** The name/path of the field whose error message should be displayed */
  name: string
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
