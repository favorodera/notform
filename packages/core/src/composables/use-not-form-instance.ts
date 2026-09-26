import { inject } from 'vue'
import type { NotFormAPI } from '../types/not-form-api'
import type { NotFormInstance } from '../types/not-form-instance'
import type { ObjectSchema } from '../types/shared'
import { NOT_FORM_INSTANCE_KEY, toNotFormInstance } from '../utils/instance'

/**
 * Resolves the full form instance from `explicitInstance` or inject.
 * @template TSchema The form schema.
 * @internal
 * @param explicitInstance Optional `form` prop, preferred over inject.
 * @returns The resolved instance.
 * @throws If neither prop nor inject is available.
 */
export function useNotFormInstance<TSchema extends ObjectSchema>(explicitInstance?: NotFormAPI<TSchema> | NotFormInstance<TSchema>) {
  const injectedInstance = inject<NotFormInstance<TSchema> | undefined>(NOT_FORM_INSTANCE_KEY, undefined)

  const resolvedInstance = toNotFormInstance(explicitInstance) ?? injectedInstance

  if (!resolvedInstance) {
    throw new Error(`
      [NotForm] No NotForm instance found.
      Wrap with <NotForm :form="[instance]"> or pass :form="[instance]" directly to the component.
      `)
  }

  return resolvedInstance
}
