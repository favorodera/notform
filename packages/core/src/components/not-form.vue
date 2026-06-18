<script setup lang="ts">
import { useAttrs } from 'vue'
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import { provideNotFormInstance } from '../utils/instance-utils'

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps>()

const attributes = useAttrs()

provideNotFormInstance(props.form)
</script>

<template>
  <form v-bind="attributes">
    <slot />
  </form>
</template>
