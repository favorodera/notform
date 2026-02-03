import type { NotFieldContext } from './not-field'
import type { useAttrs, VNodeChild } from 'vue'

/**
 * Configuration properties for the NotMessage component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotMessageProps = {
  /** The name/path of the field whose error message should be displayed */
  name: string
  /** HTML Tag `NotMessage` should render as - default is `span`. */
  as?: string
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
  default: (props: NotMessageContext & { attributes?: ReturnType<typeof useAttrs> }) => VNodeChild
}
