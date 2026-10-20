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

/** Slot props for `<Form>`. */
export interface FormSlots {
  /** Default slot content rendered inside the native form. */
  default?: () => void
}
