import { type InjectionKey, inject } from 'vue'
import type { NotFormContext } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'

/** Internal registry mapping form IDs to their injection keys */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const notFormContextKeys = new Map<string, InjectionKey<NotFormContext<any>>>()

/** Injection key for the unique identifier of the current active form */
export const CURRENT_NOT_FORM_ID_KEY: InjectionKey<string> = Symbol('notform:id')

/**
 * Retrieves an existing injection key or creates a new one for a form ID.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param id The unique string identifier for the form.
 * @returns A strictly typed InjectionKey for the form context.
 */
export function getNotFormContextKey<TSchema extends ObjectSchema>(id: string): InjectionKey<NotFormContext<TSchema>> {
  if (!notFormContextKeys.has(id)) {
    const key = Symbol(`notform:${id}:context`) as InjectionKey<NotFormContext<TSchema>>
    notFormContextKeys.set(id, key)
  }
  return notFormContextKeys.get(id) as InjectionKey<NotFormContext<TSchema>>
}

/**
 * Locates and returns the active form context associated with a given ID.
 * @template TSchema The validation schema type derived from ObjectSchema.
 * @param id The unique identifier of the form to access.
 * @returns The resolved form context object.
 * @throws Error if the context cannot be found in the current component tree.
 */
export function withContext<TSchema extends ObjectSchema>(id: string) {
  const contextKey = getNotFormContextKey<TSchema>(id)
  const context = inject(contextKey)

  if (!context) {
    throw new Error(`No form context found for form with id "${id}"`)
  }

  return context
}
