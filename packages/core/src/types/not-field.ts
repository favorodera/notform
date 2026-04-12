import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema, ValidationTrigger } from './shared'
import type { NotFormInstance } from './not-form'


// EVENTS


/**
 * Native DOM event handlers exposed by a field.
 * Spread onto a native input or bind individually to custom components.
 *
 * ```vue
 * <!-- spread -->
 * <input v-bind="events" />
 *
 * <!-- individual -->
 * <CustomCombobox @focusout="onBlur" @pick="onChange" />
 * ```
 */
export type NotFieldEvents = {
  /** Triggered when the field loses focus. */
  onBlur: () => void
  /** Triggered on every keystroke or value change. */
  onInput: () => void
  /** Triggered when the field value is committed. */
  onChange: () => void
  /** Triggered when the field gains focus. */
  onFocus: () => void
}


// PROPS


/** Props for the `NotField` component. */
export type NotFieldProps = {
  /** Dot-separated path to this field within the form values. */
  path: string

  /**
   * Explicit form instance override.
   * Takes priority over the instance provided by a `NotForm` ancestor.
   * Required when using `NotField` outside of a `NotForm` (singleton fields).
   *
   * ```vue
   * <NotField :form="form" path="email" v-slot="{ events }">
   *   <input v-bind="events" />
   * </NotField>
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: NotFormInstance<any>

  /**
   * Per-field validation trigger overrides.
   * Merged over the form-wide `validateOn` — only the keys you specify are overridden.
   *
   * ```vue
   * <!-- form validates on blur only, but this field also validates on every input -->
   * <NotField :validateOn="{ onInput: true }" path="username" />
   * ```
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>
}


// SLOT PROPS


/**
 * Everything available inside the `NotField` default slot.
 * @template TSchema The validation schema type derived from `ObjectSchema`.
 */
export type NotFieldSlotProps<TSchema extends ObjectSchema> = {
  /** The dot-separated path to this field. */
  path: string

  /**
   * The current value of this field — read-only snapshot for display purposes.
   * Do not mutate directly or use with `v-model`.
   * For two-way binding use `v-model="form.values.fieldName"` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any

  /** All validation issues for this field from the last validation run. */
  errors: StandardSchemaV1.Issue[]

  /** Whether this field currently has no validation errors. */
  isValid: boolean

  /** Whether the user has interacted with this field, or the form has been submitted. */
  isTouched: boolean

  /** Whether this field's current value differs from its initial value. */
  isDirty: boolean

  /** Whether an async validator is currently running for this field. */
  isValidating: boolean

  /**
   * Manually triggers validation for this field.
   * Useful for custom inputs that manage their own interaction events.
   */
  validate: () => ReturnType<NotFormInstance<TSchema>['validateField']>

  /**
   * All event handlers combined — spread directly onto native inputs.
   *
   * ```vue
   * <input v-bind="events" />
   * ```
   */
  events: NotFieldEvents

  /** Triggered when the field loses focus. */
  onBlur: NotFieldEvents['onBlur']
  /** Triggered on every keystroke or value change. */
  onInput: NotFieldEvents['onInput']
  /** Triggered when the field value is committed. */
  onChange: NotFieldEvents['onChange']
  /** Triggered when the field gains focus. */
  onFocus: NotFieldEvents['onFocus']
}


// SLOTS


/**
 * Slots for the `NotField` component.
 * @template TSchema The validation schema type derived from `ObjectSchema`.
 */
export type NotFieldSlots<TSchema extends ObjectSchema> = {
  /** The default slot receives the full field state and event handlers. */
  default: (props: NotFieldSlotProps<TSchema>) => []
}
