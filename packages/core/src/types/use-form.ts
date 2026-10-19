import type { FormInstance, FormInstanceSettings } from './form-instance'
import type { ObjectSchema } from './shared'

/**
 * Settings to configure the form instance.
 * @template TSchema Validation schema.
 */
export type UseFormSettings<TSchema extends ObjectSchema> = FormInstanceSettings<TSchema>

/**
 * Public API returned by `useForm()` omitting internal helpers used by field components
 * @template TSchema The form schema.
 */
export type UseFormReturn<TSchema extends ObjectSchema> = Pick<
  FormInstance<TSchema>,
  'values'
>
