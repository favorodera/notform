<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { FieldContext, FieldProps, FieldSlots } from '../types/field'
import type { ObjectSchema } from '../types/shared'
import { computed, inject, nextTick, onMounted } from 'vue'
import { CURRENT_FORM_ID_KEY, withContext } from '../utils/form-context'

const props = defineProps<FieldProps<TSchema>>()
defineSlots<FieldSlots<TSchema>>()

const formID = inject(CURRENT_FORM_ID_KEY)

if (!formID) {
  throw new Error('Field must be used inside a Form component with a valid form ID')
}

const { errors: _errors, dirtyFields, mode, validate, validateOn, touchedFields, validateField, getFieldErrors, touchField, dirtyField } = withContext<TSchema>(formID)

/** @see {@link FieldContext.errors} */
const errors = computed(() => getFieldErrors(props.name))

/** @see {@link FieldContext.isTouched} */
const isTouched = computed(() => touchedFields.value.has(props.name))

/** @see {@link FieldContext.isDirty} */
const isDirty = computed(() => dirtyFields.value.has(props.name))

/** @see {@link FieldContext.isValid} */
const isValid = computed(() => _errors.value.length === 0)

/** @see {@link FieldContext.validate} */
async function _validate() {
  const result = await validateField(props.name)
  return result
}

/** @see {@link FieldContext.methods.onBlur} */
function onBlur() {
  touchField(props.name)
  if (mode === 'eager' || validateOn.includes('blur')) {
    validate()
  }
}

/** @see {@link FieldContext.methods.onChange} */
function onChange() {
  dirtyField(props.name)
  if (mode === 'eager' || validateOn.includes('change')) {
    validate()
  }
}

/** @see {@link FieldContext.methods.onInput} */
function onInput() {
  dirtyField(props.name)
  if (mode === 'eager' || validateOn.includes('input')) {
    validate()
  }
}

/** @see {@link FieldContext.methods.onFocus} */
function onFocus() {
  dirtyField(props.name)
  if (mode === 'eager' || validateOn.includes('focus')) {
    validate()
  }
}

/** @see {@link FieldContext} */
const context: FieldContext<TSchema> = {
  name: props.name,
  errors,
  isTouched,
  isDirty,
  isValid,
  validate: _validate,
  methods: {
    onBlur,
    onChange,
    onInput,
    onFocus,
  },
}

onMounted(async () => {
  await nextTick()

  if (validateOn.includes('mount')) {
    await validate()
  }

})
</script>

<template>
  <slot v-bind="context" />
</template>
