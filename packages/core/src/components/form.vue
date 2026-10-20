<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { FormProps, FormSlots } from '../types/form'
import type { ObjectSchema } from '../types/shared'
import { useFormInstance } from '../composables/use-form-instance'
import { provideFormInstance } from '../helpers/instance'

defineOptions({
  inheritAttrs: false,
})

defineSlots<FormSlots>()

const props = defineProps<FormProps<TSchema>>()
const form = useFormInstance<TSchema>(props.form)

provideFormInstance<TSchema>(form)
</script>

<template>
  <form
    v-bind="$attrs"
    @submit="form.submit"
    @reset.prevent="form.reset()"
  >
    <slot />
  </form>
</template>
