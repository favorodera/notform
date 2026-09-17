import type { Except } from 'type-fest'
import type { NotFormInstance } from './not-form-instance'
import type { ObjectSchema } from './shared'

/**
 * Public API surface returned by `useNotForm`.
 *
 * This is {@linkcode NotFormInstance} with internal coordination members removed.
 * See {@linkcode NotFormInstance} for full member documentation.
 * @template TSchema - The validation schema.
 */
export type NotFormAPI<TSchema extends ObjectSchema> = Except<
  NotFormInstance<TSchema>,
  | 'clearErrors'
  | 'dirtyFields'
  | 'markAllFieldsAsDirty'
  | 'markAllFieldsAsTouched'
  | 'markFieldAsDirty'
  | 'markFieldAsTouched'
  | 'syncDirtyState'
  | 'touchedFields'
  | 'unmarkAllFieldsAsDirty'
  | 'unmarkAllFieldsAsTouched'
  | 'unmarkFieldAsDirty'
  | 'unmarkFieldAsTouched'
  | 'validatingFields',
  { requireExactProps: true }
>
