import type { Component } from 'vue'
import type { ObjectSchema, Path } from './shared'
import type { UseFormReturn } from './use-form'

/**
 * Props for `<Error>`.
 * @template TSchema Schema that defines the error path.
 */
export interface ErrorProps<TSchema extends ObjectSchema> {
  /** Element or component used to render the message; defaults to `span`. */
  as?: Component | string

  /** Explicit form instance, overriding the injected instance. */
  form?: UseFormReturn<TSchema>

  /** Path whose first current issue should be rendered. */
  path: Path<TSchema>
}

/** Slot props for `<Error>`. */
export interface ErrorSlots {
  /**
   * Renders the current error message with custom content.
   * @param props First issue message, when one exists.
   * @param props.message First current issue message, when available.
   * @returns Nothing; Vue renders the slot template.
   */
  default?: (props: {
    /** First issue message, when present. */
    message?: string
  }) => void
}
