import { type InjectionKey, inject } from 'vue'
import type { FormContext } from '../types/form'
import type { ObjectSchema } from '../types/shared'

/** Internal registry mapping form IDs to their injection keys */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formContextKeys = new Map<string, InjectionKey<FormContext<any>>>()

/** Injection key for the unique identifier of the current active form */
export const CURRENT_FORM_ID_KEY: InjectionKey<string> = Symbol('valid:form:id')

/**
 * Retrieves an existing injection key or creates a new one for a form ID.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param id The unique string identifier for the form.
 * @returns A strictly typed InjectionKey for the form context.
 */
export function getFormContextKey<TSchema extends ObjectSchema>(id: string): InjectionKey<FormContext<TSchema>> {
  if (!formContextKeys.has(id)) {
    const key = Symbol(`valid:form:${id}:context`) as InjectionKey<FormContext<TSchema>>
    formContextKeys.set(id, key)
  }
  return formContextKeys.get(id) as InjectionKey<FormContext<TSchema>>
}

/**
 * Locates and returns the active form context associated with a given ID.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param id The unique identifier of the form to access.
 * @returns The resolved form context object.
 * @throws Error if the context cannot be found in the current component tree.
 */
export function withContext<TSchema extends ObjectSchema>(id: string) {
  const contextKey = getFormContextKey<TSchema>(id)
  const context = inject(contextKey)

  if (!context) {
    throw new Error(`No form context found for form with id "${id}"`)
  }

  return context
}
