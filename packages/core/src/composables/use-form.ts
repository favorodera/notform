import type { FormInstanceSettings } from '../types/instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'
import { createFormInstance } from '../factories/create-form-instance'

/**
 * @param settings
 */
export function useForm<TSchema extends ObjectSchema>(settings: FormInstanceSettings<TSchema>): UseFormReturn<TSchema> {
  return createFormInstance(settings) as UseFormReturn<TSchema>
}
