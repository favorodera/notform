<script setup lang="ts" generic="TSchema extends ObjectSchema">
import type { NotFieldProps, NotFieldSlots } from '../types/not-field'
import type { ObjectSchema } from '../types/shared'
import { useNotField } from '../composables/use-not-field'

// #region Setup

// Fully renderless, like <NotArrayField>. validationMode defaults to 'eager'
// here; useNotField applies the { onBlur: true, onChange: true } validateOn
// defaults internally, merged with whatever is passed through the
// validateOn prop.

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
