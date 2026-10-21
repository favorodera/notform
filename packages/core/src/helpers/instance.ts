import { type InjectionKey, provide } from 'vue'
import type { FormInstance } from '../types/instance'
import type { ObjectSchema } from '../types/shared'
import type { UseFormReturn } from '../types/use-form'

/** Shared injection key used to resolve the nearest active form instance. */
export const FORM_INSTANCE_KEY: InjectionKey<FormInstance<ObjectSchema>> = Symbol('form:instance')

/**
 * Provides a form instance to nested components through Vue's dependency injection.
 * @template TSchema Object schema owned by the form.
 * @param instance Form instance or public form API to expose to descendants.
 */
export function provideFormInstance<TSchema extends ObjectSchema>(instance: FormInstance<TSchema> | UseFormReturn<TSchema>): void {
  provide<FormInstance<TSchema>>(FORM_INSTANCE_KEY, instance as FormInstance<TSchema>)
}
