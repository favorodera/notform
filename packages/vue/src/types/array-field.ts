import type { FieldInstance } from './field'
import type { ValidationIssue } from './validation'

export interface ArrayFieldInstance<TItem> {
  append: (value: TItem) => void
  errors: ValidationIssue[]
  id: symbol
  insert: (index: number, value: TItem) => void
  isDirty: boolean
  isTouched: boolean
  isValid: boolean
  isValidating: boolean
  items: FieldInstance<TItem>
  move: (from: number, to: number) => void
  path: string
  prepend: (value: TItem) => void
  remove: (index: number) => void
  swap: (indexA: number, indexB: number) => void
  update: (index: number, value: TItem) => void
}

export type ArrayFieldProps<TItem> = {
  arrayField: ArrayFieldInstance<TItem>
}

export type ArrayFieldSlots<TItem> = {
  default?: (props: { arrayField: ArrayFieldInstance<TItem> }) => void
}
