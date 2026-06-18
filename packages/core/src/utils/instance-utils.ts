import { inject, type InjectionKey, provide } from 'vue'
import type { NotFormInstance } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'

/** The injection key for the NotForm instance. */
export const NOT_FORM_INSTANCE_KEY: InjectionKey<NotFormInstance<any>> = Symbol('notform:instance')

/**
 * Provides the NotForm instance to the component tree.
 * @template TSchema The validation schema type.
 * @param instance The NotForm instance to provide.
 */
export function provideNotFormInstance<TSchema extends ObjectSchema>(instance: NotFormInstance<TSchema>) {
  provide(NOT_FORM_INSTANCE_KEY, instance)
}

/**
 * Retrieves the NotForm instance from the component tree.
 * @template TSchema The validation schema type.
 * @param explicitInstance Optional explicit instance to use.
 * @returns The NotForm instance.
 */
export function useNotFormInstance<TSchema extends ObjectSchema>(explicitInstance?: NotFormInstance<TSchema>) {
  // eslint-disable-next-line unicorn/no-useless-undefined
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
