<script setup lang="ts">
import type { NotFieldContext, NotFieldProps, NotFieldSlots } from '../types/not-field'
import { computed, inject, nextTick, onMounted, reactive } from 'vue'
import { CURRENT_NOT_FORM_ID_KEY, withContext } from '../utils/not-form-context'

/**
 * Component for individual form fields.
 * Manages field-level state, validation triggers, and events.
 */
const props = defineProps<NotFieldProps>()

/**
 * Slots provided by the NotField component.
 */
defineSlots<NotFieldSlots>()

// Retrieve the ID of the form this field belongs to
const formID = inject(CURRENT_NOT_FORM_ID_KEY)

if (!formID) {
  throw new Error('NotField must be used inside a NotForm component')
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
    touchField(props.name)
    if (mode === 'eager' || validateOn.includes('blur')) validate()
  },
  /** Handles value commitment */
  onChange: function () {
    dirtyField(props.name)
    if (mode === 'eager' || validateOn.includes('change')) validate()
  },
  /** Handles streaming input */
  onInput: function () {
    dirtyField(props.name)
    if (mode === 'eager' || validateOn.includes('input')) validate()
  },
  /** Handles field focus */
  onFocus: function () {
    dirtyField(props.name)
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
}) as NotFieldContext

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
