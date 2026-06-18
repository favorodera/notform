<script setup lang="ts">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import { provideNotFormInstance } from '../utils/instance-utils'

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps>()

provideNotFormInstance(props.form)
</script>

<template>
  <form>
    <slot />
  </form>
</template>
