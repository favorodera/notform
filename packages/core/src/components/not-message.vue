<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed } from 'vue'
import type { NotMessageProps, NotMessageSlots } from '../types/not-message'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../composables/use-not-form-instance'

// #region Setup

// Not renderless: when the field has an error, renders its first message using
// the element selected by `as` (a <span> by default). The slot receives the
// message, or it is rendered as text. Binding $attrs explicitly forwards
// attributes not declared as props to the rendered element.
defineOptions({
  inheritAttrs: false,
})

defineSlots<NotMessageSlots>()

const props = withDefaults(defineProps<NotMessageProps<TSchema>>(), {
  as: 'span',
})

const form = useNotFormInstance<TSchema>(props.form)

// #endregion

// #region State

const message = computed(() => form.getFieldErrors(props.path)[0]?.message)

// #endregion
</script>

<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
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
