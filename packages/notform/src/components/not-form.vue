<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed, provide, useAttrs } from 'vue'
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { CURRENT_NOT_FORM_ID_KEY, withContext } from '../utils/not-form-context'

/**
 * Provides form context and a structural wrapper for form fields.
 * @template TSchema The validation schema type derived from ObjectSchema.
 */
const props = withDefaults(defineProps<NotFormProps<TSchema>>(), {
  asChild: false,
  as: 'form',
})

/**
 * Slots provided by the Form component.
 */
defineSlots<NotFormSlots<TSchema>>()

// Retrieve attributes from the parent component
const attributes = useAttrs()

// Access the form context by its unique identifier
const form = withContext<TSchema>(props.id)

// Merge attributes with id, ensuring props.id takes precedence
const mergedAttrs = computed(() => ({
  ...attributes,
  id: form.id,
}))

// Provide the current form ID to child components
provide(CURRENT_NOT_FORM_ID_KEY, form.id)
</script>

<template>
  <template v-if="props.asChild">
    <slot v-bind="form" />
  </template>

  <component v-else :is="props.as" v-bind="mergedAttrs">
    <slot v-bind="form" />
  </component>
</template>
