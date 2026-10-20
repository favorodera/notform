import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { InferInput, Issue, ObjectSchema, Path } from './shared'
import type { UseFormReturn } from './use-form'

/** One array item from `<ArrayField>`'s default slot. */
export interface ArrayFieldItem<TSchema extends ObjectSchema> {
  index: number
  key: string
  path: Path<TSchema>
}

/** Props for `<ArrayField>`. */
export interface ArrayFieldProps<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
> {
  form?: UseFormReturn<TSchema>
  itemSchema?: TItemSchema
  path: Path<TSchema>
}

/** Slot props for `<ArrayField>`. */
export interface ArrayFieldSlots<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
> {
  default?: (props: {
    append: (value: InferInput<TItemSchema>) => void
    errors: Array<Issue>
    insert: (index: number, value: InferInput<TItemSchema>) => void
    isDirty: boolean
    isTouched: boolean
    isValid: boolean
    isValidating: boolean
    items: Array<ArrayFieldItem<TSchema>>
    move: (from: number, to: number) => void
    path: string
    prepend: (value: InferInput<TItemSchema>) => void
    remove: (index: number) => void
    swap: (indexA: number, indexB: number) => void
    update: (index: number, value: InferInput<TItemSchema>) => void
  }) => void
}
