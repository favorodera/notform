import type { NotFormAPI } from '../types/not-form-api'
import type { NotFormInstance } from '../types/not-form-instance'
import type { ObjectSchema } from '../types/shared'

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
