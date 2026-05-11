<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { getProperty } from 'dot-prop'
import type { NotFieldProps, NotFieldSlots, NotFieldSlotProps } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../utils/instance-utils'
import { dequal } from 'dequal'

defineOptions({ inheritAttrs: false })
defineSlots<NotFieldSlots<TSchema>>()

const props = defineProps<NotFieldProps>()


// INSTANCE


// Explicit :form prop takes priority over whatever NotForm ancestor provided
const form = useNotFormInstance(props.form)


// OPTIONS


// Per-field validateOn is merged over the form-wide config — only specified keys are overridden
const validateOn = computed(() => ({
  ...form.validateOn,
  ...props.validateOn,
}))


// STATE


const isValidating = ref(false)
/** Timer handle for the current pending debounced validation, if any. */
let debounceTimer: NodeJS.Timeout | undefined


// DEBOUNCE

/**
 * Cancels any pending debounced validation without running it.
 * Called on blur (so blur's own immediate validation takes over) and on unmount
 * (to prevent a timer from firing after the component is gone).
 */
const clearDebounce = () => {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }
}

/**
 * Schedules a validation run, respecting the field's `debounce` prop.
 *
 * - If `debounce` is `0` or omitted, validation runs synchronously.
 * - Otherwise, any pending timer is cancelled and a new one is started.
 *   Only the final call within the window actually validates — useful for
 *   async checks (availability lookups, server-side rules) where firing on
 *   every keystroke would be wasteful.
 */
const scheduleValidation = () => {
  if (!props.debounce) {
    validate()
    return
  }
  clearDebounce()
  debounceTimer = setTimeout(validate, props.debounce)
}


// DERIVED


const value = computed(() => getProperty(form.values, props.path))
const errors = computed(() => form.getFieldErrors(props.path))
const isValid = computed(() => errors.value.length === 0)
const isTouched = computed(() => form.touchedFields.has(props.path))
const isDirty = computed(() => form.dirtyFields.has(props.path))


// DIRTY TRACKING


/**
 * Syncs dirty state on input or change.
 * Reads the already-updated value (v-model writes before the event fires)
 * and compares it against the field's initial value.
 */
const updateDirty = () => {
  const isClean = dequal(
    value.value,
    getProperty(form.initialValues, props.path),
  )
  if (isClean) form.dirtyFields.delete(props.path)
  else form.dirtyField(props.path)
}


// VALIDATION


const validate = async () => {
  isValidating.value = true
  try {
    return await form.validateField(props.path)
  } finally {
    isValidating.value = false
  }
}


// EVENT HANDLERS


const onBlur = () => {
  clearDebounce() // cancel pending — blur's validate() takes over
  form.touchField(props.path)
  if (validateOn.value.onBlur) validate()
}

const onInput = () => {
  updateDirty()
  if (!validateOn.value.onInput) return
  // Eager mode: only revalidate if there is already an error to clear
  if (form.validationMode.eager && !isValid.value) scheduleValidation()
}

const onChange = () => {
  updateDirty()
  if (!validateOn.value.onChange) return
  if (form.validationMode.eager && !isValid.value) scheduleValidation()
}

const onFocus = () => {
  if (validateOn.value.onFocus) scheduleValidation()
}


// LIFECYCLE


onMounted(async () => {
  await nextTick()
  if (validateOn.value.onMount) validate()
})

onUnmounted(clearDebounce)


// SLOT PROPS


const slotProps = computed<NotFieldSlotProps<TSchema>>(() => ({
  path: props.path,
  value: value.value,
  errors: errors.value,
  isValid: isValid.value,
  isTouched: isTouched.value,
  isDirty: isDirty.value,
  isValidating: isValidating.value,
  validate,
  events: { onBlur, onInput, onChange, onFocus },
}))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
