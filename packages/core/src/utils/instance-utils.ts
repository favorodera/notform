import { type InjectionKey, inject, provide } from 'vue'
import type { NotFormInstance } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
 
/** The injection key for the NotForm instance. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NOT_FORM_INSTANCE_KEY: InjectionKey<NotFormInstance<any>> = Symbol('notform:instance')
 
/**
 * Provides the NotForm instance to the component tree.
 * @param instance The NotForm instance to provide.
 */
export function provideNotFormInstance<TSchema extends ObjectSchema>(instance: NotFormInstance<TSchema>) {
  provide(NOT_FORM_INSTANCE_KEY, instance)
}
 
/**
 * Retrieves the NotForm instance from the component tree.
 * @param explicitInstance Optional explicit instance to use.
 * @returns The NotForm instance.
 */
export function useNotFormInstance<TSchema extends ObjectSchema>(explicitInstance?: NotFormInstance<TSchema>) {
  const injected = inject(NOT_FORM_INSTANCE_KEY, undefined) as NotFormInstance<TSchema> | undefined
 
  const instance = explicitInstance ?? injected
 
  if (!instance) {
    throw new Error(`
      [NotForm] No form instance found. 
      Wrap with <NotForm :form="..."> or pass :form directly to the field.
    `)
  }
 
  return instance
}
