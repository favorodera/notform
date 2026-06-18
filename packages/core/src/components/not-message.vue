<script setup lang="ts">
import { computed } from 'vue'
import type { NotMessageProps, NotMessageSlots } from '../types/not-message'
import { useNotFormInstance } from '../utils/instance-utils'

defineSlots<NotMessageSlots>()

const props = defineProps<NotMessageProps>()

const form = useNotFormInstance(props.form)

const message = computed(() => form.errorsMap.value[props.path])
</script>

<template>
  <slot :message>
    <span v-if="message">
      {{message}}
    </span>
  </slot>
</template>
