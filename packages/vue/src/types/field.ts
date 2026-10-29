import type { ExcludeStrict } from 'type-fest'
import type { Issue } from './schema'

export type FieldProps = {
  debounce?: number
  validateOn?: Partial<Record<ValidationHooks, boolean>>
  validationMode?: 'eager' | 'lazy'
}

export type FieldSlots = {
  default?: (props: {
    errors: Issue[]
    events: Record<ExcludeStrict<ValidationHooks, 'onMount'>, () => void>
    isDirty: boolean
    isTouched: boolean
    isValid: boolean
    isValidating: boolean
    path: string
  }) => void
}

export type ValidationHooks = 'onBlur' | 'onChange' | 'onInput' | 'onMount'
