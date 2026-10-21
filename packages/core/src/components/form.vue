<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { FormProps, FormSlots } from '../types/form'
import type { ObjectSchema } from '../types/shared'
import { useFormInstance } from '../composables/use-form-instance'
import { provideFormInstance } from '../helpers/instance'

// Preserve native form attributes while handling submit and reset ourselves.
defineOptions({
  inheritAttrs: false,
})

defineSlots<FormSlots>()

/** Form instance supplied to descendant field components. */
const props = defineProps<FormProps<TSchema>>()

/** Resolved form instance provided to descendants. */
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
