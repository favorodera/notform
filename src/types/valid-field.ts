import type { ComputedRef } from 'vue'
import type { Schema, ValidationTriggers } from './shared'
import type { InputPaths, InputPathValue } from './utils'

export type FieldProps<TSchema extends Schema, TPath extends InputPaths<TSchema>> = {
  /** The field name (dot-notation path) */
  name: TPath

  /** Optional field ID for accessibility */
  id?: string

  /** Override form-level validation triggers for this field */
  validateOn?: ValidationTriggers[]
}

export type FieldInputProps<TSchema extends Schema, TPath extends InputPaths<TSchema>> = {
  id: string
  name: TPath
  value: InputPathValue<TSchema, TPath>
  onFocus: () => void
  onBlur: () => void
  onInput: (event: Event) => void
  onChange: (event: Event) => void
}

export type FieldSlots<TSchema extends Schema, TPath extends InputPaths<TSchema>> = {
  default: (props: {
    field: FieldInputProps<TSchema, TPath>
    errors: string[]
    hasError: boolean
    isTouched: boolean
    isDirty: boolean
    isFocused: boolean
  }) => void
}

export type FieldExpose = {
  isTouched: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isFocused: ComputedRef<boolean>
  hasError: ComputedRef<boolean>
  errors: ComputedRef<string[]>
  value: ComputedRef<unknown>
}
