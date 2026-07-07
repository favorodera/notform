<script setup lang="ts">
import { computed } from 'vue'
import type { NotMessageProps, NotMessageSlots } from '../types/not-message'
import { useNotFormInstance } from '../utils/instance'

defineOptions({
  inheritAttrs: false,
})

defineSlots<NotMessageSlots>()

const props = withDefaults(defineProps<NotMessageProps>(), {
  as: 'span',
})

const form = useNotFormInstance(props.form)

const message = computed(() => form.errorsMap.value[props.path])
</script>

<!-- eslint-disable vue/no-root-v-if -->
<template>
  <component
    :is="as"
    v-if="message"
    v-bind="$attrs"
  >
    <slot :message>
      {{ message }}
    </slot>
  </component>
</template>
