<script setup lang="ts" generic="TSchema extends StandardSchemaV1">
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormProps, FormSlots } from '../types/form'

defineOptions({ inheritAttrs: false })

defineSlots<FormSlots>()

const props = defineProps<FormProps<TSchema>>()
</script>

<template>
  <form
    v-bind="$attrs"
    novalidate
  >
    <slot />
  </form>
</template>
