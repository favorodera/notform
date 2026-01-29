<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { provide, useAttrs } from 'vue'
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { CURRENT_NOT_FORM_ID_KEY, withContext } from '../utils/not-form-context'

/**
 * Provides form context and a structural wrapper for form fields.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
const props = defineProps<NotFormProps<TSchema>>()

/**
 * Slots provided by the Form component.
 */
defineSlots<NotFormSlots<TSchema>>()

// Retrieve attributes from the parent component
const attributes = useAttrs()

// Access the form context by its unique identifier
const form = withContext<TSchema>(props.id)

// Provide the current form ID to child components
provide(CURRENT_NOT_FORM_ID_KEY, props.id)
</script>

<template>
  <form v-bind="attributes" :id="props.id">
    <slot v-bind="form" />
  </form>
</template>
