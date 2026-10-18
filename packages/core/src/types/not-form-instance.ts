import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema, Paths } from './shared'

/**
 * Full form instance used by field components. `useNotForm` exposes {@linkcode NotFormAPI}.
 * @template TSchema The form schema.
 */
export interface NotFormInstance<TSchema extends ObjectSchema> {
  // #region Values

  /** Live field values. */
  values: InferInput<TSchema>

  /**
   * Sets a field value by path. Does not validate — validation still only
   * runs through a field's own configured triggers, or an explicit
   * {@linkcode validate}/{@linkcode validateField} call.
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
   * Marks every current leaf field as touched. Later-added array items remain untouched.
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
   * Updates dirty state for current leaf fields; later-added array items are not included.
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
   * Forces current leaf fields dirty; later-added array items are not included.
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
   * Issues whose path exactly equals `path` — not issues nested underneath it.
   *
   * `getFieldErrors('groups.0')` will not return an issue reported at
   * `groups.0.name`.
   *
   * `<NotArrayField>`'s `isValid`/`isTouched`/`isDirty`/
   * `isValidating` aggregate recursively instead, for exactly this reason.
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
   * Invalidates all in-flight validation runs without touching current errors.
   *
   * Used internally when values change or an array is structurally mutated so
   * an older async result cannot be written against newer form state.
   * @internal
   */
  invalidateValidation: () => void

  /**
   * Paths currently validating.
   * @internal
   */
  validatingFields: Set<Paths<TSchema>>

  /**
   * Validates the whole form and replaces all errors.
   *
   * Concurrent calls resolve with their own results, but only the newest
   * call writes to `errors`.
   * @returns Standard Schema result.
   */
  validate: () => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  /**
   * Validates the form and writes issues only for `path`.
   *
   * `path` may identify a leaf, array, or array item. Concurrent calls are
   * last-write-wins; a newer field or whole-form validation supersedes this one.
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
   * @param event Optional submit event. When given, `event.preventDefault()`
   * is called immediately, before anything else — including before checking
   * whether a submission is already in flight or whether validation passes.
   */
  submit: (event?: SubmitEvent) => Promise<void>

  // #endregion

  // #region Reset

  /**
   * Restores values and errors, clears touched/dirty state, and invalidates
   * active validation results. Optional arguments replace the baselines
   * entirely (they are not merged) and apply immediately.
   * @param values New baseline values.
   * @param errors New baseline issues.
   */
  reset: (values?: DeepPartial<InferInput<TSchema>>, errors?: Array<Issue>) => void

  // #endregion
}
