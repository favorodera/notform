import { type InjectionKey, provide } from 'vue'
import type { FormInstance } from '../types/instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'

/**
 * Injection key for the full {@linkcode FormInstance}.
 */
export const FORM_INSTANCE_KEY: InjectionKey<FormInstance<any>> = Symbol('notform:instance')

/**
 * Provides the full form instance to descendants.
 * @template TSchema The form schema.
 * @internal
 * @param instance Public API or full instance.
 */
export function provideFormInstance<TSchema extends ObjectSchema>(instance: FormInstance<TSchema> | UseFormReturn<TSchema>) {
  provide<FormInstance<TSchema>>(FORM_INSTANCE_KEY, instance as FormInstance<TSchema>)
}
