import type { NotFormInstance } from './not-form-instance'
import type { ObjectSchema } from './shared'

/**
 * Public API from `useNotForm`: {@linkcode NotFormInstance} without `@internal` members.
 * @template TSchema The form schema.
 */
export type NotFormAPI<TSchema extends ObjectSchema> = Pick<
  NotFormInstance<TSchema>,
  | 'errors'
  | 'getFieldErrors'
  | 'isDirty'
  | 'isSubmitting'
  | 'isTouched'
  | 'isValid'
  | 'isValidating'
  | 'reset'
  | 'setError'
  | 'setValue'
  | 'submit'
  | 'validate'
  | 'validateField'
  | 'values'
>
