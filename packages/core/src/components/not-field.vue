<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotField } from '../composables/use-not-field'

// #region Setup

defineSlots<NotFieldSlots>()

const props = withDefaults(defineProps<NotFieldProps<TSchema>>(), {
  debounce: undefined,
  validateOn: undefined,
  validationMode: 'eager',
})

const field = useNotField<TSchema>(props)

// #endregion
</script>

<template>
  <slot v-bind="field" />
</template>
