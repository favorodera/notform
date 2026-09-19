import type { Except } from 'type-fest'
import type { NotFormInstance } from './not-form-instance'
import type { ObjectSchema } from './shared'

/**
 * Public API from `useNotForm`: {@linkcode NotFormInstance} without `@internal` members.
 * @template TSchema The form schema.
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
  | 'validatingFields'
>
