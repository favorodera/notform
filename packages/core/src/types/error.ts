import type { Component } from 'vue'
import type { ObjectSchema, Path } from './shared'
import type { UseFormReturn } from './use-form'

/** Props for `<Error>`. */
export interface ErrorProps<TSchema extends ObjectSchema> {
  as?: Component | string
  form?: UseFormReturn<TSchema>
  path: Path<TSchema>
}

/** Slot props for `<Error>`. */
export interface ErrorSlots {
  default?: (props: { message?: string }) => void
}
