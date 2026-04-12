<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed, nextTick, onMounted, ref } from 'vue'
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


// DERIVED


const value = computed(() => getProperty(form.values as Record<string, unknown>, props.path))
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
    getProperty(form.initialValues as Record<string, unknown>, props.path),
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
  form.touchField(props.path)
  if (validateOn.value.onBlur) validate()
}

const onInput = () => {
  updateDirty()
  if (!validateOn.value.onInput) return
  // Eager mode: only revalidate if there is already an error to clear
  if (form.validationMode.eager && errors.value.length > 0) validate()
}

const onChange = () => {
  updateDirty()
  if (!validateOn.value.onChange) return
  if (form.validationMode.eager && errors.value.length > 0) validate()
}

const onFocus = () => {
  if (validateOn.value.onFocus) validate()
}

const events = computed(() => ({ onBlur, onInput, onChange, onFocus }))


// LIFECYCLE


onMounted(async () => {
  await nextTick()
  if (validateOn.value.onMount) validate()
})


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
  events: events.value,
  onBlur,
  onInput,
  onChange,
  onFocus,
}))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
