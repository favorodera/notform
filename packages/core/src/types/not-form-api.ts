import type { NotFormInstance } from './not-form-instance'
import type { ObjectSchema } from './shared'

/**
 * Public API from `useNotForm`: {@linkcode NotFormInstance} without `@internal` members.
 *
 * The excluded members are the path-set accessors and mutation helpers that
 * `<NotField>` and `<NotArrayField>` use directly — `touchedFields`,
 * `markFieldAsTouched`, `dirtyFields`, `syncDirtyState`, `validatingFields`,
 * `replaceErrors`, `clearErrors`, and their siblings. Application code
 * normally reaches the same information through `isTouched`/`isDirty`/
 * `isValidating`, or through a specific field's own slot props, rather than
 * these lower-level sets and setters directly.
 * @template TSchema The form schema.
 */
export type NotFormAPI<TSchema extends ObjectSchema> = Pick<
  NotFormInstance<TSchema>,
  | 'errors'
  | 'getFieldErrors'
  | 'isDirty'
  | 'isSubmitting'
  | 'isTouched'
  | 'isValid'
  | 'isValidating'
  | 'reset'
  | 'setError'
  | 'setValue'
  | 'submit'
  | 'validate'
  | 'validateField'
  | 'values'
>
