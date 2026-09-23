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
   * Sets a field value by path. Does not validate — validation still only
   * runs through a field's own configured triggers, or an explicit
   * {@link validate}/{@link validateField} call.
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
   * Marks every current leaf field as touched. "Current" matters for arrays:
   * an empty array contributes no leaf paths, so an item appended afterward
   * (e.g. via `<NotArrayField>`'s `append`) starts untouched even though
   * this was already called.
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
   * Updates dirty state for every current leaf field. Subject to the same
   * "current shape only" caveat as {@link markAllFieldsAsTouched}.
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
   * Forces every current leaf field dirty. Subject to the same
   * "current shape only" caveat as {@link markAllFieldsAsTouched}.
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
   * Issues whose path exactly equals `path` — not issues nested underneath
   * it. `getFieldErrors('groups.0')` will not return an issue reported at
   * `groups.0.name`. `<NotArrayField>`'s `isValid`/`isTouched`/`isDirty`/
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
   * Paths currently validating.
   * @internal
   */
  validatingFields: Set<Paths<TSchema>>

  /**
   * Validates the whole form and replaces all errors.
   *
   * Concurrent calls are last-write-wins: each call still resolves with its
   * own result, but only the most recently started call's result is written
   * to `errors` — an older call that resolves later has its result silently
   * discarded from shared state.
   * @returns Standard Schema result.
   */
  validate: () => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  /**
   * Validates the form and writes issues only for `path`.
   *
   * `path` can be any granularity — a leaf field, an entire array field, or
   * a specific item inside one; `<NotField>` and `<NotArrayField>` both call
   * this with their own `path` internally. Concurrent calls for the same
   * `path` are last-write-wins, the same as {@link validate}; a call started
   * after this one, or a whole-form {@link validate} call, supersedes it.
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
   * Restores values/errors to the baseline. Optional arguments become the
   * new baseline, and reset to it immediately.
   *
   * `values`/`errors`, when given, fully replace the previous baseline —
   * they are not merged with it. Any top-level key present in the old
   * baseline but missing from `values` is simply gone afterward, the same
   * way `initialValues`/`initialErrors` passed to `useNotForm` become the
   * literal starting baseline rather than defaults merged with something
   * else.
   *
   * Also bumps the internal validation generation, so any `validate()`/
   * `validateField()` call already in flight when this runs will still
   * resolve with its own result, but will not write its issues to `errors`.
   * @param values New baseline values.
   * @param errors New baseline issues.
   */
  reset: (values?: DeepPartial<InferInput<TSchema>>, errors?: Array<Issue>) => void

  // #endregion
}
