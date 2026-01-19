import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ComputedRef, FormHTMLAttributes, MaybeRefOrGetter, Ref } from 'vue'
import type { ObjectSchema, ValidationMode, ValidationTriggers } from './shared'
import type { DeepPartial, Paths } from './utils'

/**
 * Configuration options for initializing a new form instance via useForm.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type UseFormOptions<TSchema extends ObjectSchema> = {
  /**
   * High level unique identifier for the form instance.
   * If not provided, a unique ID will be automatically generated.
   */
  id?: string
  /**
   * The validation schema used to parse and validate form data.
   * This can be a static schema object, a Vue ref, or a getter function.
   * Using a ref or getter allows the schema to change dynamically during the form lifecycle.
   */
  schema: MaybeRefOrGetter<TSchema>
  /**
   * Data used to populate the form fields when it is first created.
   * This should be a plain object representing a subset of the data structure defined in the schema.
   */
  initialState?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>
  /**
   * A list of initial validation issues to display before any user interaction occurs.
   */
  initialErrors?: StandardSchemaV1.Issue[]
  /**
   * Specifies how and when the form performs validation logic.
   * Refer to the ValidationMode type for specific behavior options.
   */
  mode?: ValidationMode
  /**
   * A list of event names that should trigger a validation check for individual fields.
   */
  validateOn?: ValidationTriggers[]
  /**
   * Optional callback that runs after schema validation succeeds.
   * Use this for custom validation logic such as:
   * - Cross-field validation
   * - Server-side validation (API calls)
   * - Business logic checks
   * - Custom error transformations
   *
   * @param data The successfully validated and transformed data from the schema
   * @returns
   * - `true` or `void`: Validation passed
   * - `false`: Validation failed (form-level, no specific field errors)
   * - `StandardSchemaV1.Issue[]`: Validation failed with specific field errors
   *
   * @example
   * ```ts
   * // Field-specific error
   * onValidate: async (data) => {
   *   const exists = await checkEmailExists(data.email)
   *   if (exists) {
   *     return [{
   *       message: 'Email already taken',
   *       path: ['email']
   *     }]
   *   }
   * }
   *
   * // Form-level error (no specific field)
   * onValidate: async (data) => {
   *   const canSubmit = await checkPermissions(data)
   *   if (!canSubmit) {
   *     return false // or throw an error
   *   }
   * }
   * ```
   */
  onValidate?: (data: StandardSchemaV1.InferOutput<TSchema>) => boolean | void | StandardSchemaV1.Issue[] | Promise<boolean | void | StandardSchemaV1.Issue[]>
  /**
   * Optional callback that runs when the form is reset.
   * Use this for custom reset logic such as:
   * - Clearing custom state
   * - Resetting custom errors
   * - Custom cleanup
   *
   * @example
   * ```ts
   * // Clear custom state
   * onReset: () => {
   *   customState.value = null
   * }
   * ```
   */
  onReset?: () => void
}

/**
 * The core state and methods provided by a form instance for managing field data and validation.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type FormContext<TSchema extends ObjectSchema> = {
  /**
   * The active unique identifier for this form instance.
   */
  id: string
  /**
   * A deeply reactive object containing the current values of all form fields.
   * Changes to this object will trigger reactivity in the UI and potential validations.
   */
  state: Ref<StandardSchemaV1.InferInput<TSchema>>
  /**
   * A function to update the form state.
   * @param _state The new state to apply to the form.
   * @param _validate Whether to validate the form after updating the state - defaults to true.
   */
  setState: (_state: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _validate?: boolean) => void
  /**
   * A static representation of the form's data at the moment of initialization.
   */
  initialState: StandardSchemaV1.InferInput<TSchema>
  /**
   * A reactive array containing all validation issues currently identified in the form.
   */
  errors: Ref<StandardSchemaV1.Issue[]>
  /**
   * A function to update the form errors.
   * @param _errors The new errors to apply to the form.
   */
  setErrors: (_errors: StandardSchemaV1.Issue[]) => void
  /**
   * A function to get the errors for a specific field.
   * @param field The field to get the errors for.
   */
  getFieldErrors: (field: Paths<StandardSchemaV1.InferInput<TSchema>>) => StandardSchemaV1.Issue[]
  /**
   * The original list of validation issues provided when the form was created.
   */
  initialErrors: StandardSchemaV1.Issue[]
  /**
   * A computed reference that always resolves to the current active validation schema.
   */
  schema: ComputedRef<TSchema>
  /**
   * The validation strategy being used by the form instance.
   */
  mode: ValidationMode
  /**
   * The interactions configured to trigger validation checks.
   */
  validateOn: ValidationTriggers[]
  /**
   * Validates the current form state against the resolved schema.
   * If schema validation passes and an onValidate callback is provided,
   * executes the callback for additional custom validation.
   * Updates the errors reactive reference with any issues found.
   * @returns A promise resolving to the validation result containing either issues or parsed data.
   */
  validate: () => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>
  /**
   * Validates a specific field in the form.
   * @param field The field to validate.
   * @returns A promise resolving to the validation result containing either issues or parsed data.
   */
  validateField: (field: Paths<StandardSchemaV1.InferInput<TSchema>>) => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>
  /**
   * Reverts the form state and errors back to their initial values.
   * @param _state Optional partial state to apply instead of the initial state.
   * @param _errors Optional array of validation issues to apply instead of the initial errors.
   * @param _validate Optional boolean to indicate whether to validate the form after resetting - defaults to false.
   */
  reset: (_state?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>, _errors?: StandardSchemaV1.Issue[], _validate?: boolean) => void
  /**
   * A reactive boolean indicating whether a validation operation is currently in progress.
   */
  isValidating: Ref<boolean>
  /**
   * A reactive boolean indicating whether the form is valid.
   */
  isValid: ComputedRef<boolean>
  /**
   * A reactive boolean indicating whether at least one field has been touched(blurred).
   */
  isTouched: ComputedRef<boolean>
  /**
   * Touches a specific field, marking it as interacted with.
   * @param field The field to touch.
   */
  touchField: (field: Paths<StandardSchemaV1.InferInput<TSchema>>) => void
  /**
   * Touches all fields, marking them as interacted with.
   */
  touchAllFields: () => void
  /**
   * A reactive set of touched fields.
   */
  touchedFields: Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>
  /**
   * A reactive boolean indicating whether the form is dirty(i.e. the user has interacted with it).
   */
  isDirty: ComputedRef<boolean>
  /**
   * A reactive set of dirty fields.
   */
  dirtyFields: Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>
  /**
   * Marks a specific field as dirty.
   * @param field The field to mark as dirty.
   */
  dirtyField: (field: Paths<StandardSchemaV1.InferInput<TSchema>>) => void
  /**
   * Marks all fields as dirty.
   */
  dirtyAllFields: () => void
}

/**
 * Properties accepted by the Form component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type FormProps<TSchema extends ObjectSchema> = Pick<FormContext<TSchema>, 'id'> & /* @vue-ignore */ Omit<FormHTMLAttributes, 'id'>

/**
 * Slots provided by the Form component for rendering content.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type FormSlots<TSchema extends ObjectSchema> = {
  /**
   * The default slot receives the entire form context as its scope.
   * This allows child components to access state, errors, and methods.
   */
  default: (props: FormContext<TSchema>) => void
}

/**
 * Events emitted by the Form component.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type FormEmits<TSchema extends ObjectSchema> = {
  /**
   * Triggered when the form is submitted and validation passes successfully.
   * It provides the validated and transformed data as the first argument.
   */
  submit: [data: StandardSchemaV1.InferOutput<TSchema>]
  /**
   * Triggered when a validation check fails.
   * It provides an array of validation issues as the first argument.
   */
  error: [errors: StandardSchemaV1.Issue[]]
}

/**
 * The expected return value from the useForm composable.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type UseFormReturn<TSchema extends ObjectSchema> = FormContext<TSchema>
