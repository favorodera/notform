<script setup lang="ts" generic="TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1">
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotArrayFieldProps, NotArrayFieldSlots } from '../types/not-array-field'
import type { ObjectSchema } from '../types/shared'
import { useNotArrayField } from '../composables/use-not-array-field'

// #region Setup

// Renderless wrapper: forwards props to the composable and exposes its result through the slot.

defineSlots<NotArrayFieldSlots<TSchema, TItemSchema>>()

/** Inputs forwarded to the array-field composable. */
const props = defineProps<NotArrayFieldProps<TSchema, TItemSchema>>()

/** State and actions exposed through the default slot. */
const arrayField = useNotArrayField<TSchema, TItemSchema>(props)

// #endregion
</script>

<template>
  <slot v-bind="arrayField" />
</template>
