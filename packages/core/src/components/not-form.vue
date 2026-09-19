<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFormProps, NotFormSlots } from '../types/not-form'
import type { ObjectSchema } from '../types/shared'
import { provideNotFormInstance } from '../composables/use-not-form-instance'

// #region Setup

defineSlots<NotFormSlots>()

const props = defineProps<NotFormProps<TSchema>>()

provideNotFormInstance<TSchema>(props.form)

// #endregion
</script>

<template>
  <form @reset.prevent>
    <slot />
  </form>
</template>
