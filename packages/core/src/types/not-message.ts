import type { Component } from 'vue'
import type { NotFormAPI } from './not-form-api'
import type { ObjectSchema, Paths } from './shared'

/**
 * Props accepted by the `NotMessage` component.
 * @template TSchema The validation schema.
 */
export interface NotMessageProps<TSchema extends ObjectSchema> {
  /**
   * HTML tag name or component to render as the root element.
   * @default 'span'
   */
  as?: Component | string

  /** Dot-notated field path whose error message should be displayed. */
  path: Paths<TSchema>

  /**
   * Explicit form instance.
   *
   * Takes priority over the instance provided by an ancestor `<NotForm>`.
   * Required when using `<NotMessage>` outside of `<NotForm>`.
   */
  form?: NotFormAPI<TSchema>
}

/** Slot definitions for the `NotMessage` component. */
export interface NotMessageSlots {
  /** Custom render slot for the error message. */
  default?: (props: {
    /** The first active validation error message for the specified field. */
    message?: string
  }) => void
}
