import type { StandardSchemaV1 } from '@standard-schema/spec'
import { getProperty, parsePath, setProperty } from 'dot-prop'
import { computed, reactive, ref, watch } from 'vue'
import type { ArrayFieldItem, ArrayFieldProps, ArrayFieldSlots } from '../types/array-field'
import type { InferInput, ObjectSchema } from '../types/shared'
import { normalizeExistingIndex, normalizeInsertionIndex, normalizeMoveDestination, remapArrayFieldState } from '../helpers/array-field'
import { isPathWithinScope } from '../helpers/segments'
import { useFormInstance } from './use-form-instance'

/**
 * State and mutation helpers for `<ArrayField>`.
 * @param props
 */
export function useArrayField<
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
>(props: ArrayFieldProps<TSchema, TItemSchema>): Parameters<NonNullable<ArrayFieldSlots<TSchema, TItemSchema>['default']>>[0] {
  const form = useFormInstance<TSchema>(props.form)

  let nextItemKeyId = 0
  const itemKeys = ref<Array<string>>([])

  const arrayValue = computed<Array<unknown>>(() => {
    const value = getProperty(form.values, props.path)
    return Array.isArray(value) ? value : []
  })

  const items = computed<Array<ArrayFieldItem<TSchema>>>(() => arrayValue.value.map((_, index) => ({
    index,
    key: itemKeys.value[index] ?? '',
    path: `${props.path}.${index}`,
  })))

  const arrayPathSegments = computed(() => parsePath(props.path))
  const errors = computed(() => form.getFieldErrors(props.path))

  const isValid = computed(() => form.errors.every(issue => (
    issue.path === undefined || !isPathWithinScope(issue.path, arrayPathSegments.value)
  )))

  const isTouched = computed(() => form.isPathTouchedWithin(props.path))
  const isDirty = computed(() => form.isPathDirty(props.path))
  const isValidating = computed(() => form.isPathValidating(props.path))

  /**
   *
   */
  function createItemKey() {
    return `notform-array-item-${nextItemKeyId++}`
  }

  /**
   * @param targetLength
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
   *
   */
  function getOrCreateArrayValue() {
    const existing = getProperty(form.values, props.path)

    if (Array.isArray(existing)) {
      return existing
    }

    setProperty(form.values, props.path, [])
    return getProperty(form.values, props.path) as Array<unknown>
  }

  /**
   * @param target
   * @param fromIndex
   * @param toIndex
   */
  function moveArrayItem<TItem>(target: Array<TItem>, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return
    }

    const [movedItem] = target.splice(fromIndex, 1)
    target.splice(toIndex, 0, movedItem)
  }

  /**
   * @param value
   */
  function append(value: InferInput<TItemSchema>) {
    getOrCreateArrayValue().push(value)
    itemKeys.value.push(createItemKey())
  }

  /**
   * @param value
   */
  function prepend(value: InferInput<TItemSchema>) {
    getOrCreateArrayValue().unshift(value)
    itemKeys.value.unshift(createItemKey())
    remapArrayFieldState(form, props.path, previousIndex => previousIndex + 1)
  }

  /**
   * @param index
   * @param value
   */
  function insert(index: number, value: InferInput<TItemSchema>) {
    const existingArray = getProperty(form.values, props.path)
    const currentLength = Array.isArray(existingArray) ? existingArray.length : 0
    const insertionIndex = normalizeInsertionIndex(index, currentLength)

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
   * @param index
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
   * @param index
   * @param value
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

    existingArray[normalizedIndex] = value
  }

  /**
   * @param indexA
   * @param indexB
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

    [existingArray[normalizedA], existingArray[normalizedB]] = [existingArray[normalizedB], existingArray[normalizedA]];
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
  }

  /**
   * @param fromIndex
   * @param toIndex
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

  // Array helpers keep keys in lockstep. This watcher covers external array
  // replacement (including reset()) where index-based keys should not be reused
  // for logically new items.
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

  // External push/pop changes length without changing the array identity.
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
