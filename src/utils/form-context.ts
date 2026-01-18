import { type InjectionKey, inject } from 'vue'
import type { FormContext } from '../types/form'
import type { ObjectSchema } from '../types/shared'

/**
 * Internal registry that maps form identifiers to their respective Vue injection keys.
 * This ensures that multiple forms can coexist without their contexts overlapping.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formContextKeys = new Map<string, InjectionKey<FormContext<any>>>()

/**
 * Retrieves an existing injection key or creates a new one for a specific form ID.
 * This key is utilized by provide and inject functions to manage form state across components.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param id The unique string identifier for the form.
 * @returns A strictly typed InjectionKey for the requested form context.
 */
export function getFormContextKey<TSchema extends ObjectSchema>(id: string): InjectionKey<FormContext<TSchema>> {
  // Check if a key has already been created for this ID
  if (!formContextKeys.has(id)) {
    // Generate a unique symbol to use as the injection key
    const key = Symbol(`valid:form:${id}:context`) as InjectionKey<FormContext<TSchema>>
    formContextKeys.set(id, key)
  }
  // Return the registered key from the map
  return formContextKeys.get(id) as InjectionKey<FormContext<TSchema>>
}

/**
 * Locates and returns the active form context associated with a given form ID.
 * This function must be executed within a component hierarchy where the form has been provided.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param id The unique string identifier for the form to access.
 * @returns The resolved form context object.
 * @throws An error if the context cannot be found in the current component tree.
 */
export function withContext<TSchema extends ObjectSchema>(id: string) {
  // Obtain the injection key for the given ID
  const contextKey = getFormContextKey<TSchema>(id)
  // Attempt to resolve the context from the Vue provide/inject system
  const context = inject(contextKey)

  // Verify that the context was successfully found
  if (!context) {
    throw new Error(`No form context found for form with id "${id}"`)
  }

  return context
}
