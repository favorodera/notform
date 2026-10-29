import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Input, Issue, Path } from './schema'

export type ArrayFieldItem<TSchema extends StandardSchemaV1> = {
  index: number
  key: string
  path: Path<TSchema>
}

// export type ArrayFieldProps<TSchema extends StandardSchemaV1> = {}

export interface ArrayFieldSlots<TSchema extends StandardSchemaV1> {
  default?: (props: {
    append: (value: Input<TSchema>) => void
    errors: Issue[]
    insert: (index: number, value: Input<TSchema>) => void
    isDirty: boolean
    isTouched: boolean
    isValid: boolean
    isValidating: boolean
    items: ArrayFieldItem<TSchema>[]
    move: (from: number, to: number) => void
    path: string
    prepend: (value: Input<TSchema>) => void
    remove: (index: number) => void
    swap: (indexA: number, indexB: number) => void
    update: (index: number, value: Input<TSchema>) => void
  }) => void
}
