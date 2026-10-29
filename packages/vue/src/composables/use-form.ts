import type { FormConfig, UseFormReturn } from '../types/form'
import type { ObjectSchema } from '../types/schema'
import { createForm } from '../factories/create-form'

export function useForm<TSchema extends ObjectSchema>(config: FormConfig<TSchema>) {
  const form = createForm(config)

  return form as UseFormReturn<TSchema>
}
