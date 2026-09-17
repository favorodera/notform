import type { NotFormAPI } from '../types/not-form-api'
import type { NotFormInstance } from '../types/not-form-instance'
import type { ObjectSchema } from '../types/shared'

/**
 * Casts a public {@linkcode NotFormAPI} object to the internal {@linkcode NotFormInstance}.
 *
 * At runtime, the API object returned by `useNotForm` is always the complete
 * form instance. This utility bridges the type-level gap introduced by `Except`.
 * @template TSchema The validation schema.
 * @internal
 * @param form The public form API or full form instance.
 * @returns The full form instance.
 */
export function toNotFormInstance<TSchema extends ObjectSchema>(form: NotFormAPI<TSchema> | NotFormInstance<TSchema>): NotFormInstance<TSchema>
export function toNotFormInstance<TSchema extends ObjectSchema>(form?: NotFormAPI<TSchema> | NotFormInstance<TSchema>): NotFormInstance<TSchema> | undefined
export function toNotFormInstance<TSchema extends ObjectSchema>(form?: NotFormAPI<TSchema> | NotFormInstance<TSchema>): NotFormInstance<TSchema> | undefined {
  return form as unknown as NotFormInstance<TSchema> | undefined
}
