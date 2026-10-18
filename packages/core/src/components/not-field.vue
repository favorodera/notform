<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotField } from '../composables/use-not-field'

// #region Setup

// Renderless wrapper; defaults to eager validation and delegates trigger merging to the composable.

defineSlots<NotFieldSlots>()

/** Field inputs with the component's default validation mode applied. */
const props = withDefaults(defineProps<NotFieldProps<TSchema>>(), {
  debounce: undefined,
  validateOn: undefined,
  validationMode: 'eager',
})

/** State and event handlers exposed through the default slot. */
const field = useNotField<TSchema>(props)

// #endregion
</script>

<template>
  <slot v-bind="field" />
</template>
