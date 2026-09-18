import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotFormAPI } from './not-form-api'
import type { InferInput, Issue, ObjectSchema, Paths } from './shared'

/**
 * A single array item exposed by `NotArrayField`'s default slot.
 * @template TSchema The validation schema.
 */
export interface NotArrayFieldItem<TSchema extends ObjectSchema> {
  /**
   * Stable identity for this item, independent of its current position.
   * 
   * Survives reorders, insertions, and removals — use it as the `:key`
   * on the surrounding `v-for` so Vue moves DOM nodes instead of
   * destroying and recreating them.
   */
  key: string

  /** Dot-notated path to this item, reflecting its CURRENT index. */
  path: Paths<TSchema>

  /** This item's current position in the array. */
  index: number
}

/**
 * Props accepted by the `NotArrayField` component.
 * @template TSchema The validation schema.
 * @template TItemSchema Schema for a single array item. Never read or
 * validated against at runtime — declared purely so the item type can
 * be inferred for the array-mutation helpers.
 */
export interface NotArrayFieldProps<TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1> {
  /** Dot-notated path to the array field. */
  path: Paths<TSchema>

  /**
   * Schema for a single array item. Used only for type inference —
   * never read or validated against at runtime.
   */
  itemSchema?: TItemSchema

  /**
   * Explicit form instance.
   *
   * Takes priority over the instance provided by an ancestor `<NotForm>`.
   * Required when using `<NotArrayField>` outside of `<NotForm>`.
   */
  form?: NotFormAPI<TSchema>
}

/** Slot definitions for the `NotArrayField` component. */
export interface NotArrayFieldSlots<TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1> {
  /** The default slot receives the current items and array-mutation helpers. */
  default?: (props: {
    /** Dot-notated path to the array field itself. */
    path: string

    /** Current items, in order, each with a stable key and current path. */
    items: Array<NotArrayFieldItem<TSchema>>

    /** Issues on the array field itself (e.g. min/max item count), plus every item's own issues. */
    errors: Array<Issue>

    /** Whether the array field and every item have zero validation issues. */
    isValid: boolean

    /** Whether at least one item has been interacted with. */
    isTouched: boolean

    /** Whether at least one item's value differs from its initial value. */
    isDirty: boolean

    /** Whether at least one item is currently being validated. */
    isValidating: boolean

    /**
     * Appends a value to the end of the array.
     * @param value The value to append.
     */
    append: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts a value at the start of the array.
     * @param value The value to prepend.
     */
    prepend: (value: InferInput<TItemSchema>) => void

    /**
     * Inserts a value at a specific index, shifting later items back.
     * @param index Index to insert at.
     * @param value The value to insert.
     */
    insert: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Removes the item at the given index.
     * @param index Index of the item to remove.
     */
    remove: (index: number) => void

    /**
     * Replaces the value at a given index in place. The item's key is
     * preserved — this changes a value, not a position.
     * @param index Index of the item to update.
     * @param value The new value.
     */
    update: (index: number, value: InferInput<TItemSchema>) => void

    /**
     * Swaps the positions of two items. Keys move WITH their values, so
     * the corresponding DOM nodes (and their focus/animation state) move
     * with them instead of being destroyed and recreated.
     * @param indexA First index.
     * @param indexB Second index.
     */
    swap: (indexA: number, indexB: number) => void

    /**
     * Moves an item from one index to another, shifting items in between.
     * @param from Current index of the item.
     * @param to Destination index.
     */
    move: (from: number, to: number) => void
  }) => void
}