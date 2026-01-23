import type { VNodeChild } from 'vue'
import type { ArraySchema } from './shared'
import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Properties accepted by the ArrayField component.
 * @template TSchema The schema of the array field.
 */
export type ArrayFieldProps<TSchema extends ArraySchema> = {
  /** The unique name/path identifying the array field in the form state */
  name: string
  /** The specific schema instance used to validate the array items */
  schema: TSchema
}

/**
 * The core state and methods provided by an ArrayField instance.
 * @template TSchema The schema of the array field.
 */
export type ArrayFieldContext<TSchema extends ArraySchema> = {
  /**
   * Array of individual field contexts for each item in the collection.
   * Useful for mapping components to array elements.
   */
  fields: Array<{
    /** A unique identifier for the field (defaults to index) */
    key: string | number
    /** The 0-based position of the field within the array */
    index: number
    /** The current value of the field at this index */
    value: StandardSchemaV1.InferInput<TSchema>[number]
    /** True if this is first item in the collection */
    first: boolean
    /** True if this is the last item in the collection */
    last: boolean
  }>
  /** Adds a new item to the end of the collection */
  append: (data: StandardSchemaV1.InferInput<TSchema>[number]) => void
  /** Adds a new item to the end of the collection (alias for append) */
  push: (data: StandardSchemaV1.InferInput<TSchema>[number]) => void
  /** Adds a new item to the beginning of the collection */
  prepend: (data: StandardSchemaV1.InferInput<TSchema>[number]) => void
  /**
   * Removes the item at the specified index.
   * @param index The index to remove.
   */
  remove: (index: number) => void
  /**
   * Inserts a new item at a specific position.
   * @param index The insertion index.
   * @param data Initial data for the new item.
   */
  insert: (index: number, data: StandardSchemaV1.InferInput<TSchema>[number]) => void
  /**
   * Replaces data at a specific index.
   * @param index The target index.
   * @param data New data to apply.
   */
  update: (index: number, data: StandardSchemaV1.InferInput<TSchema>[number]) => void
}

/**
 * Slots provided by the ArrayField component.
 * @template TSchema The schema of the array field.
 */
export type ArrayFieldSlots<TSchema extends ArraySchema> = {
  /** The default slot receives the array field context as its scope */
  default: (props: ArrayFieldContext<TSchema>) => VNodeChild
}
