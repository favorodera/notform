import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFormInstance } from './not-form'
import type { ObjectSchema, ValidationTrigger } from './shared'

/** Props for the `NotField` component. */
export interface NotFieldProps {
  /** Dot-separated path to this field within the form values. */
  path: string

  /**
   * Explicit form instance override.
   * Takes priority over the instance provided by a `NotForm` ancestor.
   * Required when using `NotField` outside of a `NotForm` (singleton fields).
   *
   * ```vue
   * <template>
   *   <NotField :form="form" path="email" v-slot="{ events }">
   *     <input v-bind="events" />
   *   </NotField>
   * </template>
   * ```
   */
  form?: NotFormInstance<any>

  /**
   * Per-field validation trigger overrides.
   * Merged over the form-wide `validateOn` — only the keys you specify are overridden.
   *
   * ```vue
   * <template>
   *   <!-- form validates on blur only, but this field also validates on every input -->
   *   <NotField :validateOn="{ onInput: true }" path="username" />
   * </template>
   * ```
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>

  /**
   * Debounce delay in milliseconds for input- and change-triggered validation.
   *
   * When set, validation is deferred until the user stops typing for the given
   * duration. Only the final call within the window runs — earlier ones are
   * cancelled. Useful for async validators (e.g. username availability checks)
   * where firing on every keystroke would cause excessive requests.
   *
   * Blur- and submit-triggered validation always runs immediately, regardless
   * of this setting, so the field never feels unresponsive when the user leaves.
   *
   * ```vue
   * <template>
   *   <!-- validate 400ms after the user stops typing -->
   *   <NotField path="username" :debounce="400" v-slot="{ events }">
   *     <input v-model="form.values.username" v-bind="events" />
   *   </NotField>
   * </template>
   * ```
   *
   * Omit or set to `0` to disable debouncing (default behaviour).
   */
  debounce?: number
}

/**
 * Slots for the `NotField` component.
 * @template TSchema The form schema.
 */
export interface NotFieldSlots<TSchema extends ObjectSchema> {
  /** The default slot receives the full field state and event handlers. */
  default?: (props: {
  /** The dot-separated path to this field. */
    path: string

    /**
     * The current value of this field — read-only snapshot for display purposes.
     * Do not mutate directly or use with `v-model`.
     * For two-way binding use `v-model="form.values.fieldName"` instead.
     */
    value: any

    /** All validation issues for this field from the last validation run. */
    errors: Array<StandardSchemaV1.Issue>

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
     * Native DOM event handlers exposed by a field.
     * Spread onto a native input or bind individually to custom components.
     *
     * ```vue
     * <template>
     *   <!-- spread -->
     *   <input v-bind="events" />
     *
     *   <!-- individual -->
     *   <CustomCombobox v-on:focusout="events.onBlur" v-on:pick="events.onChange" />
     * </template>
     * ```
     */
    events: {
    /** Triggered when the field loses focus. */
      onBlur: () => void

      /** Triggered on every keystroke or value change. */
      onInput: () => void

      /** Triggered when the field value is committed. */
      onChange: () => void

      /** Triggered when the field gains focus. */
      onFocus: () => void
    }
  }) => any
}
