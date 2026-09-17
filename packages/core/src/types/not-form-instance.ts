import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema, Paths } from './shared'

/**
 * Complete state and API of a form instance, including internal members
 * used by `NotField`, `NotArrayField`, and `NotMessage`.
 *
 * Consumers receive the narrowed {@linkcode NotFormAPI} from `useNotForm`;
 * members marked `@internal` are hidden from that public surface.
 * @template TSchema - The validation schema.
 */
export interface NotFormInstance<TSchema extends ObjectSchema> {
  // #region Values

  /**
   * Deeply reactive object holding current field values.
   * @example
   * ```ts
   * // Direct access
   * form.values.email
   *
   * // Two-way binding
   * <input v-model="form.values.email" />
   * ```
   */
  values: InferInput<TSchema>

  /**
   * Sets a single field value by dot-notated path.
   * Does **not** trigger validation — field event handlers are responsible for that.
   * @template TPath - The dot-notated field path.
   * @param path Dot-notated path to the target field.
   * @param value The value to assign.
   */
  setValue: <TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) => void

  // #endregion

  // #region Touch

  /** Whether any field has been interacted with. */
  isTouched: boolean

  /**
   * Set of dot-notated paths for fields the user has interacted with.
   * @internal
   */
  touchedFields: Set<Paths<TSchema>>

  /**
   * Records a field as touched.
   * @internal
   * @param path Dot-notated field path.
   */
  markFieldAsTouched: (path: Paths<TSchema>) => void

  /**
   * Records every field as touched.
   * @internal
   */
  markAllFieldsAsTouched: () => void

  /**
   * Removes the touched flag from a field.
   * @internal
   * @param path Dot-notated field path.
   */
  unmarkFieldAsTouched: (path: Paths<TSchema>) => void

  /**
   * Removes the touched flag from all fields.
   * @internal
   */
  unmarkAllFieldsAsTouched: () => void

  // #endregion

  // #region Dirty

  /**
   * Set of dot-notated paths whose current value differs from the initial value.
   * @internal
   */
  dirtyFields: Set<Paths<TSchema>>

  /** Whether any field value differs from its initial value. */
  isDirty: boolean

  /**
   * Forces a field's dirty flag on.
   * @internal
   * @param path Dot-notated field path.
   */
  markFieldAsDirty: (path: Paths<TSchema>) => void

  /**
   * Forces the dirty flag on for every field.
   * @internal
   */
  markAllFieldsAsDirty: () => void

  /**
   * Clears a field's dirty flag (e.g. when its value matches the initial value again).
   * @internal
   * @param path Dot-notated field path.
   */
  unmarkFieldAsDirty: (path: Paths<TSchema>) => void

  /**
   * Clears the dirty flag for all fields.
   * @internal
   */
  unmarkAllFieldsAsDirty: () => void

  // #endregion

  // #region Errors

  /** All validation issues from the most recent validation run. */
  errors: Array<Issue>

  /**
   * Upserts a validation issue — replaces an existing issue for the same path,
   * or appends it if none exists. Useful for server-side errors.
   * @param error The validation issue to set.
   */
  setError: (error: Issue) => void

  /**
   * Replaces the entire error list with the provided issues.
   * @param errors The new validation issues.
   */
  replaceErrors: (errors: Array<Issue>) => void

  /**
   * Removes all validation issues.
   * @internal
   */
  clearErrors: () => void

  /**
   * Returns all validation issues for a specific field.
   * @param path Dot-notated field path.
   * @returns Array of issues matching the given path.
   */
  getFieldErrors: (path: Paths<TSchema>) => Array<Issue>

  // #endregion

  // #region Validation

  /** Whether a validation run is currently in progress. */
  isValidating: boolean

  /** Whether the form has zero validation errors. */
  isValid: boolean

  /**
   * Set of dot-notated paths currently undergoing async validation.
   * @internal
   */
  validatingFields: Set<Paths<TSchema>>

  /**
   * Validates the entire form against the schema, replacing all current errors.
   * @returns The Standard Schema validation result.
   */
  validate: () => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  /**
   * Validates a single field against the schema.
   * Only updates errors for that field — other fields' errors are preserved.
   * @param path Dot-notated field path.
   * @returns The Standard Schema validation result.
   */
  validateField: (path: Paths<TSchema>) => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  // #endregion

  // #region Submit

  /** Whether the form is currently executing its submit handler. */
  isSubmitting: boolean

  /**
   * Validates the form and invokes `onSubmit` if validation passes.
   *
   * Marks all fields as touched and syncs dirty state before validating
   * so every potential error surfaces. Aborts if validation fails.
   * @param event Optional native submit event (automatically `preventDefault`-ed).
   */
  submit: (event?: SubmitEvent) => Promise<void>

  // #endregion

  // #region Reset

  /**
   * Resets the form to its initial state, or to new baselines if provided.
   *
   * Clears all touched/dirty tracking and cancels in-flight validations.
   * When `values` or `errors` are supplied they become the new baseline
   * for subsequent resets.
   * @param values Optional new baseline values.
   * @param errors Optional new baseline errors.
   * @example
   * ```ts
   * // Reset to original initial values
   * form.reset()
   *
   * // Reset with a new baseline
   * form.reset(
   *   { name: 'Jane' },
   *   [{ message: 'Invalid email', path: ['email'] }]
   * )
   * ```
   */
  reset: (values?: DeepPartial<InferInput<TSchema>>, errors?: Array<Issue>) => void

  // #endregion
}
