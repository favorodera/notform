import { type InjectionKey, provide } from 'vue'
import type { NotFormAPI } from '../types/not-form-api'
import type { NotFormInstance } from '../types/not-form-instance'
import type { ObjectSchema } from '../types/shared'

/**
 * Injection key for the full {@linkcode NotFormInstance}.
 * @internal
 */
export const NOT_FORM_INSTANCE_KEY: InjectionKey<NotFormInstance<any>> = Symbol('notform:instance')

/**
 * Provides the full form instance to descendants.
 * @template TSchema The form schema.
 * @internal
 * @param instance Public API or full instance.
 */
export function provideNotFormInstance<TSchema extends ObjectSchema>(instance: NotFormAPI<TSchema> | NotFormInstance<TSchema>) {
  provide<NotFormInstance<TSchema>>(NOT_FORM_INSTANCE_KEY, toNotFormInstance(instance))
}

/**
 * Treats a public {@linkcode NotFormAPI} as the full {@linkcode NotFormInstance}.
 *
 * Runtime objects from `useNotForm` already are the full instance; this closes the `Pick` gap.
 * @template TSchema The form schema.
 * @internal
 * @param form Public API or full instance.
 * @returns The full instance.
 */
export function toNotFormInstance<TSchema extends ObjectSchema>(form: NotFormAPI<TSchema> | NotFormInstance<TSchema>): NotFormInstance<TSchema>
export function toNotFormInstance<TSchema extends ObjectSchema>(form?: NotFormAPI<TSchema> | NotFormInstance<TSchema>): NotFormInstance<TSchema> | undefined
export function toNotFormInstance<TSchema extends ObjectSchema>(form?: NotFormAPI<TSchema> | NotFormInstance<TSchema>): NotFormInstance<TSchema> | undefined {
  return form as unknown as NotFormInstance<TSchema> | undefined
}
