import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { InferInput, Issue, ObjectSchema, Path } from './shared'
import type { UseFormReturn } from './use-form'

/**
 * Array item metadata exposed by `<ArrayField>`.
 * @template TSchema Schema that defines the array path.
 */
export interface ArrayFieldItem<TSchema extends ObjectSchema> {
  /** Zero-based index in the current array. */
  index: number

  /** Stable key used by Vue to track this item. */
  key: string

  /** Form path for the current item. */
  path: Path<TSchema>
}

/**
 * Props accepted by `<ArrayField>`.
 * @template TSchema Schema that owns the array.
 * @template TItemSchema Schema used to infer inserted item values.
 */
export interface ArrayFieldProps<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
> {
  /** Explicit form instance; otherwise the nearest `<Form>` is used. */
  form?: UseFormReturn<TSchema>

  /** Schema used to type inserted and updated values. */
  itemSchema?: TItemSchema

  /** Path to the array in the form values. */
  path: Path<TSchema>
}

/**
 * State and actions exposed by `<ArrayField>`'s default slot.
 * @template TSchema Schema that owns the array.
 * @template TItemSchema Schema used to infer inserted item values.
 */
export interface ArrayFieldSlots<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
> {
  /**
   * Renders the array state and its mutation methods.
   * @param props Array state and actions for the configured field.
   * @param props.append Appends a new item to the array.
   * @param props.errors Issues attached directly to the array path.
   * @param props.insert Inserts an item at the requested index.
   * @param props.isDirty Whether the array differs from its reset baseline.
   * @param props.isTouched Whether the array or a nested item is touched.
   * @param props.isValid Whether the array subtree has no current issues.
   * @param props.isValidating Whether validation overlaps the array path.
   * @param props.items Current items with stable keys and field paths.
   * @param props.move Moves an item to another array index.
   * @param props.path Configured array path.
   * @param props.prepend Adds an item at the start of the array.
   * @param props.remove Removes an item by index.
   * @param props.swap Swaps two array items.
   * @param props.update Replaces an item without changing its key.
   * @returns Nothing; Vue renders the slot template.
   */
  default?: (props: {
    /**
     * Appends an item.
     * @param value Item value to append.
     */
    append: (value: InferInput<TItemSchema>) => void

    /** Issues attached directly to the array path. */
    errors: Array<Issue>

    /**
     * Inserts an item at a clamped index.
     * @param index Requested insertion index.
     * @param value Item value to insert.
     */
    insert: (index: number, value: InferInput<TItemSchema>) => void

    /** Whether the array differs from its reset baseline. */
    isDirty: boolean

    /** Whether the array or a nested item has been touched. */
    isTouched: boolean

    /** Whether the array subtree has no current issues. */
    isValid: boolean

    /** Whether validation overlaps the array path. */
    isValidating: boolean

    /** Current items with stable render keys and field paths. */
    items: Array<ArrayFieldItem<TSchema>>

    /**
     * Moves an item between indices.
     * @param from Existing item index.
     * @param to Destination index.
     */
    move: (from: number, to: number) => void

    /** Configured array path. */
    path: string

    /**
     * Prepends an item.
     * @param value Item value to prepend.
     */
    prepend: (value: InferInput<TItemSchema>) => void

    /**
     * Removes an item by index.
     * @param index Existing item index.
     */
    remove: (index: number) => void

    /**
     * Swaps two items.
     * @param indexA First item index.
     * @param indexB Second item index.
     */
    swap: (indexA: number, indexB: number) => void

    /**
     * Replaces an item without changing its key.
     * @param index Existing item index.
     * @param value Replacement item value.
     */
    update: (index: number, value: InferInput<TItemSchema>) => void
  }) => void
}
