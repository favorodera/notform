import type { NotFormAPI } from './not-form-api'
import type { ObjectSchema } from './shared'

/**
 * Props accepted by the `NotForm` wrapper component.
 * @template TSchema - The validation schema.
 */
export interface NotFormProps<TSchema extends ObjectSchema> {
  /** The form instance to provide to all descendant field components via injection. */
  form: NotFormAPI<TSchema>
}

/** Slot definitions for the `NotForm` wrapper component. */
export interface NotFormSlots {
  /** Default slot — place field components and other content here. */
  default?: () => void
}
