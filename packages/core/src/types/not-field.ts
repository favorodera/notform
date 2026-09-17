import type { NotFormAPI } from './not-form-api'
import type { Issue, ObjectSchema, Paths, ValidationTrigger } from './shared'

/**
 * Props accepted by the `NotField` component.
 * @template TSchema The validation schema.
 */
export interface NotFieldProps<TSchema extends ObjectSchema> {
  /** Dot-notated field path to this field. */
  path: Paths<TSchema>

  /**
   * Explicit form instance.
   *
   * Takes priority over the instance provided by an ancestor `<NotForm>`.
   * Required when using `<NotField>` outside of `<NotForm>`.
   */
  form?: NotFormAPI<TSchema>

  /**
   * Interaction events that trigger validation for this field.
   * 
   * Only set what you need, it will be merged with the default
   * - `onBlur` — when the field loses focus.
   * - `onChange` — when the field value is committed.
   * - `onInput` — on every keystroke.
   * - `onMount` — when the field component mounts.
   * @default { onBlur: true, onChange: true }
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>

  /**
   * Validation timing strategy:
   * - `lazy`: Validates on blur or submission only.
   * - `eager`: Validates on blur, then on every change while errors exist.
   * @default 'eager'
   */
  validationMode?: 'eager' | 'lazy'

  /**
   * Delay in milliseconds before executing debounced validation on input or change.
   * Blur validation always runs immediately.
   */
  debounce?: number
}

/** Slot definitions for the `NotField` component. */
export interface NotFieldSlots {
  /** The default slot receives the field state and event handlers. */
  default?: (props: {
    /** Active validation issues for this field. */
    errors: Array<Issue>

    /** Interaction event handlers to bind to inputs. */
    events: Record<ValidationTrigger, () => void>

    /** Whether the field value differs from its initial state. */
    isDirty: boolean

    /** Whether the field has been interacted with. */
    isTouched: boolean

    /** Whether the field has zero validation errors. */
    isValid: boolean

    /** Whether validation is currently running for this field. */
    isValidating: boolean

    /** Dot-notated path to this field. */
    path: string
  }) => void
}
