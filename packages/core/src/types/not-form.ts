import type { NotFormAPI } from './not-form-api'
import type { ObjectSchema } from './shared'

/**
 * Props for `<NotForm>`.
 * @template TSchema The form schema.
 */
export interface NotFormProps<TSchema extends ObjectSchema> {
  /** Form instance provided to descendant field components. */
  form: NotFormAPI<TSchema>
}

/** Slot props for `<NotForm>`. */
export interface NotFormSlots {
  default?: () => void
}
