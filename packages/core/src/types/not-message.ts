import type { Component } from 'vue'
import type { NotFormAPI } from './not-form-api'
import type { ObjectSchema, Paths } from './shared'

/**
 * Props for `<NotMessage>`.
 * @template TSchema The form schema.
 */
export interface NotMessageProps<TSchema extends ObjectSchema> {
  /**
   * Root element or component.
   * @default 'span'
   */
  as?: Component | string

  /** Field path whose first error message is shown. */
  path: Paths<TSchema>

  /**
   * Form instance. Overrides `<NotForm>` inject. Required outside `<NotForm>`.
   */
  form?: NotFormAPI<TSchema>
}

/** Slot props for `<NotMessage>`. */
export interface NotMessageSlots {
  default?: (props: {
    /** First active error message for `path`. */
    message?: string
  }) => void
}
