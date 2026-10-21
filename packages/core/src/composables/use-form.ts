import type { FormInstanceSettings } from '../types/instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'
import { createFormInstance } from '../factories/create-form-instance'

/**
 * Creates a form instance and exposes its public API.
 * @template TSchema Object schema used to infer input and output types.
 * @param settings Schema, initial state, and optional submit handler.
 * @returns The reactive form API.
 */
export function useForm<TSchema extends ObjectSchema>(settings: FormInstanceSettings<TSchema>): UseFormReturn<TSchema> {
  return createFormInstance(settings) as UseFormReturn<TSchema>
}
