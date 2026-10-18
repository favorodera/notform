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

    /** Items with stable keys and paths for their current indices. */
    items: Array<NotArrayFieldItem<TSchema>>

    /** Issues reported at the array path only; see {@linkcode isValid} for descendants. */
    errors: Array<Issue>

    /** Whether the array path and all descendants have no issues. */
    isValid: boolean

    /** Whether the array path or a descendant has been touched. */
    isTouched: boolean

    /** Whether the array path or a descendant differs from baseline. */
    isDirty: boolean

    /** Whether the array path or a descendant is validating. */
    isValidating: boolean

    /**
     * Appends a value and assigns it a new key.
     * @param value Item to append.
     */
    append: (value: InferInput<TItemSchema>) => void

    /**
     * Prepends a value and shifts existing item state.
     * @param value Item to prepend.
     */
    prepend: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts at a clamped index and shifts later item state.
     * @param index Insertion index.
     * @param value Item to insert.
     */
    insert: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Removes an item and its state; later items shift back.
     * @param index Index to remove.
     */
    remove: (index: number) => void

    /**
     * Replaces an item without changing its key.
     * @param index Index to update.
     * @param value Replacement item.
     */
    update: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Swaps items, keys, and nested state.
     * @param indexA First index.
     * @param indexB Second index.
     */
    swap: (indexA: number, indexB: number) => void

    /**
     * Moves an item and its state; clamps the destination.
     * @param from Current index.
     * @param to Destination index.
     */
    move: (from: number, to: number) => void
  }) => void
}
