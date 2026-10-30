import type { MaybeRefOrGetter } from 'vue'
import type { DeepPartial } from './deep-partial'
import type { FieldConfig, FieldInstance } from './field'
import type { InputPath, InputPathValue, OutputPathValue } from './path'
import type { FormSchema, SchemaInput, SchemaOutput } from './schema'
import type { ValidationIssue, ValidationResult } from './validation'

/**
 * Options accepted by `useForm()`.
 * @template TSchema - The schema describing the form's data (must be an object schema).
 */
export type FormConfig<TSchema extends FormSchema> = {
  /** Errors to show from the start (e.g. returned by the server). */
  initialErrors?: ValidationIssue[]

  /** Values to start with. May be partial; the schema is only enforced on validation. */
  initialValues?: DeepPartial<SchemaInput<TSchema>>

  /** Called with the validated, parsed data after a successful submit. */
  onSubmit?: (data: SchemaOutput<TSchema>) => Promise<void> | void

  /** The schema to validate against. Accepts a value, a ref, or a getter, so it can change reactively. */
  schema: MaybeRefOrGetter<TSchema>
}

/**
 * A reactive form: its values, errors, state flags, and the actions to change them.
 * This is what `useForm()` returns.
 * @template TSchema - The schema describing the form's data (must be an object schema).
 */
export type FormInstance<TSchema extends FormSchema> = {
  /** Removes every error from the form. */
  clearErrors: () => void

  /** Current validation errors for the whole form. Empty when everything is valid. */
  errors: ValidationIssue[]

  /**
   * Creates a field bound to the value at `path`.
   * @param path Dot-notation path to the value, e.g. `'address.city'`.
   * @param config Optional per-field behavior settings.
   * @returns A reactive field to pass to the `<Field>` component.
   */
  field: <TPath extends InputPath<TSchema>>(path: TPath, config?: FieldConfig) => FieldInstance<InputPathValue<TSchema, TPath>>

  /** The errors the form started with (e.g. from the server). Never changes after creation. */
  initialErrors: ValidationIssue[]

  /** The values the form started with. Never changes after creation; used to detect `isDirty`. */
  initialValues: DeepPartial<SchemaInput<TSchema>>

  /** `true` when `values` differ (deep comparison) from `initialValues`. */
  isDirty: boolean

  /** `true` once the user has tried to submit at least once, even if validation failed. */
  isSubmitted: boolean

  /** `true` while a submit is running (validating, or waiting for `onSubmit`). Handy for disabling the submit button. */
  isSubmitting: boolean

  /** `true` when there are no errors. Reflects the last validation run; reading it does not validate. */
  isValid: boolean

  /** Replaces all current errors with `nextErrors` (e.g. errors returned by the server). */
  replaceErrors: (nextErrors: ValidationIssue[]) => void

  /**
   * Writes `value` into the form at `path`.
   * @param path Dot-notation path to the value.
   * @param value The new value (typed from the schema).
   */
  setValue: <TPath extends InputPath<TSchema>>(path: TPath, value: InputPathValue<TSchema, TPath>) => void

  /**
   * Validates the whole form and, if valid, calls `onSubmit`.
   * Safe to pass directly to a `<form @submit>` handler.
   */
  submit: (event?: SubmitEvent) => Promise<void>

  /** How many times submit has been attempted. */
  submitCount: number

  /**
   * Validates the whole form and replaces all errors with the outcome.
   * Does not call `onSubmit`.
   * @returns `{ value }` when valid, otherwise `{ issues }`.
   */
  validate: () => Promise<ValidationResult<SchemaOutput<TSchema>>>

  /**
   * Validates a single field and updates only that field's errors.
   * @param path Dot-notation path to the field.
   * @returns `{ value }` when valid, otherwise `{ issues }` for that field.
   */
  validateField: <TPath extends InputPath<TSchema>>(path: TPath) => Promise<ValidationResult<OutputPathValue<TSchema, TPath>>>

  /** The live form data. Edit it directly or through `setValue` / field models. */
  values: SchemaInput<TSchema>
}

/**
 * Props of the `<Form>` component.
 * @template TSchema - The schema describing the form's data.
 */
export type FormProps<TSchema extends FormSchema> = {
  /** The form returned by `useForm()`. */
  form: FormInstance<TSchema>
}

/** Slots of the `<Form>` component. */
export type FormSlots = {
  /** The form's contents (fields, buttons, ...). */
  default?: () => void
}
