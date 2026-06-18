<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { dequal } from 'dequal'
import { getProperty } from 'dot-prop'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../utils/instance-utils'

// Setup & Baseline

defineSlots<NotFieldSlots<TSchema>>()

const props = defineProps<NotFieldProps>()

const form = useNotFormInstance(props.form)

// Reactive State

const isValidating = ref(false)

/** Timer handle for the current pending debounced validation. */
let debounceTimer: ReturnType<typeof setTimeout> | undefined

// Computed Properties

/** Merges per-field overrides with the form-wide validation config */
const validateOn = computed(() => ({
  ...form.validateOn,
  ...props.validateOn,
}))

const value = computed(() => getProperty(form.values, props.path))
const errors = computed(() => form.getFieldErrors(props.path))
const isValid = computed(() => errors.value.length === 0)
const isTouched = computed(() => form.touchedFields.has(props.path))
const isDirty = computed(() => form.dirtyFields.has(props.path))

// Internal Helpers

/** Cancels pending debounced validation on blur/unmount to prevent rogue execution. */
function clearDebounce() {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }
}

/** Compares current value against baseline to sync dirty state tracking. */
function updateDirty() {
  const isClean = dequal(value.value, getProperty(form.initialValues, props.path))
  if (isClean) {
    form.dirtyFields.delete(props.path)
  } else {
    form.dirtyField(props.path)
  }
}

/** Replaces pending validations with a new timer, or runs synchronously if no debounce. */
function scheduleValidation() {
  if (!props.debounce) {
    validate()
    return
  }
  clearDebounce()
  debounceTimer = setTimeout(validate, props.debounce)
}

// Exposed Actions & Event Handlers

/**
 * Validates the field and returns the validation result.
 * @returns A promise that resolves to the validation result.
 */
async function validate() {
  isValidating.value = true
  try {
    return await form.validateField(props.path)
  } finally {
    isValidating.value = false
  }
}

/** Handles the blur event for the field. */
function onBlur() {
  // Blur's immediate validation takes over
  clearDebounce()

  form.touchField(props.path)

  if (validateOn.value.onBlur) {
    validate()
  }
}

/** Handles the input event for the field. */
function onInput() {
  updateDirty()

  if (!validateOn.value.onInput) {
    return
  }

  // Eager mode: only revalidate if there is already an error to clear
  if (form.validationMode.eager && !isValid.value) {
    scheduleValidation()
  }
}

/** Handles the change event for the field. */
function onChange() {
  updateDirty()

  if (!validateOn.value.onChange) {
    return
  }

  // Eager mode: only revalidate if there is already an error to clear
  if (form.validationMode.eager && !isValid.value) {
    scheduleValidation()
  }
}

/** Handles the focus event for the field. */
function onFocus() {
  if (validateOn.value.onFocus) {
    scheduleValidation()
  }
}

// Lifecycle Hooks

onMounted(async () => {
  await nextTick()
  if (validateOn.value.onMount) {
    validate()
  }
})

onUnmounted(() => {
  clearDebounce()
})
</script>

<template>
  <slot
    :errors
    :is-valid
    :is-touched
    :is-dirty
    :is-validating
    :validate
    :events="{ onBlur, onChange, onFocus, onInput }"
    :path
    :value
  />
</template>
