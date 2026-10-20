import type { FormInstance } from './instance'
import type { ObjectSchema } from './shared'

/**
 * Public API returned by `useForm()` omitting internal helpers used by field components
 * @template TSchema The form schema.
 */
export type UseFormReturn<TSchema extends ObjectSchema> = Pick<
  FormInstance<TSchema>,
  'errors'
  | 'getFieldErrors'
  | 'isDirty'
  | 'isSubmitted'
  | 'isSubmitting'
  | 'isTouched'
  | 'isValid'
  | 'isValidating'
  | 'reset'
  | 'setError'
  | 'setValue'
  | 'submit'
  | 'submitCount'
  | 'validate'
  | 'validateField'
  | 'values'
>
