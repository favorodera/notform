import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFormAPI } from './not-form-api'
import type { InferInput, Issue, ObjectSchema, Paths } from './shared'

/**
 * One array item from `<NotArrayField>`'s default slot.
 * @template TSchema The form schema.
 */
export interface NotArrayFieldItem<TSchema extends ObjectSchema> {
  /**
   * Stable identity for `v-for` `:key`. Independent of the current index.
   */
  key: string

  /** Dot path of this item at its **current** index. */
  path: Paths<TSchema>

  /** Current position in the array. */
  index: number
}

/**
 * Props for `<NotArrayField>`.
 * @template TSchema The form schema.
 * @template TItemSchema Item schema used only to type mutation helpers.
 */
export interface NotArrayFieldProps<TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1> {
  /** Dot path of the array field. */
  path: Paths<TSchema>

  /** Item schema for type inference only; never read at runtime. */
  itemSchema?: TItemSchema

  /** Form instance. Overrides `<NotForm>` inject. Required outside `<NotForm>`. */
  form?: NotFormAPI<TSchema>
}

/**
 * Slot props for `<NotArrayField>`.
 * @template TSchema The form schema.
 * @template TItemSchema Item schema used only to type mutation helpers.
 */
export interface NotArrayFieldSlots<TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1> {
  default?: (props: {
    /** Dot path of the array field. */
    path: string

    /** Current items, each with a stable key and current path. */
    items: Array<NotArrayFieldItem<TSchema>>

    /** Issues for this field path. */
    errors: Array<Issue>

    /** Whether the array field and all item fields has no issues. */
    isValid: boolean

    /** Whether the user has interacted with any item field. */
    isTouched: boolean

    /** Whether the value of any item field differs from the baseline. */
    isDirty: boolean

    /** Whether any item field is currently validating. */
    isValidating: boolean

    /**
     * Appends a value at the end.
     * @param value Value to append.
     */
    append: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts a value at the start.
     * @param value Value to prepend.
     */
    prepend: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts a value at `index`, shifting later items back.
     * @param index Insertion index.
     * @param value Value to insert.
     */
    insert: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Removes the item at `index`.
     * @param index Index to remove.
     */
    remove: (index: number) => void

    /**
     * Replaces the value at `index` without changing its key.
     * @param index Index to update.
     * @param value New value.
     */
    update: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Swaps two items, moving keys and form state with them.
     * @param indexA First index.
     * @param indexB Second index.
     */
    swap: (indexA: number, indexB: number) => void

    /**
     * Moves an item from `from` to `to`.
     * @param from Current index.
     * @param to Destination index.
     */
    move: (from: number, to: number) => void
  }) => void
}
