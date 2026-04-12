<script setup lang="ts">
import { useAttrs } from 'vue'
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import { provideNotFormInstance } from '../utils/instance-utils'

const attributes = useAttrs()

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps>()


// CONTEXT


// Keyed by object reference — no string IDs, no clashes between multiple forms
provideNotFormInstance(props.form)
</script>

<template>
  <form v-bind="attributes">
    <slot />
  </form>
</template>
