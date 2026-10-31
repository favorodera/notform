<script setup lang="ts">
import { computed } from 'vue'
import type { FieldErrorProps, FieldErrorSlots } from '../types/field-error'

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
