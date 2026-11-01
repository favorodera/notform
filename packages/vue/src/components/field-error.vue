<script setup lang="ts">
import { computed } from 'vue'
import type { FieldErrorProps, FieldErrorSlots } from '../types/field-error'

/**
 * `<FieldError>`: shows the first error message of a field, an array field, an array item,
 * or a plain list of issues. Renders nothing when there is no error.
 * @example
 * <FieldError :errors="field" />
 */

defineOptions({ inheritAttrs: false })

defineSlots<FieldErrorSlots>()

const props = withDefaults(defineProps<FieldErrorProps>(), {
  as: 'span',
})

const message = computed(() => {
  if (Array.isArray(props.errors)) {
    return props.errors[0]?.message
  }

  return props.errors?.errors?.[0]?.message
})
</script>

<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
  <component
    :is="props.as"
    v-if="message"
    v-bind="$attrs"
  >
    <slot :message="message">
      {{ message }}
    </slot>
  </component>
</template>
