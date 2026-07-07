<script setup lang="ts" generic="TSchema extends ObjectSchema,TItemSchema extends StandardSchemaV1 = StandardSchemaV1,TItem = StandardSchemaV1.InferInput<TItemSchema>">
import type { StandardSchemaV1 } from '@standard-schema/spec'
import { dequal } from 'dequal'
import { getProperty, setProperty } from 'dot-prop'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type {
  NotArrayFieldItem,
  NotArrayFieldProps,
  NotArrayFieldSlots,
} from '../types/not-array-field'
import type { ObjectSchema } from '../types/shared'
import { remapArrayFieldState } from '../utils/array-field'
import { useNotFormInstance } from '../utils/instance'

// Setup & Baseline

defineSlots<NotArrayFieldSlots<TSchema, TItem>>()

const props = defineProps<NotArrayFieldProps<TItemSchema>>()

const form = useNotFormInstance(props.form)

// Reactive State

const isValidating = ref(false)

/** Counter to ensure absolute uniqueness for generated keys. */
let keyCounter = 0

/** Stable keys per item that survive reorders, removals, and inserts. */
const itemKeys = ref<string[]>((() => {
  const initial = getProperty(form.values, props.path)
  const length = Array.isArray(initial) ? initial.length : 0
  return Array.from({ length }, () => `${props.path}-${keyCounter++}`)
})())

// Computed Properties

const validateOn = computed(() => ({
  onChange: props.validateOn?.onChange ?? form.validateOn.onChange,
  onMount: props.validateOn?.onMount ?? form.validateOn.onMount,
}))

const array = computed<TItem[]>(() => {
  const value = getProperty(form.values, props.path)
  return Array.isArray(value) ? value : []
})

const items = computed<NotArrayFieldItem[]>(() => {
  return array.value.map((_, index) => ({
    index,
    key: itemKeys.value[index] ?? `${props.path}-fallback-${index}`,
    path: `${props.path}.${index}`,
  }))
})

const errors = computed(() => form.getFieldErrors(props.path))
const isValid = computed(() => errors.value.length === 0)

const isTouched = computed(() => {
  return form.touchedFields.has(props.path)
    || [...form.touchedFields].some(path => path.startsWith(`${props.path}.`))
})

const isDirty = computed(() => {
  return form.dirtyFields.has(props.path)
    || [...form.dirtyFields].some(path => path.startsWith(`${props.path}.`))
})

// Internal Helpers & Mutations

/**
 * Generates a unique key string using the field path and counter.
 * @returns A unique key string
 */
function generateKey() {
  return `${props.path}-${keyCounter++}`
}

/** Re-aligns itemKeys with current array length (used mostly after external resets) */
function syncKeys() {
  const arrayLength = array.value.length

  if (itemKeys.value.length > arrayLength) {
    itemKeys.value.length = arrayLength
  } else {
    while (itemKeys.value.length < arrayLength) {
      itemKeys.value.push(generateKey())
    }
  }
}

/**
 * Applies an array update, syncs form dirty/touched state, and triggers validation.
 * @param updater Function that modifies the array
 */
function mutate(updater: (current: TItem[]) => void): void {
  const current = [...array.value]
  updater(current)

  setProperty(form.values, props.path, current)
  form.touchField(props.path)

  const isClean = dequal(current, getProperty(form.initialValues, props.path))

  if (isClean) {
    form.dirtyFields.delete(props.path)
  } else {
    form.dirtyField(props.path)
  }

  if (validateOn.value.onChange) {
    validate()
  }
}

// Exposed Actions & Array Methods

/**
 * Validates the array field
 * @returns Promise that resolves to the validation result
 */
async function validate() {
  isValidating.value = true
  try {
    return await form.validateField(props.path)
  } finally {
    isValidating.value = false
  }
}

/**
 * Appends an item to the array
 * @param value The value to append
 */
function append(value: TItem): void {
  itemKeys.value.push(generateKey())
  mutate(current => current.push(value))
}

/**
 * Prepends an item to the array
 * @param value The value to prepend
 */
function prepend(value: TItem): void {
  itemKeys.value.unshift(generateKey())
  remapArrayFieldState(form, props.path, previousIndex => previousIndex + 1)
  mutate(current => current.unshift(value))
}

/**
 * Removes an item from the array
 * @param index The index of the item to remove
 */
function remove(index: number): void {
  itemKeys.value.splice(index, 1)

  remapArrayFieldState(form, props.path, (previousIndex) => {
    if (previousIndex === index) return
    return previousIndex > index ? previousIndex - 1 : previousIndex
  })

  mutate(current => current.splice(index, 1))
}

/**
 * Inserts an item at a specific index
 * @param index The index to insert at
 * @param value The value to insert
 */
function insert(index: number, value: TItem): void {
  itemKeys.value.splice(index, 0, generateKey())

  remapArrayFieldState(form, props.path, (previousIndex) => {
    if (previousIndex >= index) return previousIndex + 1
    return previousIndex
  })

  mutate(current => current.splice(index, 0, value))
}

/**
 * Updates an item at a specific index
 * @param index The index to update
 * @param value The new value
 */
function update(index: number, value: TItem): void {
  // Key stays the same — same slot, new value
  mutate((current) => {
    current[index] = value
  })
}

/**
 * Swaps two items in the array
 * @param indexA The first index
 * @param indexB The second index
 */
function swap(indexA: number, indexB: number): void {
  const temporaryKey = itemKeys.value[indexA]
  itemKeys.value[indexA] = itemKeys.value[indexB]
  itemKeys.value[indexB] = temporaryKey

  remapArrayFieldState(form, props.path, (previousIndex) => {
    if (previousIndex === indexA) return indexB
    if (previousIndex === indexB) return indexA
    return previousIndex
  })

  mutate((current) => {
    const temporaryValue = current[indexA]
    current[indexA] = current[indexB]
    current[indexB] = temporaryValue
  })
}

/**
 * Moves an item from one index to another
 * @param from The source index
 * @param to The destination index
 */
function move(from: number, to: number): void {
  const [movedItemKey] = itemKeys.value.splice(from, 1)
  itemKeys.value.splice(to, 0, movedItemKey)

  remapArrayFieldState(form, props.path, (previousIndex) => {
    if (previousIndex === from) return to

    if (from < to) {
      if (previousIndex > from && previousIndex <= to) {
        return previousIndex - 1
      }

      return previousIndex
    }

    if (previousIndex >= to && previousIndex < from) {
      return previousIndex + 1
    }

    return previousIndex
  })

  mutate((current) => {
    const [movedItem] = current.splice(from, 1)
    current.splice(to, 0, movedItem)
  })
}

// Lifecycle & Watchers

onMounted(async () => {
  await nextTick()
  if (validateOn.value.onMount) {
    validate()
  }
})

// Syncs keys when array length changes outside component's own methods (e.g. form.reset).
watch(() => array.value.length, syncKeys)
</script>

<template>
  <slot
    :append
    :errors
    :insert
    :is-dirty
    :is-touched
    :is-valid
    :is-validating
    :items
    :move
    :path
    :prepend
    :remove
    :swap
    :update
    :validate
  />
</template>
