import type { NotFormAPI } from '../types/not-form-api'
import type { UseNotFormConfig } from '../types/not-form-config'
import type { ObjectSchema } from '../types/shared'
import { createNotFormInstance } from '../factories/create-not-form-instance'

/**
 * Creates a form instance and returns the public {@linkcode NotFormAPI}.
 * @template TSchema The form schema.
 * @param config Schema, initial values/errors, and submit handler.
 * @returns Public form API. Child components still inject the full instance via `<NotForm>`.
 */
export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormAPI<TSchema> {
  // Type-only narrowing, not a real conversion: the returned object is still
  // the full instance (see `toNotFormInstance`) — this cast just presents
  // callers with the smaller public surface instead of the internal one.
  return createNotFormInstance(config) as unknown as NotFormAPI<TSchema>
}
