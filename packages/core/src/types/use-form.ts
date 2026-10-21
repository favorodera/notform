import type { FormInstance } from './instance'
import type { ObjectSchema } from './shared'

/**
 * Public API returned by `useForm()`, excluding component-only helpers.
 * @template TSchema Object schema that defines form values and paths.
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
