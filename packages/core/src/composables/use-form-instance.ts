import { inject } from 'vue'
import type { FormInstance } from '../types/instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'
import { FORM_INSTANCE_KEY } from '../helpers/instance'

/**
 * Resolves the form instance from an explicit prop or Vue injection.
 * @template TSchema Object schema owned by the form.
 * @param explicitInstance Optional instance that takes precedence over injection.
 * @returns The resolved form instance.
 * @throws If no explicit or injected form instance exists.
 */
export function useFormInstance<TSchema extends ObjectSchema>(explicitInstance?: FormInstance<TSchema> | UseFormReturn<TSchema>) {
  /** Instance injected by the nearest `<Form>`, when available. */
  const injectedInstance = inject<FormInstance<TSchema> | undefined>(FORM_INSTANCE_KEY, undefined)

  /** Prefer the explicit instance so a field can override its parent form. */
  const resolvedInstance = explicitInstance as FormInstance<TSchema> | undefined ?? injectedInstance

  if (!resolvedInstance) {
    throw new Error(`
      [notform] No form instance found.
      Wrap with <Form :form="[instance]"> or pass :form="[instance]" directly to the component.
      `)
  }

  return resolvedInstance
}
