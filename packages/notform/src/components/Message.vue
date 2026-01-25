<script lang="ts" setup generic="TSchema extends ObjectSchema">
import { type MessageContext, type MessageProps, type MessageSlots } from '../types/message'
import type { ObjectSchema } from '../types/shared'
import { computed, inject, reactive } from 'vue'
import { CURRENT_FORM_ID_KEY, withContext } from '../utils/form-context'

/**
 * Displays validation error messages for a specific form field.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
const props = defineProps<MessageProps<TSchema>>()

/**
 * Slots provided by the Message component.
 */
defineSlots<MessageSlots>()

// Retrieve the ID of the form this message belongs to
const formID = inject(CURRENT_FORM_ID_KEY)

if (!formID) {
  throw new Error('Message must be used inside a Form component')
}

// Access parent form context
const { getFieldErrors } = withContext<TSchema>(formID)

/**
 * The reactive state provided to the component's slot.
 */
const context = reactive({
  /** The first identified error message for the field */
  message: computed(() => getFieldErrors(props.name).map(error => error.message)[0]),
}) as MessageContext
</script>

<template>
  <slot v-bind="context">
    <span v-show="context.message">{{ context.message }}</span>
  </slot>
</template>
