import type { Component } from 'vue'

/**
 * Props of the planned `<FieldError>` component.
 * @remarks Not implemented yet: `<FieldError>` is not exported from `index.ts`.
 * Named `FieldError` rather than `Error` so it can never shadow JavaScript's global `Error`.
 */
export type FieldErrorProps = {
  /** HTML tag name or Vue component used to render the message. */
  as?: Component | string
}

/** Slots of the planned `<FieldError>` component. */
export type FieldErrorSlots = {
  /** Receives the error `message` to display. */
  default?: (props: {
    message?: string
  }) => void
}
