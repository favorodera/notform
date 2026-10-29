<script setup lang="ts" generic="TValue">
import type { FieldProps, FieldSlots } from '../types/field'

defineOptions({ inheritAttrs: false })

defineSlots<FieldSlots<TValue>>()

const props = defineProps<FieldProps<TValue>>()
</script>

<template>
  <slot
    :field="props.handler"
    v-bind="$attrs"
  />
</template>
