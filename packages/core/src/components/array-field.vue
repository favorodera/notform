<script setup lang="ts" generic="TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1">
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ArrayFieldProps, ArrayFieldSlots } from '../types/array-field'
import type { ObjectSchema } from '../types/shared'
import { useArrayField } from '../composables/use-array-field'

// #region Setup

// Renderless wrapper: forwards props to the composable and exposes its result through the slot.

defineSlots<ArrayFieldSlots<TSchema, TItemSchema>>()

/** Inputs forwarded to the array-field composable. */
const props = defineProps<ArrayFieldProps<TSchema, TItemSchema>>()

/** State and actions exposed through the default slot. */
const arrayField = useArrayField<TSchema, TItemSchema>(props)

// #endregion
</script>

<template>
  <slot v-bind="arrayField" />
</template>
