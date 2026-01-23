<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { provide } from 'vue'
import type { FormProps, FormSlots } from '../types/form'
import type { ObjectSchema } from '../types/shared'
import { CURRENT_FORM_ID_KEY, withContext } from '../utils/form-context'

/**
 * Provides form context and a structural wrapper for form fields.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
const props = defineProps<FormProps<TSchema>>()

/**
 * Slots provided by the Form component.
 */
defineSlots<FormSlots<TSchema>>()

// Access the form context by its unique identifier
const form = withContext<TSchema>(props.id)

// Provide the current form ID to child components
provide(CURRENT_FORM_ID_KEY, props.id)
</script>

<template>
  <form v-bind="$attrs" :id="props.id">
    <slot v-bind="form" />
  </form>
</template>
