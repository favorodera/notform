import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema, ValidationTrigger } from './shared'
import type { NotFormInstance } from './not-form'


// PROPS


/** Props for the `NotArrayField` component. */
export type NotArrayFieldProps<TItemSchema extends StandardSchemaV1 = StandardSchemaV1> = {
  /** Dot-separated path to the array within the form values. */
  path: string

  /**
   * Schema for a single array item — used purely for type inference.
   * Enables typed `append`, `prepend`, `insert`, and `update` methods in the slot.
   *
   * ```vue
   * <NotArrayField path="tags" :item-schema="z.string()">
   *   <!-- append now expects a string -->
   * </NotArrayField>
   * ```
   */
  itemSchema?: TItemSchema

  /**
   * Explicit form instance override.
   * Takes priority over the instance provided by a `NotForm` ancestor.
   * Required when using `NotArrayField` outside of a `NotForm`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: NotFormInstance<any>

  /**
   * Per-field validation trigger overrides applied to the array as a whole.
   * Merged over the form-wide `validateOn` — only the keys you specify are overridden.
   */
  validateOn?: Partial<Record<Extract<ValidationTrigger, 'onMount' | 'onChange'>, boolean>>
}


// ITEM


/**
 * Represents a single item in the array field.
 * Use `key` for `v-for` tracking and `path` to pass to a nested `NotField`.
 *
 * ```vue
 * <NotArrayField path="tags" v-slot="{ items }">
 *   <NotField v-for="item in items" :key="item.key" :path="item.path" v-slot="{ events }">
 *     <input v-model="form.values.tags[item.index]" v-bind="events" />
 *   </NotField>
 * </NotArrayField>
 * ```
 */
export type NotArrayFieldItem = {
  /** Stable key for `v-for` — does not change when items are reordered. */
  key: string
  /** Current index of this item in the array. */
  index: number
  /** Full dot-separated path to this item — pass directly to `NotField`. */
  path: string
}


// SLOT PROPS


/**
 * Everything available inside the `NotArrayField` default slot.
 * @template TSchema The form schema type.
 * @template TItem The inferred type of a single array item.
 */
export type NotArrayFieldSlotProps<
  TSchema extends ObjectSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem = any,
> = {
  /** The dot-separated path to this array field. */
  path: string

  /** The array items with stable keys and paths for use with `v-for`. */
  items: NotArrayFieldItem[]

  /** The current length of the array. */
  length: number

  /** All validation issues for this array field from the last validation run. */
  errors: StandardSchemaV1.Issue[]

  /** Whether this array field currently has no validation errors. */
  isValid: boolean

  /**
   * Whether any item in this array has been touched.
   * Derived from the form's `touchedFields` set.
   */
  isTouched: boolean

  /**
   * Whether any item in this array differs from its initial value.
   * Derived from the form's `dirtyFields` set.
   */
  isDirty: boolean

  /** Whether validation is currently running for this array field. */
  isValidating: boolean

  /**
   * Manually triggers validation for this array field.
   * Useful when mutations are performed programmatically outside of the normal flow.
   */
  validate: () => ReturnType<NotFormInstance<TSchema>['validateField']>

  /**
   * Appends a new item to the end of the array.
   * @param value The value to append.
   */
  append: (value: TItem) => void

  /**
   * Prepends a new item to the beginning of the array.
   * @param value The value to prepend.
   */
  prepend: (value: TItem) => void

  /**
   * Removes the item at the given index.
   * @param index The index of the item to remove.
   */
  remove: (index: number) => void

  /**
   * Inserts a new item at the given index, shifting subsequent items forward.
   * @param index The index to insert the item at.
   * @param value The value to insert.
   */
  insert: (index: number, value: TItem) => void

  /**
   * Replaces the value at the given index.
   * @param index The index of the item to replace.
   * @param value The value to replace with.
   */
  update: (index: number, value: TItem) => void

  /**
   * Swaps the positions of two items in the array.
   * @param indexA The index of the first item.
   * @param indexB The index of the second item.
   */
  swap: (indexA: number, indexB: number) => void

  /**
   * Moves an item from one index to another, shifting items between them.
   * @param from The current index of the item.
   * @param to The target index.
   */
  move: (from: number, to: number) => void
}


// SLOTS


/**
 * Slots for the `NotArrayField` component.
 * @template TSchema The form schema type.
 * @template TItem The inferred type of a single array item.
 */
export type NotArrayFieldSlots<
  TSchema extends ObjectSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem = any,
> = {
  /** The default slot receives the full array state and manipulation methods. */
  default: (props: NotArrayFieldSlotProps<TSchema, TItem>) => []
}
