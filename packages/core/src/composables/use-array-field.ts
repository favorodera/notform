import type { StandardSchemaV1 } from '@standard-schema/spec'
import { getProperty, parsePath, setProperty } from 'dot-prop'
import { computed, reactive, ref, watch } from 'vue'
import type { ArrayFieldItem, ArrayFieldProps, ArrayFieldSlots } from '../types/array-field'
import type { InferInput, ObjectSchema } from '../types/shared'
import { normalizeExistingIndex, normalizeInsertionIndex, normalizeMoveDestination, remapArrayFieldState } from '../helpers/array-field'
import { isPathWithinScope } from '../helpers/segments'
import { useFormInstance } from './use-form-instance'

/**
 * Creates array state and mutations for an array-field slot.
 * @template TSchema Schema that owns the array path.
 * @template TItemSchema Schema that defines inserted item values.
 * @param props Array path, item schema, and optional form instance.
 * @returns Reactive array state and mutation methods for the slot.
 */
export function useArrayField<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
>(props: ArrayFieldProps<TSchema, TItemSchema>): Parameters<NonNullable<ArrayFieldSlots<TSchema, TItemSchema>['default']>>[0] {
  /** Form instance resolved from the prop or nearest `<Form>`. */
  const form = useFormInstance<TSchema>(props.form)

  /** Monotonic suffix keeps keys unique for this composable instance. */
  let nextItemKeyId = 0

  /** Stable render keys associated with the current array items. */
  const itemKeys = ref<Array<string>>([])

  /** Current array value at the configured path, or an empty array if absent. */
  const arrayValue = computed<Array<unknown>>(() => {
    const value = getProperty(form.values, props.path)
    return Array.isArray(value) ? value : []
  })

  /** Slot entries pairing each array item with its index, key, and field path. */
  const items = computed<Array<ArrayFieldItem<TSchema>>>(() => arrayValue.value.map((_, index) => ({
    index,
    key: itemKeys.value[index] ?? '',
    path: `${props.path}.${index}`,
  })))

  /** Parsed path segments used to check issues within the array subtree. */
  const arrayPathSegments = computed(() => parsePath(props.path))

  /** Current issues associated with the configured array path. */
  const errors = computed(() => form.getFieldErrors(props.path))

  /** Whether the array subtree has no validation issues. */
  const isValid = computed(() => form.errors.every(issue => (
    issue.path === undefined || !isPathWithinScope(issue.path, arrayPathSegments.value)
  )))

  /** Whether the form considers this array path or its subtree touched. */
  const isTouched = computed(() => form.isPathTouchedWithin(props.path))

  /** Whether the array value differs from its reset baseline. */
  const isDirty = computed(() => form.isPathDirty(props.path))

  /** Whether validation currently overlaps this array path. */
  const isValidating = computed(() => form.isPathValidating(props.path))

  /**
   * Creates a key for a newly tracked item.
   * @returns Key unique to this array-field instance.
   */
  function createItemKey(): string {
    return `array-field-item-${nextItemKeyId++}`
  }

  /**
   * Aligns render keys with the current array length.
   * @param targetLength Number of current array items.
   */
  function syncItemKeysToLength(targetLength: number) {
    while (itemKeys.value.length < targetLength) {
      itemKeys.value.push(createItemKey())
    }

    if (itemKeys.value.length > targetLength) {
      itemKeys.value.length = targetLength
    }
  }

  /**
   * Gets the array at the configured path, creating it when absent.
   * @returns The reactive array stored at the configured path.
   */
  function getOrCreateArrayValue(): Array<unknown> {
    const existing = getProperty(form.values, props.path)

    if (Array.isArray(existing)) {
      return existing
    }

    setProperty(form.values, props.path, [])
    return getProperty(form.values, props.path) as Array<unknown>
  }

  /**
   * Moves an item in place without changing the array length.
   * @template TItem Array element type.
   * @param target Array to mutate.
   * @param fromIndex Existing item index.
   * @param toIndex Destination index after removal.
   */
  function moveArrayItem<TItem>(target: Array<TItem>, fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) {
      return
    }

    const [movedItem] = target.splice(fromIndex, 1)
    target.splice(toIndex, 0, movedItem)
  }

  /**
   * Appends an item and assigns it a stable render key.
   * @param value Item value to append.
   */
  function append(value: InferInput<TItemSchema>): void {
    getOrCreateArrayValue().push(value)
    itemKeys.value.push(createItemKey())
  }

  /**
   * Prepends an item and shifts touched paths and errors to match.
   * @param value Item value to prepend.
   */
  function prepend(value: InferInput<TItemSchema>): void {
    getOrCreateArrayValue().unshift(value)
    itemKeys.value.unshift(createItemKey())
    remapArrayFieldState(form, props.path, previousIndex => previousIndex + 1)
  }

  /**
   * Inserts an item and remaps state for items at or after its index.
   * @param index Requested insertion index, clamped to the array bounds.
   * @param value Item value to insert.
   */
  function insert(index: number, value: InferInput<TItemSchema>): void {
    const existingArray = getProperty(form.values, props.path)
    const currentLength = Array.isArray(existingArray) ? existingArray.length : 0
    const insertionIndex = normalizeInsertionIndex(index, currentLength)

    // Ignore non-integer indices instead of mutating the array unpredictably.
    if (insertionIndex === undefined) {
      return
    }

    const array = Array.isArray(existingArray) ? existingArray : getOrCreateArrayValue()
    array.splice(insertionIndex, 0, value)
    itemKeys.value.splice(insertionIndex, 0, createItemKey())

    remapArrayFieldState(form, props.path, previousIndex => (
      previousIndex >= insertionIndex ? previousIndex + 1 : previousIndex
    ))
  }

  /**
   * Removes an item and drops state attached to its index.
   * @param index Item index to remove; invalid indices are ignored.
   */
  function remove(index: number): void {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedIndex = normalizeExistingIndex(index, existingArray.length)
    if (normalizedIndex === undefined) {
      return
    }

    existingArray.splice(normalizedIndex, 1)
    itemKeys.value.splice(normalizedIndex, 1)

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === normalizedIndex) {
        return
      }

      return previousIndex > normalizedIndex ? previousIndex - 1 : previousIndex
    })
  }

  /**
   * Replaces an item while preserving its key and index.
   * @param index Item index to replace.
   * @param value Replacement item value.
   */
  function update(index: number, value: InferInput<TItemSchema>): void {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedIndex = normalizeExistingIndex(index, existingArray.length)
    if (normalizedIndex === undefined) {
      return
    }

    existingArray[normalizedIndex] = value
  }

  /**
   * Swaps two items and remaps their touched paths and errors.
   * @param indexA Index of the first item.
   * @param indexB Index of the second item.
   */
  function swap(indexA: number, indexB: number): void {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedA = normalizeExistingIndex(indexA, existingArray.length)
    const normalizedB = normalizeExistingIndex(indexB, existingArray.length)

    if (normalizedA === undefined || normalizedB === undefined || normalizedA === normalizedB) {
      return
    }

    const itemAtA = existingArray[normalizedA]
    existingArray[normalizedA] = existingArray[normalizedB]
    existingArray[normalizedB] = itemAtA

    const keyAtA = itemKeys.value[normalizedA]
    const keyAtB = itemKeys.value[normalizedB]
    itemKeys.value[normalizedA] = keyAtB
    itemKeys.value[normalizedB] = keyAtA

    remapArrayFieldState(form, props.path, (previousIndex) => {
      if (previousIndex === normalizedA) {
        return normalizedB
      }
      if (previousIndex === normalizedB) {
        return normalizedA
      }
      return previousIndex
    })
  }

  /**
   * Moves an item and remaps affected touched paths and errors.
   * @param fromIndex Existing item index.
   * @param toIndex Destination index, clamped to the array bounds.
   */
  function move(fromIndex: number, toIndex: number): void {
    const existingArray = getProperty(form.values, props.path)
    if (!Array.isArray(existingArray)) {
      return
    }

    const normalizedFrom = normalizeExistingIndex(fromIndex, existingArray.length)
    const normalizedTo = normalizeMoveDestination(toIndex, existingArray.length)

    if (normalizedFrom === undefined || normalizedTo === undefined || normalizedFrom === normalizedTo) {
      return
    }

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
  }

  // Replacing the array creates fresh keys so new items cannot inherit stale DOM state.
  watch(
    () => getProperty(form.values, props.path),
    (current) => {
      if (!Array.isArray(current)) {
        itemKeys.value = []
        return
      }

      itemKeys.value = current.map(() => createItemKey())
    },
    { immediate: true },
  )

  // Track push/pop mutations that preserve the array reference.
  watch(
    () => arrayValue.value.length,
    length => syncItemKeysToLength(length),
    { immediate: true },
  )

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
