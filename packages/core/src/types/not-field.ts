import type { ExcludeStrict } from 'type-fest'
import type { NotFormAPI } from './not-form-api'
import type { Issue, ObjectSchema, Paths, ValidationTrigger } from './shared'

/**
 * Props for `<NotField>`.
 * @template TSchema The form schema.
 */
export interface NotFieldProps<TSchema extends ObjectSchema> {
  /** Dot path of this field. */
  path: Paths<TSchema>

  /** Form instance. Overrides `<NotForm>` inject. Required outside `<NotForm>`. */
  form?: NotFormAPI<TSchema>

  /**
   * Validation triggers merged over `{ onBlur: true, onChange: true }`.
   * `onMount` is also a valid trigger here, even though it has no matching
   * entry in `events` below — there's no DOM event to bind for "the field
   * just appeared," so it runs automatically, once, when the field mounts.
   * @default { onBlur: true, onChange: true }
   */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>

  /**
   * `lazy` — blur/submit only. `eager` — also revalidate on change/input while invalid.
   * @default 'eager'
   */
  validationMode?: 'eager' | 'lazy'

  /** Debounce in ms for input/change validation. Blur always runs immediately. */
  debounce?: number
}

/** Slot props for `<NotField>`. */
export interface NotFieldSlots {
  default?: (props: {
    /** Issues for this field path. */
    errors: Array<Issue>

    /**
     * Handlers to bind to the input. `onMount` is deliberately excluded —
     * see the note on `validateOn` above for why.
     */
    events: Record<ExcludeStrict<ValidationTrigger, 'onMount'>, () => void>

    /** Whether the value differs from the baseline. */
    isDirty: boolean

    /** Whether the user has interacted with this field. */
    isTouched: boolean

    /** Whether this field has no issues. */
    isValid: boolean

    /** Whether this field is currently validating. */
    isValidating: boolean

    /** Dot path of this field. */
    path: string
  }) => void
}
