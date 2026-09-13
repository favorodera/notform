<script setup lang="ts">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import { provideNotFormInstance } from '../utils/instance'

// Setup

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps>()

provideNotFormInstance(props.form)
</script>

<template>
  <form @reset.prevent>
    <slot />
  </form>
</template>
