import type { DeepPartial, ObjectSchema, Paths } from './shared'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Get } from 'type-fest'
import type { Ref, ComputedRef } from 'vue'
import type { UseNotFormConfig } from './use-not-form'

/**
 * The core state and methods provided by a form instance.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotFormInstance<TSchema extends ObjectSchema> = {

  /**
   * A convenience self-reference to the form instance.
   * Useful when you prefer to destructure the composable return value but still need
   * to pass the full instance to NotForm or other components.
   * @example
   * const { values, submit, instance } = useNotForm({ schema, onSubmit })
   * // <NotForm :form="instance" />
   */
  instance: NotFormInstance<TSchema>


  /** The initial values the form was created or last reset with */
  readonly initialValues: UseNotFormConfig<TSchema>['initialValues']
  /** The initial errors the form was created or last reset with */
  readonly initialErrors: UseNotFormConfig<TSchema>['initialErrors']
  /**
   * The validation triggers of the form.
   * @default { onBlur: true, onChange: true, onInput: true }
   */
  readonly validateOn: UseNotFormConfig<TSchema>['validateOn']


  /** Deeply reactive object of field values */
  values: Ref<StandardSchemaV1.InferInput<TSchema>>
  /**
   * Updates a specific field value by path.
   * Also marks the field as touched and updates its dirty state.
   * @param path Dot-separated path to the field.
   * @param value The new value to apply.
   */
  setValue: <const TPath extends Paths<StandardSchemaV1.InferInput<TSchema>>>(
    path: TPath,
    value: Get<StandardSchemaV1.InferInput<TSchema>, TPath, { strict: false }>,
  ) => void
  /**
   * Updates multiple field values at once.
   * Each path is processed through setValue individually.
   * @param values Partial object of field paths to new values.
   */
  setValues: (values: DeepPartial<StandardSchemaV1.InferInput<TSchema>>) => void


  /** Reactive set of field paths that have been touched */
  touchedFields: Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>
  /** Whether any field in the form has been touched */
  isTouched: ComputedRef<boolean>
  /**
   * Marks a specific field as touched.
   * @param path Dot-separated path to the field.
   */
  touchField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => void
  /**
   * Marks a specific field as not touched.
   * @param path Dot-separated path to the field.
   */
  unTouchField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => void
  /** Marks all fields in the form as touched */
  touchAllFields: () => void
  /** Marks all fields in the form as not touched */
  unTouchAllFields: () => void


  /** Reactive set of field paths that have been dirtied */
  dirtyFields: Ref<Set<Paths<StandardSchemaV1.InferInput<TSchema>>>>
  /** Whether any field in the form has been dirtied */
  isDirty: ComputedRef<boolean>
  /**
   * Marks a specific field as dirty.
   * @param path Dot-separated path to the field.
   */
  dirtyField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => void
  /**
   * Marks a specific field as not dirty.
   * @param path Dot-separated path to the field.
   */
  unDirtyField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => void
  /** Marks all fields in the form as dirty */
  dirtyAllFields: () => void
  /** Marks all fields in the form as not dirty */
  unDirtyAllFields: () => void


  /** The raw issues from the last validation */
  errors: Ref<StandardSchemaV1.Issue[]>
  /**
   * A flat object mapping field paths to their first error message.
   * Useful for direct template access: errorsMap['user.email']
   */
  errorsMap: ComputedRef<Partial<Record<Paths<StandardSchemaV1.InferInput<TSchema>>, string>>>
  /**
   * Sets a single field error, replacing any existing error for that path.
   * @param error The issue to apply.
   */
  setError: (error: StandardSchemaV1.Issue) => void
  /**
   * Replaces all current errors with the provided issues.
   * @param errors The new set of issues.
   */
  setErrors: (errors: StandardSchemaV1.Issue[]) => void
  /** Removes all active validation issues */
  clearErrors: () => void
  /**
   * Returns all validation issues for a specific field path.
   * @param path Dot-separated path to the field.
   */
  getFieldErrors: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => StandardSchemaV1.Issue[]


  /** Whether any field or the full form is currently being validated */
  isValidating: Ref<boolean>
  /**
   * Validates the entire form against the schema.
   * @returns A promise resolving to the validation result.
   */
  validate: () => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>
  /**
   * Validates a specific field against the schema.
   * Only replaces errors for that field, leaving other fields untouched.
   * @param path Dot-separated path to the field.
   * @returns A promise resolving to the validation result.
   */
  validateField: (path: Paths<StandardSchemaV1.InferInput<TSchema>>) => Promise<StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>>
  /** Whether the form is valid */
  isValid: ComputedRef<boolean>


  /** Whether the form is currently submitting */
  isSubmitting: Ref<boolean>
  /**
   * Validates and then triggers form submission.
   * Marks all fields as touched and dirty before validating.
   * Calls onSubmit if validation passes, otherwise prevents native submission.
   * @param event The native form submission event.
   */
  submit: (event: Event) => Promise<void>


  /**
   * Resets the form to its initial or provided state.
   * Clears all touched and dirty fields.
   * If new values or errors are provided, they become the new baseline.
   * @param values Optional new initial values to reset to.
   * @param errors Optional new initial errors to reset to.
   */
  reset: (
    values?: DeepPartial<StandardSchemaV1.InferInput<TSchema>>,
    errors?: StandardSchemaV1.Issue[],
  ) => void
}

/**
 * Props for the NotForm component
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
export type NotFormProps<TSchema extends ObjectSchema> = {
  /** The form instance to use */
  instance: NotFormInstance<TSchema>
}

export type NotFormSlots = {
  /** The default slot */
  default: []
}
