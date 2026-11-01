import type { MaybeRefOrGetter } from 'vue'
import type { ArrayFieldInstance } from './array-field'
import type { DeepPartial } from './deep-partial'
import type { FieldConfig, FieldInstance } from './field'
import type { ArrayItem, InputArrayPath, InputPath, InputPathValue } from './path'
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
  /**
   * Gets or creates the array field at `path`. Cached: the same path always returns the same field.
   * @param path Dot-notation path to an array, e.g. `'tags'`.
   * @param config Optional per-field behavior, read when the field is first created.
   * @returns A reactive array field to pass to `<ArrayField>`.
   */
  arrayField: <TPath extends InputArrayPath<TSchema>>(path: TPath, config?: FieldConfig) => ArrayFieldInstance<ArrayItem<InputPathValue<TSchema, TPath>>>

  /** Removes every error from the form. */
  clearErrors: () => void

  /** Current validation errors of the whole form. Empty when everything is valid. */
  errors: ValidationIssue[]

  /**
   * Gets or creates the field at `path`. Cached: the same path always returns the
   * same field (same `id`, same touched state), so it is safe to call inside a template.
   * @param path Dot-notation path to the value, e.g. `'address.city'`.
   * @param config Optional per-field behavior, read when the field is first created.
   * @returns A reactive field to pass to `<Field>`.
   */
  field: <TPath extends InputPath<TSchema>>(path: TPath, config?: FieldConfig) => FieldInstance<InputPathValue<TSchema, TPath>>

  /**
   * Reads the issues reported exactly at `path`.
   * @param path Dot-notation path.
   * @returns The matching issues.
   */
  getFieldErrors: <TPath extends InputPath<TSchema>>(path: TPath) => ValidationIssue[]

  /**
   * Reads the live value at `path`.
   * @param path Dot-notation path.
   * @returns The current value.
   */
  getValue: <TPath extends InputPath<TSchema>>(path: TPath) => InputPathValue<TSchema, TPath>

  /** The errors the form started with. Replaced as a whole by `reset(values, errors)`. */
  initialErrors: ValidationIssue[]

  /** The values the form started with; `isDirty` compares against them. Replaced as a whole by `reset(values)`. */
  initialValues: DeepPartial<SchemaInput<TSchema>>

  /** `true` when `values` differ (deep comparison) from `initialValues`. */
  isDirty: boolean

  /**
   * Tells whether a validation concerning `path` is running: a whole-form run, a run on
   * the path itself, or a run on a field nested inside it.
   * @param path Dot-notation path.
   * @returns `true` while one is running.
   */
  isFieldValidating: <TPath extends InputPath<TSchema>>(path: TPath) => boolean

  /** `true` once a submit was attempted, even if validation failed. */
  isSubmitted: boolean

  /** `true` while a submit is running (validating, or waiting for `onSubmit`). */
  isSubmitting: boolean

  /** `true` once any field was blurred or a submit was attempted. */
  isTouched: boolean

  /** `true` when there are no errors. Reflects the last validation; reading it does not validate. */
  isValid: boolean

  /** `true` while any validation is running. */
  isValidating: boolean

  /**
   * Replaces all current errors.
   * @param nextErrors The errors the form should now show (e.g. from the server).
   */
  replaceErrors: (nextErrors: ValidationIssue[]) => void

  /**
   * Resets values, errors, touched state and submit state, and cancels pending validations.
   * Array items get fresh identities.
   * @param nextValues New starting values. Omit to go back to the current `initialValues`.
   * @param nextErrors New starting errors. Omit to go back to the current `initialErrors`.
   */
  reset: {
    (nextValues?: DeepPartial<SchemaInput<TSchema>>, nextErrors?: ValidationIssue[]): void

    /** Overload so it can be used directly as an event handler: `@reset.prevent="form.reset"`. */
    (event: Event): void
  }

  /** How many times the form was reset. Handy as a `:key` to remount inputs. */
  resetCount: number

  /**
   * Sets an error. Replaces the errors already on the same path.
   * @param error The issue to show. Without a `path` it is a form-level error.
   */
  setError: (error: ValidationIssue) => void

  /**
   * Writes `value` into the form at `path`.
   * @param path Dot-notation path.
   * @param value The new value (typed from the schema).
   */
  setValue: <TPath extends InputPath<TSchema>>(path: TPath, value: InputPathValue<TSchema, TPath>) => void

  /**
   * Validates the whole form and, if valid, calls `onSubmit`. Safe to use as a `<form v-on:submit>` handler.
   * Ignored while a submit is already running.
   * @param event The browser submit event; its default page reload is prevented.
   * @returns Resolves when the submit finished. Rejects with whatever `onSubmit` throws.
   */
  submit: (event?: SubmitEvent) => Promise<void>

  /** How many times a submit was attempted. */
  submitCount: number

  /**
   * Validates the whole form and replaces all errors with the outcome. Does not call `onSubmit`.
   * @returns `{ value }` (the parsed output) when valid, otherwise `{ issues }`.
   */
  validate: () => Promise<ValidationResult<SchemaOutput<TSchema>>>

  /**
   * Validates the whole form against the schema but updates only the errors at `path`.
   * @param path Dot-notation path.
   * @returns `{ value }` (the current input value) when the field is valid, otherwise `{ issues }`
   * for that field. A result made obsolete by a newer run is returned but not applied.
   */
  validateField: <TPath extends InputPath<TSchema>>(path: TPath) => Promise<ValidationResult<InputPathValue<TSchema, TPath>>>

  /** The live form data. Edit it directly, through `setValue`, or through field models. */
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
