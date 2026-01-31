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
  return await validateField(props.name)
}

/** @see {@link NotFieldContext.methods} */
const methods: NotFieldContext['methods'] = {
  onBlur: function () {
    touchField(props.name)
   
    // Blur must be in validateOn for either mode to use it
    if (!validateOn.includes('blur')) return

    validate()
  },

  onChange: function () {
    dirtyField(props.name)

    // Change must be in validateOn
    if (!validateOn.includes('change')) return
    
    // Lazy: never validates on change
    if (mode === 'lazy') return

    // Eager: validates on change if field has error
    if (mode === 'eager' && getFieldErrors(props.name).length > 0) {
      validate()
    }
  },

  onInput: function () {
    dirtyField(props.name)

    // Input must be in validateOn
    if (!validateOn.includes('input')) return
    
    // Lazy: never validates on input
    if (mode === 'lazy') return
    
    // Eager: validates on input if field has error
    if (mode === 'eager' && getFieldErrors(props.name).length > 0) {
      validate()
    }
  },
  onFocus: function () {
    // Focus does NOT mark as touched or dirty
    // Touched happens on BLUR (when leaving the field)
    // Dirty happens on actual value CHANGE
    
    // Focus must be in validateOn
    if (!validateOn.includes('focus')) return
    
    validate()
  },
}

/**
 * The consolidated reactive state exposed to the component's template.
 */
const context = reactive({
  /** Path identifier */
  name: computed(() => props.name),
  /** First error message if any */
  errors: computed(() => getFieldErrors(props.name).map(error => error.message)),
  /** Interacted status */
  isTouched: computed(() => touchedFields.value.has(props.name)),
  /** Modification status */
  isDirty: computed(() => dirtyFields.value.has(props.name)),
  /** Current validity status */
  isValid: computed(() => getFieldErrors(props.name).length === 0),
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
