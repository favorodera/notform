<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { NotMessageProps, NotMessageSlotProps, NotMessageSlots } from '../types/not-message'
import { useNotFormInstance } from '../utils/instance-utils'

defineOptions({
  inheritAttrs: false,
})

defineSlots<NotMessageSlots>()

const props = withDefaults(defineProps<NotMessageProps>(), {
  as: 'span',
})

const attributes = useAttrs()

const form = useNotFormInstance(props.form)

const message = computed(() => form.errorsMap.value[props.path])

const slotProps = computed<NotMessageSlotProps>(() => ({
  attributes,
  message: message.value,
}))
</script>

<template>
  <slot v-bind="slotProps">
    <component
      :is="props.as"
      v-bind="attributes"
      v-if="message"
    >
      {{ message }}
    </component>
  </slot>
</template>
