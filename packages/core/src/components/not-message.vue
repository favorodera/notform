<script setup lang="ts" generic="TSchema extends ObjectSchema">
import { computed } from 'vue'
import type { NotMessageProps, NotMessageSlots } from '../types/not-message'
import type { ObjectSchema } from '../types/shared'
import { useNotFormInstance } from '../composables/use-not-form-instance'

// #region Setup

// Renders the first field error through the selected element or default slot, forwarding undeclared attributes.
defineOptions({
  inheritAttrs: false,
})

defineSlots<NotMessageSlots>()

/** Field path, form instance, and rendered element configuration. */
const props = withDefaults(defineProps<NotMessageProps<TSchema>>(), {
  as: 'span',
})

/** Resolved form instance, preferring the explicit prop over injection. */
const form = useNotFormInstance<TSchema>(props.form)

// #endregion

// #region State

/** First active error message at `path`, if present. */
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
