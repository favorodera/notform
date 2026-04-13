<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { NotMessageProps, NotMessageSlotProps, NotMessageSlots } from '../types/not-message'
import { useNotFormInstance } from '../utils/instance-utils'

defineSlots<NotMessageSlots>()
defineOptions({ inheritAttrs: false })

const attributes = useAttrs()
const props = withDefaults(defineProps<NotMessageProps>(), {
  as: 'span',
})


// INSTANCE


// Explicit :form prop takes priority over whatever NotForm ancestor provided
const form = useNotFormInstance(props.form)


// DERIVED
const message = computed(() => form.errorsMap.value[props.path])


// SLOT PROPS


const slotProps = computed<NotMessageSlotProps>(() => ({
  message: message.value,
  attributes,
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
