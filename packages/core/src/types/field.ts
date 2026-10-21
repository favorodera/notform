import type { ExcludeStrict } from 'type-fest'
import type { Issue, ObjectSchema, Path, ValidationTrigger } from './shared'
import type { UseFormReturn } from './use-form'

/**
 * Props for `<Field>`.
 * @template TSchema Schema that defines the field path.
 */
export interface FieldProps<TSchema extends ObjectSchema> {
  /** Dot path of this field. */
  path: Path<TSchema>

  /** Form instance. Overrides `<Form>` injection. */
  form?: UseFormReturn<TSchema>

  /** Validation triggers. Blur and change are enabled by default. */
  validateOn?: Partial<Record<ValidationTrigger, boolean>>

  /** `lazy` disables input/change revalidation; `eager` enables it. */
  validationMode?: 'eager' | 'lazy'

  /** Debounce in ms for input/change validation. Blur always runs immediately. */
  debounce?: number
}

/** Reactive state and event handlers exposed by `<Field>`. */
export interface FieldSlots {
  /**
   * Renders the field state and input event handlers.
   * @param props Current field state and event handlers.
   * @param props.errors Current validation issues for the field.
   * @param props.events Blur, input, and change handlers for the control.
   * @param props.isDirty Whether the field differs from its reset baseline.
   * @param props.isTouched Whether the field or form has been interacted with.
   * @param props.isValid Whether the field has no current issues.
   * @param props.isValidating Whether validation overlaps this field.
   * @param props.path Configured field path.
   * @returns Nothing; Vue renders the slot template.
   */
  default?: (props: {
    /** Current issues for the field path. */
    errors: Array<Issue>

    /** Blur, input, and change handlers for the target control. */
    events: Record<ExcludeStrict<ValidationTrigger, 'onMount'>, () => void>

    /** Whether the value differs from its reset baseline. */
    isDirty: boolean

    /** Whether the field has been touched or the form submitted. */
    isTouched: boolean

    /** Whether the field has no current issues. */
    isValid: boolean

    /** Whether validation currently overlaps this field. */
    isValidating: boolean

    /** Configured field path. */
    path: string
  }) => void
}
