import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { MaybeRefOrGetter } from 'vue'
import type { DeepPartial, InferInput, InferOutput, Issue, ObjectSchema, Path, Paths } from './shared'

/**
 * Reactive state and actions for a schema-backed form.
 * @template TSchema Object schema that defines the allowed field paths and values.
 */
export interface FormInstance<TSchema extends ObjectSchema> {
  // Values

  /** Live form values. The form may intentionally hold a partial input before validation. */
  values: DeepPartial<InferInput<TSchema>>

  /**
   * Sets a field value without triggering validation.
   * @template TPath Exact path within the schema input.
   * @param path Field path to update.
   * @param value Value to store at that path.
   */
  setValue: <TPath extends Paths<TSchema>>(path: TPath, value: Get<InferInput<TSchema>, TPath, { strict: false }>) => void

  // Interaction state

  /** Whether the form has been touched, submitted, or both. */
  isTouched: boolean

  /** Explicitly touched paths, kept so array items can preserve their local state when reordered. */
  touchedFields: Set<Path<TSchema>>

  /**
   * Marks a field path as touched.
   * @param path Path to mark as visited.
   */
  markFieldAsTouched: (path: Path<TSchema>) => void

  /**
   * Removes a touched marker from a single field path.
   * @param path Path to clear.
   */
  unmarkFieldAsTouched: (path: Path<TSchema>) => void

  /** Clears every touched marker on the form. */
  unmarkAllFieldsAsTouched: () => void

  /**
   * Checks whether a field path has been touched or the form has been submitted.
   * @param path Path whose touched state should be checked.
   * @returns `true` when the field is considered interacted with.
   */
  isPathTouched: (path: Path<TSchema>) => boolean

  /**
   * Checks whether a field or one of its descendants has been touched.
   * @param path Path or subtree to inspect.
   * @returns `true` when the path overlaps a touched field.
   */
  isPathTouchedWithin: (path: Path<TSchema>) => boolean

  // Change tracking

  /** Whether the current form values differ from the reset baseline. */
  isDirty: boolean

  /**
   * Checks whether a field path differs from the reset baseline.
   * @param path Path to compare.
   * @returns `true` when the field value has changed since reset.
   */
  isPathDirty: (path: Path<TSchema>) => boolean

  // Validation errors

  /** Current validation issues returned by the latest schema run. */
  errors: Array<Issue>

  /**
   * Adds an issue or replaces an issue that shares the same normalized path.
   * @param error Issue to write into the active error list.
   */
  setError: (error: Issue) => void

  /**
   * Replaces the entire error list.
   * @param errors Fresh issue collection to apply.
   */
  replaceErrors: (errors: Array<Issue>) => void

  /** Removes every current issue without resetting the form state. */
  clearErrors: () => void

  /**
   * Returns the issues whose path matches a specific field path.
   * @param path Field path to inspect.
   * @returns Matching issues in their current order.
   */
  getFieldErrors: (path: Path<TSchema>) => Array<Issue>

  // Validation

  /** Whether at least one validation run is currently active. */
  isValidating: boolean

  /** Whether there are no active validation issues. */
  isValid: boolean

  /** Cancels active validation runs without discarding the current issue list. */
  invalidateValidation: () => void

  /**
   * Checks whether a field path overlaps an in-flight validation scope.
   * @param path Path to inspect.
   * @returns `true` while the path is still being validated.
   */
  isPathValidating: (path: Path<TSchema>) => boolean

  /**
   * Validates the whole form against the current schema.
   * @returns The schema result returned by the validator.
   */
  validate: () => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  /**
   * Validates a field or subtree and updates only the issues that overlap that path.
   * @param path Field or subtree path to validate.
   * @returns The full schema result for the current values.
   */
  validateField: (path: Path<TSchema>) => Promise<StandardSchemaV1.Result<InferOutput<TSchema>>>

  // Submission

  /** Whether a submit attempt is currently in progress. */
  isSubmitting: boolean

  /** Number of accepted submit attempts since the last reset. */
  submitCount: number

  /** Whether a submit attempt has been accepted at least once since reset. */
  isSubmitted: boolean

  /**
   * Validates the current form values and calls `onSubmit` when they are valid.
   * @param event Optional native submit event to prevent default behavior.
   * @returns Resolves when the submit cycle finishes.
   */
  submit: (event?: SubmitEvent) => Promise<void>

  // Reset

  /** Restores the form to a baseline and clears touch, submit, and issue state. */
  reset: {
    /**
     * Resets the form to its current baseline, optionally replacing the baseline values and errors before resetting.
     * @param values Optional replacement baseline values.
     * @param errors Optional replacement baseline issues.
     * @returns Nothing.
     */
    (values?: DeepPartial<InferInput<TSchema>>, errors?: Array<Issue>): void

    /**
     * Resets the form when called as a native event handler.
     *
     * The event is ignored, and the existing baseline is restored.
     * @param event Native reset event.
     * @returns Nothing.
     */
    (event: Event): void
  }
}

/**
 * Options used to create a form instance.
 * @template TSchema Object schema used to infer form input and output.
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
   * @returns Resolves when submission work completes.
   */
  onSubmit?: (data: InferOutput<TSchema>) => Promise<void> | void
}
