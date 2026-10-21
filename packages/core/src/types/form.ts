import type { ObjectSchema } from './shared'
import type { UseFormReturn } from './use-form'

/**
 * Props for `<Form>`.
 * @template TSchema The form schema.
 */
export interface FormProps<TSchema extends ObjectSchema> {
  /** Form instance provided to descendant field components. */
  form: UseFormReturn<TSchema>
}

/** Slots rendered by `<Form>`. */
export interface FormSlots {
  /**
   * Renders child content inside the native form element.
   * @returns Nothing; Vue renders the slot template.
   */
  default?: () => void
}
