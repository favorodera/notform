import type { IndexMapper } from '../utils/array'
import type { ArrayFieldInstance } from './array-field'
import type { FieldConfig, FieldInstance } from './field'
import type { ValidationIssue, ValidationResult } from './validation'

/**
 * @file
 * Internal contracts between the form and its fields. Not exported from the package.
 * Paths here are plain strings; the typed API lives on `FormInstance`.
 */

/** Options of a field that lives in a scope and can create nested fields (arrays). */
export type ArrayFieldOptions = FieldOptions & {
  /**
   * Creates the scope for fields nested inside an item of this array.
   * Injected to keep `create-array-field` and `create-field-scope` from importing each other.
   * @param getBasePath Returns the item's current path.
   * @returns The scope.
   */
  createScope: (getBasePath: () => string) => FieldScope
}

/** What a field needs from the form it belongs to. */
export type FieldHost = {
  /**
   * Cancels the validation scheduled for a field, if any.
   * @param id The field's id.
   */
  cancelFieldTask: (id: symbol) => void

  /**
   * Reads the issues reported exactly at a path.
   * @param path Dot-notation path.
   * @returns The matching issues.
   */
  getFieldErrors: (path: string) => ValidationIssue[]

  /**
   * Reads a value from the form's initial values.
   * @param path Dot-notation path.
   * @returns The initial value, or `undefined`.
   */
  getInitialValue: (path: string) => unknown

  /**
   * Reads how many times the form was reset. Fields rebuild their identity when it changes.
   * @returns The reset count.
   */
  getResetCount: () => number

  /**
   * Reads a value from the form's live values.
   * @param path Dot-notation path.
   * @returns The value, or `undefined`.
   */
  getValue: (path: string) => unknown

  /**
   * Tells whether a field counts as touched.
   * @param id The field's id.
   * @returns `true` if the field was blurred or the form was submitted.
   */
  isFieldTouched: (id: symbol) => boolean

  /**
   * Tells whether a validation concerning a path is running.
   * @param path Dot-notation path.
   * @returns `true` while one is running.
   */
  isFieldValidating: (path: string) => boolean

  /**
   * Re-points the errors inside an array after it was mutated.
   * @param arrayPath Path of the mutated array.
   * @param mapIndex Translates an item's old index to its new one.
   */
  remapArrayErrors: (arrayPath: string, mapIndex: IndexMapper) => void

  /**
   * Runs `task` after a delay, replacing any task still waiting for the same field.
   * Dropped on form reset and when the field is cancelled.
   * @param id The field's id.
   * @param delay Milliseconds to wait.
   * @param task What to run.
   */
  scheduleFieldTask: (id: symbol, delay: number, task: () => void) => void

  /**
   * Writes a value into the form's live values.
   * @param path Dot-notation path.
   * @param value The value to write.
   */
  setValue: (path: string, value: unknown) => void

  /**
   * Marks a field as touched.
   * @param id The field's id.
   */
  touchField: (id: symbol) => void

  /**
   * Forgets a field's touched state.
   * @param id The field's id.
   */
  untouchField: (id: symbol) => void

  /**
   * Validates one field and updates only its errors.
   * @param path Dot-notation path.
   * @returns `{ value }` or `{ issues }` for that field.
   */
  validateField: (path: string) => Promise<ValidationResult<unknown>>
}

/**
 * A field instance together with its teardown.
 * @template TInstance - The public instance type.
 */
export type FieldNode<TInstance> = {
  /** Stops pending work and releases the field's registrations in the form. Safe to call twice. */
  dispose: () => void

  /** The reactive object handed to users. */
  instance: TInstance
}

/** Options for creating one field. */
export type FieldOptions = {
  /** Per-field behavior. */
  config?: FieldConfig

  /** Returns the field's current path. Called lazily so it can follow array reordering. */
  getPath: () => string

  /** Identity to use. A new one is created when omitted. */
  id?: symbol
}

/**
 * A place that creates and owns fields under a base path: the form root, or one array item.
 * Fields are cached per relative path, so repeated calls return the same instance.
 */
export type FieldScope = {
  /**
   * Gets or creates the array field at a relative path.
   * @param path Path relative to the scope's base.
   * @param config Per-field behavior, used when the field is created.
   * @returns The cached array field.
   */
  arrayField: (path: string, config?: FieldConfig) => ArrayFieldInstance<unknown>

  /** Disposes every field created in this scope. */
  dispose: () => void

  /**
   * Gets or creates the field at a relative path.
   * @param path Path relative to the scope's base.
   * @param config Per-field behavior, used when the field is created.
   * @returns The cached field.
   */
  field: (path: string, config?: FieldConfig) => FieldInstance<unknown>
}
