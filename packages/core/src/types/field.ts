import type { ExcludeStrict } from 'type-fest'
import type { Issue, ObjectSchema, Path, ValidationTrigger } from './shared'
import type { UseFormReturn } from './use-form'

/** Props for `<Field>`. */
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

/** Slot props for `<Field>`. */
export interface FieldSlots {
  default?: (props: {
    errors: Array<Issue>
    events: Record<ExcludeStrict<ValidationTrigger, 'onMount'>, () => void>
    isDirty: boolean
    isTouched: boolean
    isValid: boolean
    isValidating: boolean
    path: string
  }) => void
}
