<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { FieldContext, FieldProps, FieldSlots } from '../types/field'
import type { ObjectSchema } from '../types/shared'
import { computed, inject, nextTick, onMounted, reactive } from 'vue'
import { CURRENT_FORM_ID_KEY, withContext } from '../utils/form-context'

const props = defineProps<FieldProps<TSchema>>()
defineSlots<FieldSlots<TSchema>>()

const formID = inject(CURRENT_FORM_ID_KEY)

if (!formID) {
  throw new Error('Field must be used inside a Form component with a valid form ID')
}

const {
  mode,
  validateOn,
  touchedFields,
  dirtyFields,
  validateField,
  getFieldErrors,
  touchField,
  dirtyField,
} = withContext<TSchema>(formID)

/** @see {@link FieldContext.validate} */
async function validate() {
  return await validateField(props.name)
}

/** @see {@link FieldContext.methods} */
const methods = {
  onBlur: function () {
    touchField(props.name)
    if (mode === 'eager' || validateOn.includes('blur')) {
      validate()
    }
  },
  onChange: function () {
    dirtyField(props.name)
    if (mode === 'eager' || validateOn.includes('change')) {
      validate()
    }
  },
  onInput: function () {
    dirtyField(props.name)
    if (mode === 'eager' || validateOn.includes('input')) {
      validate()
    }
  },
  onFocus: function () {
    dirtyField(props.name)
    if (mode === 'eager' || validateOn.includes('focus')) {
      validate()
    }
  },
}

/** @see {@link FieldContext} */
const context = reactive({
  name: computed(() => props.name),
  errors: computed(() => getFieldErrors(props.name).map(error => error.message)),
  isTouched: computed(() => touchedFields.value.has(props.name)),
  isDirty: computed(() => dirtyFields.value.has(props.name)),
  isValid: computed(() => getFieldErrors(props.name).length === 0),
  validate,
  methods,
}) as FieldContext<TSchema>

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
