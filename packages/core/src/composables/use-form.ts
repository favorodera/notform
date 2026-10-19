import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn, UseFormSettings } from '../types/use-form'
import { createFormInstance } from '../factories/create-form-instance'

/**
 * Creates a form instance and returns the public API cast.
 * @param settings Settings to configure the form instance
 * @returns Public form API. Child components still inject the full instance via `<NotForm>`.
 */
export function useForm<TSchema extends ObjectSchema>(settings: UseFormSettings<TSchema>) {
  return createFormInstance(settings) as UseFormReturn<TSchema>
}
