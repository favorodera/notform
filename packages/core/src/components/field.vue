<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { FieldProps, FieldSlots } from '../types/field'
import type { ObjectSchema } from '../types/shared'
import { useField } from '../composables/use-field'

// #region Setup

// Renderless wrapper; defaults to eager validation and delegates trigger merging to the composable.

defineSlots<FieldSlots>()

/** Field inputs with the component's default validation mode applied. */
const props = withDefaults(defineProps<FieldProps<TSchema>>(), {
  debounce: undefined,
  validateOn: undefined,
  validationMode: 'eager',
})

/** State and event handlers exposed through the default slot. */
const field = useField<TSchema>(props)

// #endregion
</script>

<template>
  <slot v-bind="field" />
</template>
