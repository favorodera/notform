<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed } from 'vue'
import type { NotMessageProps, NotMessageSlots } from '../types/not-message'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../composables/use-not-form-instance'

defineOptions({
  inheritAttrs: false,
})

defineSlots<NotMessageSlots>()

const props = withDefaults(defineProps<NotMessageProps<TSchema>>(), {
  as: 'span',
})

const form = useNotFormInstance(props.form)

/** First active validation error message for the specified field path. */
const message = computed(() => form.getFieldErrors(props.path)[0]?.message)
</script>

<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
  <!-- Render root element only when an active error message exists -->
  <component
    :is="as"
    v-if="message"
    v-bind="$attrs"
  >
    <slot :message="message">
      {{ message }}
    </slot>
  </component>
</template>
