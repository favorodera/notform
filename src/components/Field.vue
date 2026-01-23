<script setup lang="ts">
import type { FieldContext, FieldProps, FieldSlots } from '../types/field'
import { computed, inject, nextTick, onMounted, reactive } from 'vue'
import { CURRENT_FORM_ID_KEY, withContext } from '../utils/form-context'

/**
 * Component for individual form fields.
 * Manages field-level state, validation triggers, and events.
 */
const props = defineProps<FieldProps>()

/**
 * Slots provided by the Field component.
 */
defineSlots<FieldSlots>()

// Retrieve the ID of the form this field belongs to
const formID = inject(CURRENT_FORM_ID_KEY)

if (!formID) {
  throw new Error('Field must be used inside a Form component')
}

// Access parent form context
const {
  mode,
  validateOn,
  touchedFields,
  dirtyFields,
  validateField,
  getFieldErrors,
  touchField,
  dirtyField,
} = withContext(formID)

/**
 * Triggers validation for this specific field.
 * @returns Promise resolving to the validation result.
 */
async function validate() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await validateField(props.name as any)
}

/**
 * Collection of event handlers for common field interactions.
 */
const methods = {
  /** Handles focus loss */
  onBlur: function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    touchField(props.name as any)
    if (mode === 'eager' || validateOn.includes('blur')) validate()
  },
  /** Handles value commitment */
  onChange: function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dirtyField(props.name as any)
    if (mode === 'eager' || validateOn.includes('change')) validate()
  },
  /** Handles streaming input */
  onInput: function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dirtyField(props.name as any)
    if (mode === 'eager' || validateOn.includes('input')) validate()
  },
  /** Handles field focus */
  onFocus: function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dirtyField(props.name as any)
    if (mode === 'eager' || validateOn.includes('focus')) validate()
  },
}

/**
 * The consolidated reactive state exposed to the component's template.
 */
const context = reactive({
  /** Path identifier */
  name: computed(() => props.name),
  /** First error message if any */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: computed(() => getFieldErrors(props.name as any).map(error => error.message)),
  /** Interacted status */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isTouched: computed(() => touchedFields.value.has(props.name as any)),
  /** Modification status */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isDirty: computed(() => dirtyFields.value.has(props.name as any)),
  /** Current validity status */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isValid: computed(() => getFieldErrors(props.name as any).length === 0),
  /** Manual validation trigger */
  validate,
  /** Interaction methods */
  methods,
}) as FieldContext

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
