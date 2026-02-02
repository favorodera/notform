<script lang="ts" setup generic="TSchema extends ObjectSchema">
import { type NotMessageContext, type NotMessageProps, type NotMessageSlots } from '../types/not-message'
import type { ObjectSchema } from '../types/shared'
import { computed, inject, reactive, useAttrs } from 'vue'
import { CURRENT_NOT_FORM_ID_KEY, withContext } from '../utils/not-form-context'

/**
 * Displays validation error messages for a specific form field.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
const props = withDefaults(defineProps<NotMessageProps>(), {
  as: 'span',
})

/**
 * Slots provided by the Message component.
 */
defineSlots<NotMessageSlots>()

// Retrieve attributes from the parent component
const attributes = useAttrs()

// Retrieve the ID of the form this message belongs to
const formID = inject(CURRENT_NOT_FORM_ID_KEY)

if (!formID) {
  throw new Error('Message must be used inside a NotForm component')
}

// Access parent form context
const { getFieldErrors } = withContext<TSchema>(formID)

/**
 * The reactive state provided to the component's slot.
 */
const context = reactive({
  /** The first identified error message for the field */
  message: computed(() => getFieldErrors(props.name)
    .map(error => error.message)[0]),
}) as NotMessageContext

// Merge attributes with context, ensuring props.id takes precedence
const mergedAttrs = computed(() => ({
  ...context,
  attributes,
}))
</script>

<template>
  <slot v-bind="mergedAttrs">
    <component
      :is="props.as"
      v-bind="attributes"
      v-show="context.message"
    >
      {{ context.message }}
    </component>
  </slot>
</template>
