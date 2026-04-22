import type { DeepPartial, ObjectSchema, Paths } from './shared'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { Ref, ComputedRef, Raw } from 'vue'
import type { UseNotFormConfig } from './use-not-form'

/**
 * The complete state and API of a form instance returned by `useNotForm`.
 * @template TSchema The validation schema type derived from `ObjectSchema`.
 */
export type NotFormInstance<TSchema extends ObjectSchema> = Raw<{


  // CONFIG


  /** The values the form was initialised or last reset with. */
  readonly initialValues: UseNotFormConfig<TSchema>['initialValues']

  /** The errors the form was initialised or last reset with. */
  readonly initialErrors: UseNotFormConfig<TSchema>['initialErrors']

  /** The resolved validation triggers for this form. */
  readonly validateOn: Required<NonNullable<UseNotFormConfig<TSchema>['validateOn']>>

  /** The resolved validation mode for this form. */
  readonly validationMode: Required<NonNullable<UseNotFormConfig<TSchema>['validationMode']>>


  // VALUES


  /**
   * Deeply reactive object of field values.
   *
   * Access directly — no `.value` needed:
   * ```ts
   * form.values.email
   * ```
   *
   * Use with `v-model` for two-way binding:
   * ```vue
   * <input v-model="form.values.email" />
   * ```
   */
  values: StandardSchemaV1.InferInput<TSchema>

  /**
   * Sets a field value by dot-separated path.
   *
   * Useful for deeply nested paths or custom inputs that do not use `v-model`.
   * Does **not** trigger validation — the field's event handlers are responsible for that.
   *
   * ```ts
   * form.setValue('address.city', 'Lagos')
   * ```
   */
  setValue: <const TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>>(
    path: TPath,
    value: Get<StandardSchemaV1.InferInput<TSchema>, TPath, { strict: false }>,
  ) => void


  // TOUCH


  /**
   * The set of field paths the user has interacted with.
   * Populated for all paths when the form is submitted.
   */
  touchedFields: Set<Paths<StandardSchemaV1.InferInput<TSchema>>>

  /** Whether any field has been touched. */
  isTouched: ComputedRef<boolean>

  /**
   * Marks a field as touched.
   * Typically called automatically by the field's `onBlur` handler.
   */
  touchField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => void


  // DIRTY


  /** The set of field paths whose current value differs from the initial value. */
  dirtyFields: Set<Paths<StandardSchemaV1.InferInput<TSchema>>>

  /** Whether any field value differs from its initial value. */
  isDirty: ComputedRef<boolean>

  /**
   * Marks a field as dirty.
   * Typically called automatically when a field value changes.
   */
  dirtyField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => void


  // ERRORS


  /** The raw validation issues produced by the last validation run. */
  errors: StandardSchemaV1.Issue[]

  /**
   * A flat map of field path to its first error message.
   *
   * Convenient for direct template access without calling `getFieldErrors`:
   * ```vue
   * <p>{{ form.errorsMap['address.city'] }}</p>
   * ```
   */
  errorsMap: ComputedRef<Partial<Record<Paths<StandardSchemaV1.InferInput<TSchema>>, string>>>

  /**
   * Replaces an existing error for the same path, or appends it if none exists.
   * Useful for setting server-side errors after submission.
   */
  setError: (error: StandardSchemaV1.Issue) => void

  /** Replaces all current errors with the provided issues. */
  setErrors: (errors: StandardSchemaV1.Issue[]) => void

  /** Removes all active validation errors. */
  clearErrors: () => void

  /**
   * Returns all validation issues for a specific field path.
   *
   * ```ts
   * form.getFieldErrors('address.city')
   * ```
   */
  getFieldErrors: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => StandardSchemaV1.Issue[]


  // VALIDATION


  /** Whether a validation run is currently in progress. */
  isValidating: Ref<boolean>

  /**
   * Validates the entire form against the schema.
   * Replaces all current errors with the result.
   */
  validate: () => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>

  /**
   * Validates a single field against the schema.
   * Only replaces errors for that field — all other fields are left untouched.
   */
  validateField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>

  /** Whether the form currently has no validation errors. */
  isValid: ComputedRef<boolean>


  // SUBMISSION


  /** Whether the form is currently running its submit handler. */
  isSubmitting: Ref<boolean>

  /**
   * Validates the form and runs `onSubmit` if it passes.
   *
   * Marks all fields as touched and dirty before validating so all errors surface.
   * If validation fails, submission is aborted.
   * Bind to the native form's `@submit` event:
   *
   * ```vue
   * <form @submit="form.submit">
   * ```
   */
  submit: (event: Event) => Promise<void>


  // RESET


  /**
   * Resets the form to its initial state, or to new values and errors if provided.
   *
   * Clears all touched and dirty tracking. If `values` or `errors` are passed,
   * they replace the stored baseline so subsequent resets return to the new state.
   *
   * ```ts
   * // Reset to original initial values
   * form.reset()
   *
   * // Reset to new values (becomes the new baseline)
   * form.reset({ name: 'Jane' })
   * ```
   */
  reset: (
    values?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>,
    errors?: StandardSchemaV1.Issue[],
  ) => void


}>


// COMPONENT TYPES


/** Props for the `NotForm` component. */
export type NotFormProps = {
  /** The form instance to provide to all descendant `NotField` components. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: NotFormInstance<any>
}

/** Slots for the `NotForm` component. */
export type NotFormSlots = {
  /** The default slot receives the full form instance */
  default: []
}
