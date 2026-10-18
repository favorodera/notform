import type { NotFormInstance } from './not-form-instance'
import type { ObjectSchema } from './shared'

/**
 * Public API returned by `useNotForm`. Omits internal path sets and mutation
 * helpers used by field components; use aggregate flags and slot props instead.
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
