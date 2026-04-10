import { type InjectionKey, inject, provide } from 'vue'
import type { NotFormInstance } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'

/** Injection key for the current active form instance */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NOT_FORM_INSTANCE_KEY: InjectionKey<NotFormInstance<any>> = Symbol('notform:instance')

/**
 * Provides a form instance to all descendant components.
 * @param instance The form instance to provide.
 */
export function provideNotFormInstance<TSchema extends ObjectSchema>(instance: NotFormInstance<TSchema>) {
  provide(NOT_FORM_INSTANCE_KEY, instance)
}


/**
 * Resolves the active form instance from context or an explicit prop override.
 * @param explicitInstance Optional instance passed directly via :form prop — takes priority over injected context.
 * @throws If no instance is found from either source.
 */
export function useNotFormInstance<TSchema extends ObjectSchema>(explicitInstance?: NotFormInstance<TSchema>) {
  const injected = inject(NOT_FORM_INSTANCE_KEY) as NotFormInstance<TSchema>
  const instance = explicitInstance ?? injected

  if (!instance) {
    throw new Error('[NotForm] No form instance found. Add a <NotForm :form="..."> ancestor or pass :form directly.')
  }

  return instance
}
