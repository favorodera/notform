import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { MaybeRefOrGetter } from 'vue'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema, Path, Paths } from './shared'

/**
 * The full form instance provided by the instance factory
 * @template TSchema The form schema.
 */
export interface FormInstance<TSchema extends ObjectSchema> {

  // #region Values

  /** Live form values. The form may intentionally hold a partial input before validation. */
  values: DeepPartial<InferInput<TSchema>>

  /** Sets a schema-typed field value by path. Does not validate. */
  setValue: <TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) => void

  // #endregion

  // #region Touch

  /** Whether the form has been touched, submitted, or both. */
  isTouched: boolean

  /** Explicitly touched paths, retained so dynamic array items can move with their state. */
  touchedFields: Set<Path<TSchema>>

  /** Marks one field as touched. */
  markFieldAsTouched: (path: Path<TSchema>) => void

  /** Clears touched state for one field. */
  unmarkFieldAsTouched: (path: Path<TSchema>) => void

  /** Clears all touched state. */
  unmarkAllFieldsAsTouched: () => void

  /** Whether `path` is touched or the form has been submitted. */
  isPathTouched: (path: Path<TSchema>) => boolean

  /** Whether `path` or one of its descendants is touched. */
  isPathTouchedWithin: (path: Path<TSchema>) => boolean

  // #endregion

  // #region Dirty

  /** Whether the entire form differs from its reset baseline. */
  isDirty: boolean

  /** Whether the value at `path` differs from the reset baseline. */
  isPathDirty: (path: Path<TSchema>) => boolean

  // #endregion

  // #region Errors

  /** Issues from the most recent validation that wrote errors. */
  errors: Array<Issue>

  /** Adds or replaces one issue at the same normalized path. */
  setError: (error: Issue) => void

  /** Replaces the entire error list. */
  replaceErrors: (errors: Array<Issue>) => void

  /** Removes every issue.  */
  clearErrors: () => void

  /** Returns issues whose path exactly matches `path`. */
  getFieldErrors: (path: Path<TSchema>) => Array<Issue>

  // #endregion

  // #region Validation

  /** Whether any validation run is currently active. */
  isValidating: boolean

  /** Whether there are no current issues. */
  isValid: boolean

  /** Cancels current validation runs without clearing errors.  */
  invalidateValidation: () => void

  /** Whether `path` overlaps an active validation scope.  */
  isPathValidating: (path: Path<TSchema>) => boolean

  /** Validates the whole form. */
  validate: () => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  /** Validates the whole schema but only updates issues within `path`. */
  validateField: (path: Path<TSchema>) => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  // #endregion

  // #region Submit

  /** Whether a submit attempt is currently running. */
  isSubmitting: boolean

  /** Number of accepted submit attempts since the last reset. */
  submitCount: number

  /** Whether at least one submit attempt has been accepted since reset. */
  isSubmitted: boolean

  /** Validates, then calls `onSubmit` when the latest values are valid. */
  submit: (event?: SubmitEvent) => Promise<void>

  // #endregion

  // #region Reset

  /** Restores values/errors to the current baseline and clears interaction state. */
  reset: {
    (values?: DeepPartial<InferInput<TSchema>>, errors?: Array<Issue>): void
    (event: Event): void
  }

  // #endregion
}

/**
 * Settings to configure the form instance.
 * @template TSchema Validation schema.
 */
export interface FormInstanceSettings<TSchema extends ObjectSchema> {
  /** Schema used to parse and validate values. */
  schema: MaybeRefOrGetter<TSchema>

  /** Starting values; deep-cloned before use. */
  initialValues?: DeepPartial<InferInput<TSchema>>

  /** Issues shown before the first validation run. */
  initialErrors?: Array<Issue>

  /**
   * Called after a successful submit validation.
   * @param data Validated output.
   */
  onSubmit?: (data: InferOutput<TSchema>) => Promise<void> | void
}
