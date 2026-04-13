<script setup lang="ts" generic="
  TSchema extends ObjectSchema,
  TItemSchema extends StandardSchemaV1 = StandardSchemaV1,
  TItem = StandardSchemaV1.InferInput<TItemSchema>
"
>
import { computed, nextTick, onMounted, ref } from 'vue'
import { getProperty, setProperty } from 'dot-prop'
import { dequal } from 'dequal'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ObjectSchema } from '../types/shared'
import type {
  NotArrayFieldProps,
  NotArrayFieldSlots,
  NotArrayFieldSlotProps,
  NotArrayFieldItem,
} from '../types/not-array-field'
import { useNotFormInstance } from '../utils/instance-utils'

defineOptions({ inheritAttrs: false })
defineSlots<NotArrayFieldSlots<TSchema, TItem>>()

const props = defineProps<NotArrayFieldProps<TItemSchema>>()


// INSTANCE


const form = useNotFormInstance(props.form)


// OPTIONS


// Only onMount and onChange are meaningful for an array wrapper — no onBlur/onFocus/onInput
const validateOn = computed(() => ({
  onMount: props.validateOn?.onMount ?? form.validateOn.onMount,
  onChange: props.validateOn?.onChange ?? form.validateOn.onChange,
}))


// STATE


const isValidating = ref(false)

/**
 * Stable keys per item — survive reorders, removals, and inserts.
 * Seeded from the length of the initial array so existing items have keys from the start.
 */
const itemKeys = ref(
  (
    () => {
      const initial = getProperty(form.values, props.path)
      const length = Array.isArray(initial) ? initial.length : 0

      return Array.from({ length }, (_, index) => `${props.path}-${index}-${Date.now()}`)
    }
  )(),
)

let keyCounter = itemKeys.value.length

const generateKey = () => `${props.path}-${keyCounter++}-${Date.now()}`


// DERIVED


const array = computed<TItem[]>(() => {
  const value = getProperty(form.values, props.path)
  return Array.isArray(value) ? value : []
})

const items = computed<NotArrayFieldItem[]>(() =>
  array.value.map((_, index) => ({
    key: itemKeys.value[index] ?? `${props.path}-fallback-${index}`,
    index,
    path: `${props.path}.${index}`,
  })),
)

const errors = computed(() => form.getFieldErrors(props.path))
const isValid = computed(() => errors.value.length === 0)

/**
 * Derived from the form's touchedFields set.
 * True if the array path itself or any of its item paths have been touched.
 */
const isTouched = computed(() =>
  form.touchedFields.has(props.path)
  || [...form.touchedFields].some(path => path.startsWith(`${props.path}.`)),
)

/**
 * Derived from the form's dirtyFields set.
 * True if the array path itself or any of its item paths are dirty.
 */
const isDirty = computed(() =>
  form.dirtyFields.has(props.path)
  || [...form.dirtyFields].some(path => path.startsWith(`${props.path}.`)),
)


// VALIDATION


const validate = async () => {
  isValidating.value = true
  try {
    return await form.validateField(props.path)
  } finally {
    isValidating.value = false
  }
}


// MUTATION


/**
 * Re-aligns itemKeys with the current array length.
 * Called at the start of every mutation so keys stay consistent
 * after external changes (e.g. form.reset()).
 */
const syncKeys = () => {
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
 * Applies an update to a copy of the current array, writes it back to the form values,
 * and marks the array path as touched. Dirty state is derived from the form's Sets
 * automatically via the computed above so no explicit dirty call is needed here.
 */
const mutate = (updater: (current: TItem[]) => void) => {
  syncKeys()
  const current = [...array.value]
  updater(current)
  setProperty(form.values, props.path, current)
  form.touchField(props.path)

  const isClean = dequal(current, getProperty(form.initialValues, props.path))
  if (isClean) form.dirtyFields.delete(props.path)
  else form.dirtyField(props.path)

  if (validateOn.value.onChange) validate()
}


// ARRAY METHODS


const append = (value: TItem) => {
  itemKeys.value.push(generateKey())
  mutate(current => current.push(value))
}

const prepend = (value: TItem) => {
  itemKeys.value.unshift(generateKey())
  mutate(current => current.unshift(value))
}

const remove = (index: number) => {
  mutate(current => current.splice(index, 1))
  itemKeys.value.splice(index, 1)
}

const insert = (index: number, value: TItem) => {
  itemKeys.value.splice(index, 0, generateKey())
  mutate(current => current.splice(index, 0, value))
}

const update = (index: number, value: TItem) => {
  mutate((current) => {
    current[index] = value
  })
  // Key stays the same — same slot, new value
}

const swap = (indexA: number, indexB: number) => {
  mutate((current) => {
    ;[current[indexA], current[indexB]] = [current[indexB], current[indexA]]
  })
  ;[itemKeys.value[indexA], itemKeys.value[indexB]] = [itemKeys.value[indexB], itemKeys.value[indexA]]
}

const move = (from: number, to: number) => {
  mutate((current) => {
    const [item] = current.splice(from, 1)
    current.splice(to, 0, item)
  })
  const [key] = itemKeys.value.splice(from, 1)
  itemKeys.value.splice(to, 0, key)
}


// LIFECYCLE


onMounted(async () => {
  await nextTick()
  if (validateOn.value.onMount) validate()
})


// SLOT PROPS


const slotProps = computed<NotArrayFieldSlotProps<TSchema, TItem>>(() => ({
  path: props.path,
  items: items.value,
  length: array.value.length,
  errors: errors.value,
  isValid: isValid.value,
  isTouched: isTouched.value,
  isDirty: isDirty.value,
  isValidating: isValidating.value,
  validate,
  append,
  prepend,
  remove,
  insert,
  update,
  swap,
  move,
}))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
