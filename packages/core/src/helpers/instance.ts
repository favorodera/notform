import { type InjectionKey, provide } from 'vue'
import type { FormInstance } from '../types/form-instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'

/** Injection key for the full form instance. */
export const FORM_INSTANCE_KEY: InjectionKey<FormInstance<any>> = Symbol('notform:form:instance')

/**
 * Provides the full form instance to descendants.
 * @template TSchema The form schema.
 * @param instance Public API or full instance.
 */
export function provideFormInstance<TSchema extends ObjectSchema>(instance: FormInstance<TSchema> | UseFormReturn<TSchema>) {
  provide<FormInstance<TSchema>>(FORM_INSTANCE_KEY, instance as FormInstance<TSchema>)
}
