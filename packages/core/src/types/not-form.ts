import type { ObjectSchema } from './shared'
import type { UseNotFormInstance } from './use-not-form'

/**
 * Props for the NotForm component
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotFormProps<TSchema extends ObjectSchema> = {
  /** The form instance to use */
  instance: UseNotFormInstance<TSchema>
}

export type NotFormSlots<TSchema extends ObjectSchema> = {
  /** The default slot */
  default: (instance: UseNotFormInstance<TSchema>) => []
}
