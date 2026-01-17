<script lang="ts" setup generic="TSchema extends Schema, TPath extends InputPaths<TSchema>">
import { computed, inject, nextTick, onMounted, useId, watch } from 'vue'
import type { Schema } from '../types/shared'
import type { InputPaths, InputPathValue, OutputPaths } from '../types/utils'
import type { Form } from '../types/valid-form'
import type { FieldProps, FieldSlots, FieldExpose, FieldInputProps } from '../types/valid-field'
import { formFactoryKey } from '../utils/symbol-keys'

// Props
const props = withDefaults(defineProps<FieldProps<TSchema, TPath>>(), {
  id: () => useId(),
  validateOn: undefined, // Will inherit from form if not specified
})

// Slots
defineSlots<FieldSlots<TSchema, TPath>>()

// Inject form context
const form = inject<Form<TSchema>>(formFactoryKey)

if (!form) {
  throw new Error('ValidField must be used within a ValidForm component')
}

// Computed properties
const value = computed({
  get: () => form.getValue(props.name as unknown as OutputPaths<TSchema>) as InputPathValue<TSchema, TPath>,
  set: (newValue: InputPathValue<TSchema, TPath>) => {
    form.setValue(props.name, newValue)
  },
})

const errors = computed(() => form.getError(props.name as unknown as OutputPaths<TSchema>))

const hasError = computed(() => errors.value.length > 0)

const isTouched = computed(() => form.isTouched(props.name))

const isDirty = computed(() => form.isDirty(props.name))

const isFocused = computed(() => form.isFocused(props.name))

const effectiveValidateOn = computed(() => props.validateOn ?? form.validateOn)

// Methods
function handleFocus() {
  form?.focus(props.name)
}

function handleBlur() {
  form?.blur(props.name)

  // Validate on blur if configured
  if (effectiveValidateOn.value.includes('blur')) {
    form?.validateForm()
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  // Determine the value based on input type
  let newValue: InputPathValue<TSchema, TPath>

  if (target.type === 'checkbox') {
    newValue = target.checked as InputPathValue<TSchema, TPath>
  }
  else if (target.type === 'number') {
    newValue = (target.value === '' ? undefined : Number(target.value)) as InputPathValue<TSchema, TPath>
  }
  else {
    newValue = target.value as InputPathValue<TSchema, TPath>
  }

  value.value = newValue

  // Validate on input if configured and field is touched
  if (isTouched.value && effectiveValidateOn.value.includes('input')) {
    form?.validateForm()
  }
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement

  // Determine the value based on input type
  let newValue: InputPathValue<TSchema, TPath>

  if (target.type === 'checkbox') {
    newValue = target.checked as InputPathValue<TSchema, TPath>
  }
  else if (target.type === 'number') {
    newValue = (target.value === '' ? undefined : Number(target.value)) as InputPathValue<TSchema, TPath>
  }
  else {
    newValue = target.value as InputPathValue<TSchema, TPath>
  }

  value.value = newValue

  // Validate on change if configured
  if (effectiveValidateOn.value.includes('change')) {
    form?.validateForm()
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()

  if (effectiveValidateOn.value.includes('mount')) {
    form?.validateForm()
  }
})

if (form.mode === 'eager') {
  watch(value, () => {
    form?.validateForm()
  })
}

const field = computed<FieldInputProps<TSchema, TPath>>(() => ({
  id: props.id,
  name: props.name,
  value: value.value,
  onFocus: handleFocus,
  onBlur: handleBlur,
  onInput: handleInput,
  onChange: handleChange,
}))

// Expose
defineExpose<FieldExpose>({
  isTouched,
  isDirty,
  isFocused,
  hasError,
  errors,
  value,
})
</script>

<template>
  <slot
    :field="field"
    :errors="errors"
    :has-error="hasError"
    :is-touched="isTouched"
    :is-dirty="isDirty"
    :is-focused="isFocused"
  />
</template>
