<script setup lang="ts" generic="TArraySchema extends ArraySchema,TObjectSchema extends ObjectSchema = ObjectSchema">
import type { NotArrayFieldContext, NotArrayFieldProps, NotArrayFieldSlots } from '../types/not-array-field'
import type { ArraySchema, ObjectSchema } from '../types/shared'
import { computed, inject, reactive } from 'vue'
import { CURRENT_NOT_FORM_ID_KEY, withContext } from '../utils/not-form-context'
import { getProperty, setProperty } from 'dot-prop'
import type { StandardSchemaV1 } from '@standard-schema/spec'

/**
 * Component for managing array-based form fields.
 * Provides methods for adding, removing, and updating array items.
 * @template TArraySchema Schema for the array field.
 * @template TObjectSchema Parent form object schema.
 */
const props = defineProps<NotArrayFieldProps<TArraySchema>>()

/**
 * Slots provided by the NotArrayField component.
 */
defineSlots<NotArrayFieldSlots<TArraySchema>>()

// Retrieve the ID of the form this array field belongs to
const formID = inject(CURRENT_NOT_FORM_ID_KEY)

if (!formID) {
  throw new Error('NotArrayField must be used inside a NotForm component')
}

// Access parent form context
const { state, validateField } = withContext<TObjectSchema>(formID)

/**
 * Reactive bridge between the form state and the specific array field.
 */
const arrayState = computed<StandardSchemaV1.InferInput<TArraySchema>>({
  get() {
    const fieldValue = getProperty(state.value, props.name) as StandardSchemaV1.InferInput<TArraySchema>
    return (Array.isArray(fieldValue) ? fieldValue : []) as StandardSchemaV1.InferInput<TArraySchema>
  },
  set(value) {
    setProperty(state.value, props.name, value)
    validateField(props.name)
  },
})

/**
 * Computes individual field contexts for each item in the array.
 */
const fields = computed(() => {
  return arrayState.value.map((value, index) => {
    return {
      key: index,
      index,
      value,
      first: index === 0,
      last: index === arrayState.value.length - 1,
    }
  })
})

/**
 * Adds a new item to the end of the array.
 * @param data The initial data for the new item.
 */
function append(data: StandardSchemaV1.InferInput<TArraySchema>[number]) {
  arrayState.value = [...arrayState.value, data]
}

/**
 * Adds a new item to the beginning of the array.
 * @param data The initial data for the new item.
 */
function prepend(data: StandardSchemaV1.InferInput<TArraySchema>[number]) {
  arrayState.value = [data, ...arrayState.value]
}

/**
 * Removes the item at the specified index.
 * @param index The index of the item to remove.
 */
function remove(index: number) {
  const newArray = [...arrayState.value]
  newArray.splice(index, 1)
  arrayState.value = newArray
}

/**
 * Inserts a new item at a specific index.
 * @param index The insertion index.
 * @param data The initial data for the new item.
 */
function insert(index: number, data: StandardSchemaV1.InferInput<TArraySchema>[number]) {
  const newArray = [...arrayState.value]
  newArray.splice(index, 0, data)
  arrayState.value = newArray
}

/**
 * Replaces the data at a specific index.
 * @param index The target index.
 * @param data The new data to apply.
 */
function update(index: number, data: StandardSchemaV1.InferInput<TArraySchema>[number]) {
  const newArray = [...arrayState.value] as StandardSchemaV1.InferInput<TArraySchema>
  newArray[index] = data
  arrayState.value = newArray
}

/**
 * Reactive context object exposed to the NotArrayField slot.
 */
const context = reactive({
  fields,
  append,
  push: append,
  prepend,
  remove,
  insert,
  update,
}) as NotArrayFieldContext<TArraySchema>
</script>

<template>
  <slot v-bind="context" />
</template>
