import type { StandardSchemaV1 } from '@standard-schema/spec'
import { getProperty, setProperty } from 'dot-prop'
import { computed, reactive, ref, watch } from 'vue'
import type { NotArrayFieldItem, NotArrayFieldProps, NotArrayFieldSlots } from '../types/not-array-field'
import type { InferInput, ObjectSchema, Paths } from '../types/shared'
import { remapArrayFieldState } from '../utils/array-field'
import { useNotFormInstance } from './use-not-form-instance'

/**
 * Array-field state, stable item keys, and mutation helpers for `<NotArrayField>`.
 *
 * `itemKeys` is the only source of `item.key`. Length-only external changes
 * pad or trim keys from the end; use the mutation helpers to keep identity
 * through insert, remove, swap, and move.
 * @template TSchema The form schema.
 * @template TItemSchema Schema used only to type mutation values.
 * @internal
 * @param props Array field path, optional form, and optional item schema.
 * @returns Slot state for `<NotArrayField>`.
 */
export function useNotArrayField<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
>(props: NotArrayFieldProps<TSchema, TItemSchema>): Parameters<NonNullable<NotArrayFieldSlots<TSchema, TItemSchema>['default']>>[0] {
  // #region Setup

  const form = useNotFormInstance<TSchema>(props.form)

  // #endregion

  // #region State

  /** Monotonic id used by {@link createItemKey}. */
  let nextItemKeyId = 0

  /** Stable identity per current array index; mutated in lockstep with values. */
  const itemKeys = ref<Array<string>>([])

  /** Live array at `props.path`, or `[]` when the path is missing or not an array. */
  const arrayValue = computed<Array<unknown>>(() => {
    const value = getProperty(form.values, props.path)
    return Array.isArray(value) ? value : []
  })

  /** Slot items: current index, stored key, and index-based path. */
  const items = computed<Array<NotArrayFieldItem<TSchema>>>(() => arrayValue.value.map((_, index) => ({
    index,
    key: itemKeys.value[index] ?? '',
    path: `${props.path}.${index}` as Paths<TSchema>,
  })))

  const errors = computed(() => form.getFieldErrors(props.path))

  const itemsErrors = computed(() => items.value.flatMap(item => form.getFieldErrors(item.path)))

  const isValid = computed(() => errors.value.length === 0 && itemsErrors.value.length === 0)

  const isTouched = computed(() => {
    return form.touchedFields.has(props.path) || items.value.some(item => form.touchedFields.has(item.path))
  })

  const isDirty = computed(() => {
    return form.dirtyFields.has(props.path) || items.value.some(item => form.dirtyFields.has(item.path))
  })

  const isValidating = computed(() => {
    return form.validatingFields.has(props.path) || items.value.some(item => form.validatingFields.has(item.path))
  })

  // #endregion

  // #region Item keys

  /**
   * Allocates a unique key for one array item.
   * @returns A key that never repeats in this field instance.
   */
  function createItemKey() {
    return `notform-array-item-${nextItemKeyId++}`
  }

  /**
   * Pads or trims `itemKeys` from the end so it matches `targetLength`.
   * @param targetLength Desired key count.
   */
  function syncItemKeysToLength(targetLength: number) {
    while (itemKeys.value.length < targetLength) {
      itemKeys.value.push(createItemKey())
    }

    if (itemKeys.value.length > targetLength) {
      itemKeys.value.length = targetLength
    }
  }

  // #endregion

  // #region Array access

  /**
   * Returns the mutable array at `props.path`, creating an empty array if needed.
   * @returns The live array stored on the form.
   */
  function getOrCreateArrayValue(): Array<unknown> {
    const existingArray = getProperty(form.values, props.path)

    if (Array.isArray(existingArray)) {
      return existingArray
    }

    const createdArray: Array<unknown> = []
    setProperty(form.values, props.path, createdArray)
    return createdArray
  }

  /**
   * Moves one element inside `target` from `fromIndex` to `toIndex`.
   * @template TItem Element type.
   * @param target Array to mutate in place.
   * @param fromIndex Index of the element to move.
   * @param toIndex Destination index, clamped to the array bounds.
   */
  function moveArrayItem<TItem>(target: Array<TItem>, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || fromIndex >= target.length) {
      return
    }

    const clampedToIndex = Math.max(0, Math.min(toIndex, target.length - 1))
    const [movedItem] = target.splice(fromIndex, 1)
    target.splice(clampedToIndex, 0, movedItem)
  }

  // #endregion

  // #region Mutations

  /**
   * Appends `value` and a new key at the end of the array.
   * @param value Item to append.
   */
  function append(value: InferInput<TItemSchema>) {
    getOrCreateArrayValue().push(value)
    itemKeys.value.push(createItemKey())
  }

  /**
   * Inserts `value` at the start and remaps later item state up by one.
   * @param value Item to prepend.
   */
  function prepend(value: InferInput<TItemSchema>) {
    getOrCreateArrayValue().unshift(value)
    itemKeys.value.unshift(createItemKey())
    remapArrayFieldState(form, props.path, previousIndex => previousIndex + 1)
  }

  /**
   * Inserts `value` at `index` and remaps later item state up by one.
   * @param index Insertion index.
   * @param value Item to insert.
   */
  function insert(index: number, value: InferInput<TItemSchema>) {
    getOrCreateArrayValue().splice(index, 0, value)
    itemKeys.value.splice(index, 0, createItemKey())
    remapArrayFieldState(form, props.path, previousIndex => (
      previousIndex >= index ? previousIndex + 1 : previousIndex
    ))
  }

  /**
   * Removes the item at `index` and remaps later item state down by one.
   * @param index Index to remove.
   */
  function remove(index: number) {
    getOrCreateArrayValue().splice(index, 1)
    itemKeys.value.splice(index, 1)

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === index) {
        return
      }

      return previousIndex > index ? previousIndex - 1 : previousIndex
    })
  }

  /**
   * Replaces the value at `index` without changing its key.
   * @param index Index to update.
   * @param value New item value.
   */
  function update(index: number, value: InferInput<TItemSchema>) {
    getOrCreateArrayValue()[index] = value
  }

  /**
   * Swaps two items, moving keys and form state with them.
   * @param indexA First index.
   * @param indexB Second index.
   */
  function swap(indexA: number, indexB: number) {
    const array = getOrCreateArrayValue();

    // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
    [array[indexA], array[indexB]] = [array[indexB], array[indexA]];

    // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
    [itemKeys.value[indexA], itemKeys.value[indexB]] = [itemKeys.value[indexB], itemKeys.value[indexA]]

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === indexA) {
        return indexB
      }

      if (previousIndex === indexB) {
        return indexA
      }

      return previousIndex
    })
  }

  /**
   * Moves one item to `toIndex`, shifting neighbors and remapping form state.
   * @param fromIndex Current index.
   * @param toIndex Destination index.
   */
  function move(fromIndex: number, toIndex: number) {
    moveArrayItem(getOrCreateArrayValue(), fromIndex, toIndex)
    moveArrayItem(itemKeys.value, fromIndex, toIndex)

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === fromIndex) {
        return toIndex
      }

      if (fromIndex < toIndex) {
        return previousIndex > fromIndex && previousIndex <= toIndex
          ? previousIndex - 1
          : previousIndex
      }

      return previousIndex >= toIndex && previousIndex < fromIndex
        ? previousIndex + 1
        : previousIndex
    })
  }

  // #endregion

  // #region External length sync

  watch(
    () => arrayValue.value.length,
    (arrayLength) => {
      if (itemKeys.value.length === arrayLength) {
        return
      }

      syncItemKeysToLength(arrayLength)
    },
    { immediate: true },
  )

  // #endregion

  return reactive({
    append,
    errors,
    insert,
    isDirty,
    isTouched,
    isValid,
    isValidating,
    items,
    move,
    path: computed(() => props.path),
    prepend,
    remove,
    swap,
    update,
  })
}
