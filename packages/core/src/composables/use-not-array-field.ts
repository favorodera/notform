import type { StandardSchemaV1 } from '@standard-schema/spec'
import { getProperty, parsePath, setProperty } from 'dot-prop'
import { computed, reactive, ref, watch } from 'vue'
import type { NotArrayFieldItem, NotArrayFieldProps, NotArrayFieldSlots } from '../types/not-array-field'
import type { InferInput, ObjectSchema, Paths } from '../types/shared'
import { normalizeExistingIndex, normalizeInsertionIndex, normalizeMoveDestination, remapArrayFieldState } from '../utils/array-field'
import { isPathWithinScope } from '../utils/segments'
import { useNotFormInstance } from './use-not-form-instance'

/**
 * Provides state and mutation helpers for `<NotArrayField>`.
 *
 * Mutation helpers preserve item identity and move nested form state with
 * each item. External length-only changes can only add or remove keys at the end.
 * Aggregate status includes every descendant path; `errors` includes only
 * issues reported at the array field's exact path.
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

  /** Full instance resolved from the explicit prop or `<NotForm>`. */
  const form = useNotFormInstance<TSchema>(props.form)

  // #endregion

  // #region State

  /** Monotonic id used by {@linkcode createItemKey}. */
  let nextItemKeyId = 0

  /** Stable identity per current array index; mutated in lockstep with values. */
  const itemKeys = ref<Array<string>>([])

  /** Live array at `props.path`, or `[]` when the path is missing or not an array. */
  const arrayValue = computed<Array<unknown>>(() => {
    const value = getProperty(form.values, props.path)
    // Keep rendering safe when the path is absent or has a non-array value.
    return Array.isArray(value) ? value : []
  })

  /** Slot items: current index, stored key, and index-based path. */
  const items = computed<Array<NotArrayFieldItem<TSchema>>>(() => arrayValue.value.map((_, index) => ({
    index,
    // `?? ''` guards a brief render where `arrayValue` has already grown but
    // the `watch` below hasn't synced `itemKeys` to match yet.
    key: itemKeys.value[index] ?? '',
    path: `${props.path}.${index}` as Paths<TSchema>,
  })))

  /** `props.path`, pre-split into segments, for the scope checks below. */
  const arrayPathSegments = computed(() => parsePath(props.path))

  /** Issues reported exactly at this array field's own path — never issues from items. */
  const errors = computed(() => form.getFieldErrors(props.path))

  /** Whether the array path and all descendant paths have no issues. */
  const isValid = computed(() => {
    // Pathless issues belong to the form as a whole, not this field.
    return form.errors.every(issue => issue.path === undefined || !isPathWithinScope(issue.path, arrayPathSegments.value))
  })

  /** Whether the array field's own path, or any path nested under it, has been touched. */
  const isTouched = computed(() => {
    return [...form.touchedFields].some(touchedPath => isPathWithinScope(parsePath(touchedPath), arrayPathSegments.value))
  })

  /** Whether the array field's own path, or any path nested under it, differs from the baseline. */
  const isDirty = computed(() => {
    return [...form.dirtyFields].some(dirtyPath => isPathWithinScope(parsePath(dirtyPath), arrayPathSegments.value))
  })

  /** Whether the array field's own path, or any path nested under it, is currently validating. */
  const isValidating = computed(() => {
    return [...form.validatingFields].some(validatingPath => isPathWithinScope(parsePath(validatingPath), arrayPathSegments.value))
  })

  // #endregion

  // #region Item keys

  /**
   * Allocates a unique key for one array item.
   * @returns A key that never repeats in this field instance.
   */
  function createItemKey() {
    // Keys only need to be unique within this field instance.
    return `notform-array-item-${nextItemKeyId++}`
  }

  /**
   * Pads or trims `itemKeys` from the end so it matches `targetLength`.
   * @param targetLength Desired key count.
   */
  function syncItemKeysToLength(targetLength: number) {
    // Mutation helpers sync keys directly; this handles external length changes.
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

    // Lazily materializes the array on first mutation (e.g. calling
    // `append` before any value was ever set at this path) instead of
    // requiring callers to pre-initialize it.
    const createdArray: Array<unknown> = []
    setProperty(form.values, props.path, createdArray)
    return createdArray
  }

  /**
   * Moves one element inside `target`; indices must already be normalized.
   * @template TItem Array item type.
   * @param target Array to mutate.
   * @param fromIndex Current index of the item.
   * @param toIndex Destination index.
   */
  function moveArrayItem<TItem>(target: Array<TItem>, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return
    }

    const [movedItem] = target.splice(fromIndex, 1)
    target.splice(toIndex, 0, movedItem)
  }

  // #endregion

  // #region Mutations

  /**
   * Appends `value` and a new key at the end of the array.
   * @param value Item to append.
   */
  function append(value: InferInput<TItemSchema>) {
    form.invalidateValidation()
    getOrCreateArrayValue().push(value)
    itemKeys.value.push(createItemKey())
    form.syncDirtyState(props.path)
  }

  /**
   * Inserts `value` at the start and remaps later item state.
   * @param value Item to prepend.
   */
  function prepend(value: InferInput<TItemSchema>) {
    form.invalidateValidation()
    getOrCreateArrayValue().unshift(value)
    itemKeys.value.unshift(createItemKey())
    remapArrayFieldState(form, props.path, previousIndex => previousIndex + 1)
    form.syncDirtyState(props.path)
  }

  /**
   * Inserts `value` at `index`, clamped to `[0, length]`. Invalid non-integer
   * indices are ignored.
   * @param index Insertion index, clamped to the valid range.
   * @param value Item to insert.
   */
  function insert(index: number, value: InferInput<TItemSchema>) {
    const existingArray = getProperty(form.values, props.path)
    const currentLength = Array.isArray(existingArray) ? existingArray.length : 0
    const insertionIndex = normalizeInsertionIndex(index, currentLength)
    if (insertionIndex === undefined) {
      return
    }

    const array = Array.isArray(existingArray) ? existingArray : getOrCreateArrayValue()

    form.invalidateValidation()
    array.splice(insertionIndex, 0, value)
    itemKeys.value.splice(insertionIndex, 0, createItemKey())
    remapArrayFieldState(form, props.path, previousIndex => (
      previousIndex >= insertionIndex ? previousIndex + 1 : previousIndex
    ))
    form.syncDirtyState(props.path)
  }

  /**
   * Removes the item at `index`; invalid non-integer indices are ignored.
   * @param index Index of the item to remove.
   */
  function remove(index: number) {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedIndex = normalizeExistingIndex(index, existingArray.length)
    if (normalizedIndex === undefined) {
      return
    }

    form.invalidateValidation()
    existingArray.splice(normalizedIndex, 1)
    itemKeys.value.splice(normalizedIndex, 1)

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === normalizedIndex) {
        return
      }
      return previousIndex > normalizedIndex ? previousIndex - 1 : previousIndex
    })
    form.syncDirtyState(props.path)
  }

  /**
   * Replaces the value at `index` without changing its key.
   * @param index Index of the item to replace.
   * @param value Replacement item.
   */
  function update(index: number, value: InferInput<TItemSchema>) {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedIndex = normalizeExistingIndex(index, existingArray.length)
    if (normalizedIndex === undefined) {
      return
    }

    form.invalidateValidation()
    existingArray[normalizedIndex] = value
    form.syncDirtyState(props.path)
  }

  /**
   * Swaps two items; invalid non-integer/out-of-range indices are ignored.
   * @param indexA Index of the first item.
   * @param indexB Index of the second item.
   */
  function swap(indexA: number, indexB: number) {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedA = normalizeExistingIndex(indexA, existingArray.length)
    const normalizedB = normalizeExistingIndex(indexB, existingArray.length)

    if (normalizedA === undefined || normalizedB === undefined || normalizedA === normalizedB) {
      return
    }

    form.invalidateValidation();
    // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
    [existingArray[normalizedA], existingArray[normalizedB]] = [existingArray[normalizedB], existingArray[normalizedA]];
    // eslint-disable-next-line unicorn/no-unreadable-array-destructuring
    [itemKeys.value[normalizedA], itemKeys.value[normalizedB]] = [itemKeys.value[normalizedB], itemKeys.value[normalizedA]]

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === normalizedA) {
        return normalizedB
      }
      if (previousIndex === normalizedB) {
        return normalizedA
      }
      return previousIndex
    })
    form.syncDirtyState(props.path)
  }

  /**
   * Moves one item to `toIndex`, clamping the destination to the array bounds.
   * Invalid non-integer source/destination indices are ignored.
   * @param fromIndex Index of the item to move.
   * @param toIndex Destination index, clamped to the valid range.
   */
  function move(fromIndex: number, toIndex: number) {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedFrom = normalizeExistingIndex(fromIndex, existingArray.length)
    const normalizedTo = normalizeMoveDestination(toIndex, existingArray.length)

    if (normalizedFrom === undefined || normalizedTo === undefined || normalizedFrom === normalizedTo) {
      return
    }

    form.invalidateValidation()
    moveArrayItem(existingArray, normalizedFrom, normalizedTo)
    moveArrayItem(itemKeys.value, normalizedFrom, normalizedTo)

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === normalizedFrom) {
        return normalizedTo
      }
      if (normalizedFrom < normalizedTo) {
        return previousIndex > normalizedFrom && previousIndex <= normalizedTo
          ? previousIndex - 1
          : previousIndex
      }
      return previousIndex >= normalizedTo && previousIndex < normalizedFrom
        ? previousIndex + 1
        : previousIndex
    })
    form.syncDirtyState(props.path)
  }

  // #endregion

  // #region External length sync

  watch(
    () => arrayValue.value.length,
    (arrayLength) => {
      // Helpers sync keys directly; this catches external array replacements.
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
