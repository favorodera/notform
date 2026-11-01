import type { ValidationIssue, ValidationResult } from './validation'

/**
 * Per-field behavior, passed as the second argument of `form.field()` / `form.arrayField()`.
 * @remarks Read once, when the field is first created.
 * @example
 * form.field('email', { debounce: 300, validateOn: { input: true } })
 */
export type FieldConfig = {
  /** Milliseconds to wait after the last `input` / `change` before validating. `blur` always validates immediately. */
  debounce?: number

  /** Which events trigger validation. Omitted events keep their defaults (`blur` and `change` on, `input` off). */
  validateOn?: Partial<Record<FieldValidationEvent, boolean>>

  /**
   * - `'eager'`: once the field has errors, every `input` and `change` re-validates it,
   * so the error disappears as soon as the value is fixed.
   *
   * - `'lazy'`: only the events enabled in `validateOn` validate.
   * @default 'eager'
   */
  validationMode?: 'eager' | 'lazy'
}

/** Handlers to spread onto an input: `<input v-bind="field.events">`. */
export type FieldEvents = Record<`on${Capitalize<FieldValidationEvent>}`, () => void>

/**
 * A single form field, bound to one value inside the form.
 *
 * Created by `form.field('some.path')`. The instance is cached, so asking for the
 * same path again returns the same field with the same `id`.
 * @template TValue - Type of the value this field holds.
 */
export type FieldInstance<TValue> = {
  /** Issues reported exactly at this field's path (not those of nested fields). */
  errors: ValidationIssue[]

  /** Handlers for `blur` / `change` / `input`; they mark the field touched and trigger validation. */
  events: FieldEvents

  /** Stable identity. Safe as a `v-for` key; does not change when the field's path does. */
  id: symbol

  /** `true` when the value differs (deep comparison) from the initial value at the field's path. */
  isDirty: boolean

  /** `true` once the field was blurred, or the form was submitted. */
  isTouched: boolean

  /** `true` when {@link FieldInstance.errors} is empty. */
  isValid: boolean

  /** `true` while this field, a field nested in it, or the whole form is being validated. */
  isValidating: boolean

  /** The field's value. Assign to it (or `v-model` it) to write straight into `form.values`. */
  model: TValue

  /** Current dot-notation location, e.g. `'address.city'`. Follows the field when array items move. */
  path: string

  /**
   * Validates this field now, skipping any pending debounce.
   * @returns `{ value }` with the current value, or `{ issues }` for this field.
   */
  validate: () => Promise<ValidationResult<unknown>>
}

/**
 * Props of the `<Field>` component.
 * @template TValue - Type of the value the field holds.
 */
export type FieldProps<TValue> = {
  /** The field created by `form.field('some.path')`, or an array item. */
  field: FieldInstance<TValue>
}

/**
 * Slots of the `<Field>` component.
 * @template TValue - Type of the value the field holds.
 */
export type FieldSlots<TValue> = {
  /** Receives the `field`. Extra attributes set on `<Field>` arrive as additional slot props. */
  default?: (props: { field: FieldInstance<TValue> }) => void
}

/** Events that can trigger a field's validation. See {@link FieldConfig.validateOn}. */
export type FieldValidationEvent = 'blur' | 'change' | 'input'
