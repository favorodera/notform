import { type ComputedRef, type FormHTMLAttributes } from 'vue'
import * as zod from 'zod/v4/core'
import type { Schema, ValidationMode, ValidationTriggers } from './shared'
import type { DeepPartial, InferOutput, InputPaths, InputPathValue, OutputPaths, OutputPathValue } from './utils'

/**
 * The context the form is running on.
 * Provides access to form state, errors, and validation methods.
 *
 * @template TSchema - The zod schema of the form
 */
export type Form<TSchema extends Schema = Schema> = {
  /** Reactive reference to the current form state (values) */
  state: ComputedRef<DeepPartial<InferOutput<TSchema>> | InferOutput<TSchema>>

  /** Reference to the initial form state (values) */
  initialState: DeepPartial<InferOutput<TSchema>> | InferOutput<TSchema>

  /** Reactive reference to the current form errors */
  errors: ComputedRef<zod.$ZodErrorTree<TSchema>['properties']>

  /** The validation mode of the form
   * @see {@link ValidationMode}
   * @defaultValue 'lazy'
   */
  mode: ValidationMode

  /** The validation triggers of the form
   * @see {@link ValidationTriggers}
   * @defaultValue ['blur', 'input', 'change']
   */
  validateOn: ValidationTriggers[]

  /**
   * Retrieves the value of a field at a specific dot-notation path.
   *
   * @template TPath - The dot-notation path to the desired value
   * @param field - The dot-notation path to the field
   * @returns The value of the field at the specified path
   */
  getValue<TPath extends OutputPaths<TSchema>>(field: TPath): OutputPathValue<TSchema, TPath>

  /**
   * Sets the value of a field at a specific dot-notation path.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   * @param value - The value to set
   */
  setValue<TPath extends InputPaths<TSchema>>(field: TPath, value: InputPathValue<TSchema, TPath>): void

  /**
   * Retrieves the errors of a field at a specific dot-notation path.
   *
   * @template TPath - The dot-notation path to the desired errors
   * @param field - The dot-notation path to the field
   * @returns The errors of the field at the specified path
   */
  getError<TPath extends OutputPaths<TSchema>>(field: TPath): string[]

  /**
   * Sets the errors of a field at a specific dot-notation path.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   * @param messages - The error messages to set
   */
  setError<TPath extends OutputPaths<TSchema>>(field: TPath, messages: string[]): void

  /**
   * Clears the errors of a field at a specific dot-notation path.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  clearError<TPath extends OutputPaths<TSchema>>(field: TPath): void

  /** Clears all errors in the form */
  clearErrors(): void

  /**
   * Checks if a field is touched (has been focused and blurred).
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   * @returns True if the field has been touched
   */
  isTouched<TPath extends InputPaths<TSchema>>(field: TPath): boolean

  /**
   * Marks a field as touched.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  touch<TPath extends InputPaths<TSchema>>(field: TPath): void

  /**
   * Marks a field as untouched.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  untouch<TPath extends InputPaths<TSchema>>(field: TPath): void

  /** Marks all fields as touched */
  touchAll(): void

  /** Marks all fields as untouched */
  untouchAll(): void

  /**
   * Gets all touched field paths.
   *
   * @returns Array of field paths that have been touched
   */
  getTouchedFields(): InputPaths<TSchema>[]

  /**
   * Checks if a field is dirty (value differs from initial value).
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   * @returns True if the field value has changed from initial
   */
  isDirty<TPath extends InputPaths<TSchema>>(field: TPath): boolean

  /**
   * Marks a field as dirty.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  markDirty<TPath extends InputPaths<TSchema>>(field: TPath): void

  /**
   * Marks a field as pristine (not dirty).
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  markPristine<TPath extends InputPaths<TSchema>>(field: TPath): void

  /** Marks all fields as pristine */
  markAllPristine(): void

  /**
   * Gets all dirty field paths.
   *
   * @returns Array of field paths that have been modified
   */
  getDirtyFields(): InputPaths<TSchema>[]

  /**
   * Checks if a field is currently focused.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   * @returns True if the field is currently focused
   */
  isFocused<TPath extends InputPaths<TSchema>>(field: TPath): boolean

  /**
   * Marks a field as focused.
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  focus<TPath extends InputPaths<TSchema>>(field: TPath): void

  /**
   * Marks a field as blurred (not focused).
   *
   * @template TPath - The dot-notation path to the field
   * @param field - The dot-notation path to the field
   */
  blur<TPath extends InputPaths<TSchema>>(field: TPath): void

  /**
   * Gets the currently focused field path.
   *
   * @returns The field path that is currently focused, or null
   */
  getFocusedField(): InputPaths<TSchema> | null

  /** Validate the form */
  validateForm(): Promise<boolean>

  /** Validate a specific field */
  validateField<TPath extends InputPaths<TSchema>>(field: TPath): Promise<boolean>

  /**
   * Submit the form
   * @template TData - Type of data returned by callback
   * @template TError - Type of error that might be thrown
   * @param event - The event to prevent default on
   * @param callback - The callback to run if the form is valid
   * @returns Promise with submission result containing success status, data, and error
   */
  submit<TData = void, TError = Error>(event: Event, callback?: (values: InferOutput<TSchema>) => TData | Promise<TData>): Promise<SubmitResult<TData, TError>>

  /** Reactive boolean indicating if the form is currently submitting */
  isSubmitting: ComputedRef<boolean>

  /** Reactive boolean indicating if the form is currently valid (has no errors). */
  isValid: ComputedRef<boolean>

  /** Reactive boolean indicating if any field in the form has been touched */
  isAnyTouched: ComputedRef<boolean>

  /** Reactive boolean indicating if any field in the form is dirty */
  isAnyDirty: ComputedRef<boolean>

  /**
   * Resets the form to its initial state (clears errors, touched, dirty, and focus states)
   * @param callback - Optional callback to run after resetting the form
   * @returns Promise
   */
  reset(callback?: (initialState: DeepPartial<InferOutput<TSchema>> | InferOutput<TSchema>) => void | Promise<void>): void | Promise<void>
}

/**
 * Props for the Form component
 * @template TSchema - The zod schema of the form
*/
export type FormProps<TSchema extends Schema = Schema> = Partial<Pick<Form<TSchema>, 'mode' | 'validateOn'>> & /* @vue-ignore */ FormHTMLAttributes & {
  /** The schema used for validation */
  schema: TSchema

  /** The data/value state of the form */
  state: DeepPartial<InferOutput<TSchema>> | InferOutput<TSchema>

  /**
   * Optional custom validation handler.
   * Runs after internal schema validation passes.
   *
   * @param values - The values to validate
   * @param form - The form instance
   * @returns Promise resolving to true if valid
   */
  validate?: (values: InferOutput<TSchema>, form: Form<TSchema>) => Promise<boolean>
}

export type FormExpose<TSchema extends Schema = Schema> = Pick<
  Form<TSchema>,
  'submit'
  | 'errors'
  | 'clearErrors'
  | 'clearError'
  | 'getError'
  | 'isSubmitting'
  | 'isValid'
  | 'initialState'
  | 'isTouched'
  | 'touch'
  | 'untouch'
  | 'touchAll'
  | 'untouchAll'
  | 'getTouchedFields'
  | 'isDirty'
  | 'markDirty'
  | 'markPristine'
  | 'markAllPristine'
  | 'getDirtyFields'
  | 'isFocused'
  | 'focus'
  | 'blur'
  | 'getFocusedField'
  | 'isAnyTouched'
  | 'isAnyDirty'
>

export type FormSlots<TSchema extends Schema = Schema> = {
  default: (props: Pick<
    Form<TSchema>,
    'errors'
    | 'isSubmitting'
    | 'isValid'
    | 'initialState'
    | 'isAnyTouched'
    | 'isAnyDirty'
  >) => void
}

/**
 * Events emitted by the Form component.
 *
 * @template TSchema - The zod schema of the form
 */
export type FormEmits<TSchema extends Schema = Schema> = {
  /** Emitted when the form acts on a submit event (regardless of validity) or successfully validates. */
  submit: [data: InferOutput<TSchema>]

  /** Emitted when validation errors occur. */
  error: [errors: Form<TSchema>['errors']]

  /** Emitted whenever validation runs, with the result boolean. */
  validate: [isValid: boolean]
}

/**
 * Result returned from form submission
 * @template TData - The data returned from the submit callback
 * @template TError - The error thrown by the submit callback
 */
export type SubmitResult<TData = unknown, TError = unknown> = {
  /** Whether the submission was successful (validation passed and callback executed without error) */
  success: boolean
  /** Data returned from the submit callback (if successful) */
  data?: TData
  /** Error thrown by the submit callback (if failed) */
  error?: TError
}
