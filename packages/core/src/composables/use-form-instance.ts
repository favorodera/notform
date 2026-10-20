import { inject } from 'vue'
import type { FormInstance } from '../types/instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'
import { FORM_INSTANCE_KEY } from '../helpers/instance'

/**
 * Resolves the full form instance from `explicitInstance` or inject.
 * @template TSchema The form schema.
 * @param explicitInstance Optional `form` prop, preferred over inject.
 * @returns The resolved instance.
 * @throws If neither prop nor inject is available.
 */
export function useFormInstance<TSchema extends ObjectSchema>(explicitInstance?: FormInstance<TSchema> | UseFormReturn<TSchema>) {
  /** Instance provided by the nearest `<NotForm>`, if present. */
  const injectedInstance = inject<FormInstance<TSchema> | undefined>(FORM_INSTANCE_KEY, undefined)


  /** Explicit prop instance, falling back to the nearest provider. */
  const resolvedInstance = explicitInstance as FormInstance<TSchema> | undefined ?? injectedInstance

  if (!resolvedInstance) {
    throw new Error(`
      [NotForm] No form instance found.
      Wrap with <Form :form="[instance]"> or pass :form="[instance]" directly to the component.
      `)
  }

  return resolvedInstance
}
