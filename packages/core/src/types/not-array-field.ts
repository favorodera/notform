import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFormAPI } from './not-form-api'
import type { InferInput, Issue, ObjectSchema, Paths } from './shared'

/**
 * One array item from `<NotArrayField>`'s default slot.
 * @template TSchema The form schema.
 */
export interface NotArrayFieldItem<TSchema extends ObjectSchema> {
  /** Stable identity for `v-for` `:key`. Independent of the current index. */
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

  /**
   * Item schema for type inference only; never read at runtime. Does not
   * validate items — array items are still validated through the form's
   * own schema, the same as any other field.
   */
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

    /**
     * Issues reported exactly at the array field's own path — not issues
     * from individual items. The same exact-match behavior as `<NotField>`'s
     * `errors`. See {@link isValid} for the aggregate that also accounts
     * for item-level issues.
     */
    errors: Array<Issue>

    /**
     * Whether the array field's own path, and every path nested underneath
     * it, have no issues — an item's own value, a field inside an object
     * item, or an item inside a nested array, at any depth. Unlike
     * {@link errors}, this recurses.
     */
    isValid: boolean

    /**
     * Whether the array field's own path, or any path nested underneath it,
     * has been touched. Recurses the same way as {@link isValid}.
     */
    isTouched: boolean

    /**
     * Whether the array field's own path, or any path nested underneath it,
     * differs from the baseline. Recurses the same way as {@link isValid}.
     */
    isDirty: boolean

    /**
     * Whether the array field's own path, or any path nested underneath it,
     * is currently validating. Recurses the same way as {@link isValid}.
     */
    isValidating: boolean

    /**
     * Appends a value at the end.
     * @param value Value to append.
     */
    append: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts a value at the start. Shifts every existing item's own
     * state — at any depth underneath it — forward by one position along
     * with it.
     * @param value Value to prepend.
     */
    prepend: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts a value at `index`, shifting later items — and their own
     * state, at any depth underneath them — back by one position.
     * @param index Insertion index.
     * @param value Value to insert.
     */
    insert: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Removes the item at `index`. That item's own state — at any depth
     * underneath it — is discarded along with it; every later item's state
     * shifts back by one position to follow it to its new index.
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
     * Swaps two items, moving keys and form state — at any depth
     * underneath each item — with them.
     * @param indexA First index.
     * @param indexB Second index.
     */
    swap: (indexA: number, indexB: number) => void

    /**
     * Moves an item from `from` to `to`, moving keys and form state — at
     * any depth underneath it — with it.
     * @param from Current index.
     * @param to Destination index.
     */
    move: (from: number, to: number) => void
  }) => void
}