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
   * @defaultValue ['blur', 'input']
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

  /** Validate the form */
  validateForm(): Promise<boolean>

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

  /** Resets the form to its initial state */
  reset(): void
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
>

export type FormSlots<TSchema extends Schema = Schema> = {
  default: (props: Pick<
    Form<TSchema>,
    'errors'
    | 'isSubmitting'
    | 'isValid'
    | 'initialState'
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
