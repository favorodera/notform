import type { Component } from 'vue'
import type { ValidationIssue } from './validation'

/**
 * Props of the planned `<FieldError>` component.
 * @remarks Not implemented yet: `<FieldError>` is not exported from `index.ts`.
 */
export type FieldErrorProps = {
  /** HTML tag name or Vue component used to render the message. */
  as?: Component | string

  errors: ValidationIssue[] | { readonly errors: ValidationIssue[] }
}

/** Slots of the planned `<FieldError>` component. */
export type FieldErrorSlots = {
  /** Receives the error `message` to display. */
  default?: (props: {
    message?: string
  }) => void
}
