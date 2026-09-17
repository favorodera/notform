import { inject, type InjectionKey, provide } from 'vue'
import type { NotFormAPI } from '../types/not-form-api'
import type { NotFormInstance } from '../types/not-form-instance'
import type { ObjectSchema } from '../types/shared'
import { toNotFormInstance } from '../utils/instance'

/**
 * Vue injection key for the full {@linkcode NotFormInstance}.
 * @internal
 */
export const NOT_FORM_INSTANCE_KEY: InjectionKey<NotFormInstance<any>> = Symbol('notform:instance')

/**
 * Provides the full {@linkcode NotFormInstance} to the Vue component tree.
 *
 * Called once by the `<NotForm>` component so child components
 * (`NotField`, `NotArrayField`, `NotMessage`) can inject it.
 * @template TSchema The validation schema.
 * @internal
 * @param instance The form instance or public API to provide.
 */
export function provideNotFormInstance<TSchema extends ObjectSchema>(instance: NotFormAPI<TSchema> | NotFormInstance<TSchema>) {
  provide<NotFormInstance<TSchema>>(NOT_FORM_INSTANCE_KEY, toNotFormInstance(instance))
}

/**
 * Retrieves the full {@linkcode NotFormInstance} from the Vue component tree.
 *
 * Used internally by `NotField`, `NotArrayField`, and `NotMessage`
 * to access both the public API and private coordination helpers.
 * @template TSchema The validation schema.
 * @internal
 * @param explicitInstance Optional instance or API passed via a `form` prop, bypassing the `<NotForm>` provider.
 * @returns The resolved {@linkcode NotFormInstance}.
 * @throws If no instance is found via injection or prop.
 */
export function useNotFormInstance<TSchema extends ObjectSchema>(explicitInstance?: NotFormAPI<TSchema> | NotFormInstance<TSchema>) {
  const injectedInstance = inject<NotFormInstance<TSchema> | undefined>(NOT_FORM_INSTANCE_KEY, undefined)

  // Prefer an explicitly provided instance over the injected one
  const resolvedInstance = toNotFormInstance(explicitInstance) ?? injectedInstance

  if (!resolvedInstance) {
    throw new Error(`
      [NotForm] No NotForm instance found.
      Wrap with <NotForm :form="[instance]"> or pass :form="[instance]" directly to the component.
      `)
  }

  return resolvedInstance
}
