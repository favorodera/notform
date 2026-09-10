<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { dequal } from 'dequal'
import { getProperty } from 'dot-prop'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../utils/instance'

// Setup

defineSlots<NotFieldSlots<TSchema>>()

const props = defineProps<NotFieldProps>()

const form = useNotFormInstance(props.form)

// Internal State

const isValidating = ref(false)
const validatingCount = ref(0)

/** Timer handle for the current pending debounced validation. */
const debounceTimer = ref<ReturnType<typeof setTimeout>>()

// Internal Computed

/** Merges per-field overrides with the form-wide validation config. */
const validateOn = computed(() => ({
  ...form.validateOn,
  ...props.validateOn,
}))

// Public Computed

const value = computed(() => getProperty(form.values, props.path))
const errors = computed(() => form.getFieldErrors(props.path))
const isValid = computed(() => errors.value.length === 0)
const isTouched = computed(() => form.touchedFields.has(props.path))
const isDirty = computed(() => form.dirtyFields.has(props.path))

// Internal Helpers

/** Starts a local field validation execution. */
function beginValidation() {
  validatingCount.value++
  isValidating.value = true
}

/** Ends a local field validation execution. */
function endValidation() {
  validatingCount.value--

  if (validatingCount.value === 0) {
    isValidating.value = false
  }
}

/** Cancels pending debounced validation on blur/unmount to prevent rogue execution. */
function clearDebounce() {
  if (debounceTimer.value === undefined) {
    return
  }

  clearTimeout(debounceTimer.value)
  debounceTimer.value = undefined
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

/** Replaces pending debounced validation with a new timer, or runs immediately when no debounce is configured. */
function scheduleValidation() {
  if (!props.debounce) {
    validate()
    return
  }

  clearDebounce()
  debounceTimer.value = setTimeout(validate, props.debounce)
}

// Public Actions & Event Handlers

/**
 * Validates the field and returns the validation result.
 * @returns A promise that resolves to the validation result.
 */
async function validate() {
  beginValidation()

  try {
    return await form.validateField(props.path)
  } finally {
    endValidation()
  }
}

/** Handles the blur event for the field. */
function onBlur() {
  // Blur's immediate validation takes over.
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

  // Eager mode: only revalidate if there is already an error to clear.
  if (form.validationMode === 'eager' && !isValid.value) {
    scheduleValidation()
  }
}

/** Handles the change event for the field. */
function onChange() {
  updateDirty()

  if (!validateOn.value.onChange) {
    return
  }

  // Eager mode: only revalidate if there is already an error to clear.
  if (form.validationMode === 'eager' && !isValid.value) {
    scheduleValidation()
  }
}

/** Handles the focus event for the field. */
function onFocus() {
  if (validateOn.value.onFocus) {
    scheduleValidation()
  }
}

// Lifecycle

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
