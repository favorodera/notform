<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { provideNotFormInstance } from '../composables/use-not-form-instance'

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps<TSchema>>()

// Provide form instance to all descendant components
provideNotFormInstance<TSchema>(props.form)
</script>

<template>
  <!-- Native form element with default reset prevention -->
  <form @reset.prevent>
    <slot />
  </form>
</template>
