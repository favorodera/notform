import type { FieldConfig, FieldInstance } from './field'
import type { ArrayItem, ValueArrayPath, ValuePath, ValuePathValue } from './path'

/**
 * A field for an array: the usual field state for the array itself (`errors` are
 * array-level issues such as "at least one item"), plus the list of items and
 * the mutations to change it.
 *
 * Mutate through this object (not `values.list.push()`) so items keep their identity,
 * touched state and errors. Inserted values are deep-cloned.
 * @template TItem - Type of one array item.
 */
export type ArrayFieldInstance<TItem> = FieldInstance<TItem[]> & {
  /**
   * Adds an item at the end.
   * @param value The new item.
   */
  append: (value: TItem) => void

  /**
   * Adds an item at `index`; later items shift up.
   * @param index Where to insert. Clamped into `0..length`.
   * @param value The new item.
   */
  insert: (index: number, value: TItem) => void

  /** One entry per array item, in order. Use `item.id` as the `v-for` key. */
  items: ArrayItemInstance<TItem>[]

  /**
   * Moves an item to another position. Ignored if an index is out of range.
   * @param from Current index of the item.
   * @param to Index it should end up at.
   */
  move: (from: number, to: number) => void

  /**
   * Adds an item at the start.
   * @param value The new item.
   */
  prepend: (value: TItem) => void

  /**
   * Removes an item. Ignored if `index` is out of range.
   * @param index Index of the item.
   */
  remove: (index: number) => void

  /**
   * Swaps two items. Ignored if an index is out of range.
   * @param indexA Index of the first item.
   * @param indexB Index of the second item.
   */
  swap: (indexA: number, indexB: number) => void

  /**
   * Replaces an item in place. The item keeps its id and touched state; its old errors are dropped.
   * Ignored if `index` is out of range.
   * @param index Index of the item.
   * @param value The new value.
   */
  update: (index: number, value: TItem) => void
}

/**
 * Props of the `<ArrayField>` component.
 * @template TItem - Type of one array item.
 */
export type ArrayFieldProps<TItem> = {
  /** The array field created by `form.arrayField('some.path')`. */
  arrayField: ArrayFieldInstance<TItem>
}

/**
 * Slots of the `<ArrayField>` component.
 * @template TItem - Type of one array item.
 */
export type ArrayFieldSlots<TItem> = {
  /** Receives the `arrayField`. Extra attributes set on `<ArrayField>` arrive as additional slot props. */
  default?: (props: { arrayField: ArrayFieldInstance<TItem> }) => void
}

/**
 * One item of an array field. It is a regular field for the item's value (pass it
 * straight to `<Field>`), plus its position and shortcuts to change it.
 *
 * Its `id` never changes; `index` and `path` follow the item when the array is reordered.
 * @template TItem - Type of the item.
 */
export type ArrayItemInstance<TItem> = FieldInstance<TItem> & {
  /**
   * Creates an array field nested in this item (e.g. a `tags` list inside a contact).
   * Cached per path; follows the item when it moves.
   * @param path Path relative to the item, e.g. `'tags'`.
   * @param config Optional per-field behavior.
   * @returns The nested array field.
   */
  arrayField: <TPath extends ValueArrayPath<TItem>>(path: TPath, config?: FieldConfig) => ArrayFieldInstance<ArrayItem<ValuePathValue<TItem, TPath>>>

  /**
   * Creates a field nested in this item (e.g. `'email'` inside a contact).
   * Cached per path; follows the item when it moves.
   * @param path Path relative to the item, e.g. `'email'`.
   * @param config Optional per-field behavior.
   * @returns The nested field.
   */
  field: <TPath extends ValuePath<TItem>>(path: TPath, config?: FieldConfig) => FieldInstance<ValuePathValue<TItem, TPath>>

  /** Current position in the array. */
  index: number
}
