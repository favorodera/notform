/**
 * Per-field behavior settings, passed as the second argument of `form.field()`.
 * @remarks Not wired up yet: these options are resolved inside `createField`
 * but nothing reads them. They document the intended API.
 * @example
 * form.field('email', { debounce: 300, validateOn: { blur: false, input: true } })
 */
export type FieldConfig = {
  /** Milliseconds to wait after the last event before validating. Negative or non-finite values are treated as `0`. */
  debounce?: number

  /**
   * Which events should trigger validation. Omitted events keep their defaults
   * (`blur` and `change` are on).
   */
  validateOn?: Partial<Record<FieldValidationEvent, boolean>>

  /**
   * How aggressively the field re-validates.
   * @default 'eager'
   * @todo Document the exact difference between `'eager'` and `'lazy'` once implemented.
   */
  validationMode?: 'eager' | 'lazy'
}

/**
 * A single form field, bound to one value inside the form.
 *
 * Created by `form.field('some.path')` and handed to the `<Field>` component.
 * @template TValue - Type of the value this field holds (derived from the schema at `path`).
 */
export type FieldInstance<TValue> = {
  events: Record<`on${Capitalize<FieldValidationEvent>}`, () => void>

  /** Unique identity of this field instance. */
  id: symbol

  /** `true` when the field's value differs (deep comparison) from its initial value. */
  isDirty: boolean

  isTouched: boolean

  /**
   * The field's current value. Read it to display the value; assign to it
   * (or bind with `v-model`) to write straight through to `form.values` at `path`.
   */
  model: TValue

  /** Dot-notation location of this field in the form's values, e.g. `'address.city'` or `'tags.0'`. */
  path: string
}

/**
 * Props of the `<Field>` component.
 * @template TValue - Type of the value the field holds.
 */
export type FieldProps<TValue> = {
  /** The field created by `form.field('some.path')`. */
  field: FieldInstance<TValue>
}

/**
 * Slots of the `<Field>` component.
 * @template TValue - Type of the value the field holds.
 */
export type FieldSlots<TValue> = {
  /** Receives the `field` (use `field.model` with `v-model`). Any extra attributes set on `<Field>` arrive as additional slot props. */
  default?: (props: { field: FieldInstance<TValue> }) => void
}

/** Events that can trigger a field's validation. See {@link FieldConfig.validateOn}. */
export type FieldValidationEvent = 'blur' | 'change' | 'input' | 'mount'
