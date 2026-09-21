import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema, Paths } from './shared'

/**
 * Full form instance used by field components. `useNotForm` returns {@linkcode NotFormAPI}.
 * @template TSchema The form schema.
 */
export interface NotFormInstance<TSchema extends ObjectSchema> {
  // #region Values

  /**
   * Live field values.
   * @example
   * ```ts
   * form.values.email
   * ```
   */
  values: InferInput<TSchema>

  /**
   * Sets a field value by path. Does not validate.
   * @template TPath Field path.
   * @param path Dot path.
   * @param value Value to assign.
   */
  setValue: <TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) => void

  // #endregion

  // #region Touch

  /** Whether any field is touched. */
  isTouched: boolean

  /**
   * Touched field paths.
   * @internal
   */
  touchedFields: Set<Paths<TSchema>>

  /**
   * Marks a field as touched.
   * @internal
   * @param path Dot path.
   */
  markFieldAsTouched: (path: Paths<TSchema>) => void

  /**
   * Marks every leaf field as touched.
   * @internal
   */
  markAllFieldsAsTouched: () => void

  /**
   * Clears touched state for one field.
   * @internal
   * @param path Dot path.
   */
  unmarkFieldAsTouched: (path: Paths<TSchema>) => void

  /**
   * Clears touched state for all fields.
   * @internal
   */
  unmarkAllFieldsAsTouched: () => void

  // #endregion

  // #region Dirty

  /**
   * Paths whose value differs from the baseline.
   * @internal
   */
  dirtyFields: Set<Paths<TSchema>>

  /** Whether any field is dirty. */
  isDirty: boolean

  /**
   * Updates dirty state by comparing current and baseline values.
   * @internal
   * @param path Dot path.
   */
  syncDirtyState: (path: Paths<TSchema>) => void

  /**
   * Updates dirty state for all fields by comparing current and baseline values.
   * @internal
   */
  syncAllDirtyStates: () => void

  /**
   * Forces a field dirty.
   * @internal
   * @param path Dot path.
   */
  markFieldAsDirty: (path: Paths<TSchema>) => void

  /**
   * Forces every leaf field dirty.
   * @internal
   */
  markAllFieldsAsDirty: () => void

  /**
   * Clears dirty state for one field.
   * @internal
   * @param path Dot path.
   */
  unmarkFieldAsDirty: (path: Paths<TSchema>) => void

  /**
   * Clears dirty state for all fields.
   * @internal
   */
  unmarkAllFieldsAsDirty: () => void

  // #endregion

  // #region Errors

  /** Issues from the last validation that wrote errors. */
  errors: Array<Issue>

  /**
   * Upserts an issue at the same path, or appends it.
   * @param error Issue to set.
   */
  setError: (error: Issue) => void

  /**
   * Replaces the entire error list.
   * @internal
   * @param errors Replacement issues.
   */
  replaceErrors: (errors: Array<Issue>) => void

  /**
   * Removes every issue.
   * @internal
   */
  clearErrors: () => void

  /**
   * Issues whose path equals `path`.
   * @param path Dot path.
   * @returns Matching issues.
   */
  getFieldErrors: (path: Paths<TSchema>) => Array<Issue>

  // #endregion

  // #region Validation

  /** Whether any validation is in flight. */
  isValidating: boolean

  /** Whether there are zero issues. */
  isValid: boolean

  /**
   * Paths currently validating.
   * @internal
   */
  validatingFields: Set<Paths<TSchema>>

  /**
   * Validates the whole form and replaces all errors.
   * @returns Standard Schema result.
   */
  validate: () => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  /**
   * Validates the form and writes issues only for `path`.
   * @param path Dot path.
   * @returns Standard Schema result.
   */
  validateField: (path: Paths<TSchema>) => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  // #endregion

  // #region Submit

  /** Whether `onSubmit` is running. */
  isSubmitting: boolean

  /**
   * Touches all fields, validates, then runs `onSubmit` when valid.
   * @param event Optional submit event; `preventDefault` is always called.
   */
  submit: (event?: SubmitEvent) => Promise<void>

  // #endregion

  // #region Reset

  /**
   * Restores values/errors to the baseline. Optional arguments become the new baseline.
   * @param values New baseline values.
   * @param errors New baseline issues.
   */
  reset: (values?: DeepPartial<InferInput<TSchema>>, errors?: Array<Issue>) => void

  // #endregion
}
