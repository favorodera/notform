export type Field<TValue> = {
  id: symbol
  isDirty: boolean
  model: TValue
  path: string
}

export type FieldConfig = {
  debounce?: number
  validateOn?: Partial<Record<ValidationHooks, boolean>>
  validationMode?: 'eager' | 'lazy'
}

export type FieldProps<TValue> = {
  handler: Field<TValue>
}

export type FieldSlots<TValue> = {
  default?: (props: { field: Field<TValue> }) => void
}

export type ValidationHooks = 'onBlur' | 'onChange' | 'onInput' | 'onMount'
