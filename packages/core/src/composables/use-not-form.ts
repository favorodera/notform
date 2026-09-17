import type { NotFormAPI } from '../types/not-form-api'
import type { UseNotFormConfig } from '../types/not-form-config'
import type { ObjectSchema } from '../types/shared'
import { createNotFormInstance } from './create-not-form-instance'

/**
 * Creates a reactive form instance for managing state and validation.
 *
 * Returns the public {@linkcode NotFormAPI} surface — internal coordination
 * members are hidden from the consumer. The full instance is still
 * available to child components via `<NotForm>` injection.
 * @template TSchema - The validation schema.
 * @param config Form configuration (schema, initial values/errors, callbacks).
 * @returns The public form API.
 */
export default function useNotForm<TSchema extends ObjectSchema>(config: UseNotFormConfig<TSchema>): NotFormAPI<TSchema> {
  // createNotFormInstance returns the full NotFormInstance. The double-cast is
  // required because Except with `requireExactProps` marks excluded keys as
  // `?: never`, making a direct cast insufficient.
  return createNotFormInstance(config) as unknown as NotFormAPI<TSchema>
}
