import type { ValidationIssue } from './validation'

/** One row of an array field. */
export type ArrayFieldItem = {
  /** Zero-based position of the item in the array. */
  index: number

  /** Stable identifier for rendering (use as the `v-for` key). */
  key: string

  /** Dot-notation path to this item, e.g. `'tags.2'`. */
  path: string
}

/**
 * Slots of the planned `<ArrayField>` component.
 * @template TItem - Type of ONE item in the array (not the whole array).
 * @remarks Not implemented yet: `<ArrayField>` is not exported from `index.ts`.
 * @todo Add an `ArrayFieldProps` type together with the component.
 * @todo `isTouched` needs touched-state tracking, which the form does not have yet.
 */
export interface ArrayFieldSlots<TItem> {
  default?: (props: {
    /** Adds an item to the end of the array. */
    append: (value: TItem) => void

    /** Errors belonging to this array. */
    errors: ValidationIssue[]

    /** Inserts an item at `index`, shifting later items down. */
    insert: (index: number, value: TItem) => void

    /** `true` when the array differs from its initial value. */
    isDirty: boolean

    /** `true` once the user has interacted with the array. */
    isTouched: boolean

    /** `true` when the array has no errors. */
    isValid: boolean

    /** `true` while the array is being validated. */
    isValidating: boolean

    /** The current rows, ready for `v-for`. */
    items: ArrayFieldItem[]

    /** Moves the item at `from` to position `to`. */
    move: (from: number, to: number) => void

    /** Dot-notation path of the array itself. */
    path: string

    /** Adds an item to the start of the array. */
    prepend: (value: TItem) => void

    /** Removes the item at `index`. */
    remove: (index: number) => void

    /** Swaps the items at the two positions. */
    swap: (indexA: number, indexB: number) => void

    /** Replaces the item at `index` with `value`. */
    update: (index: number, value: TItem) => void
  }) => void
}
