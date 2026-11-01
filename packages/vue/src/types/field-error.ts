import type { Component } from 'vue'
import type { ValidationIssue } from './validation'

/** Props of the `<FieldError>` component. */
export type FieldErrorProps = {
  /**
   * HTML tag name or Vue component used to render the message.
   * @default 'span'
   */
  as?: Component | string

  /** A list of issues, or anything that has one (a field, an array field, an array item). Only the first message is shown. */
  errors: ValidationIssue[] | { readonly errors: ValidationIssue[] }
}

/** Slots of the `<FieldError>` component. */
export type FieldErrorSlots = {
  /** Receives the `message` to display. */
  default?: (props: { message?: string }) => void
}
