<script setup lang="ts" generic="TSchema extends ObjectSchema, TItemSchema extends StandardSchemaV1 = StandardSchemaV1">
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { NotArrayFieldProps, NotArrayFieldSlots } from '../types/not-array-field'
import type { ObjectSchema } from '../types/shared'
import { useNotArrayField } from '../composables/use-not-array-field'

// #region Setup

// Fully renderless: every prop is forwarded straight to useNotArrayField,
// and everything it returns is forwarded straight back out through the
// default slot below. This component owns no state of its own.

defineSlots<NotArrayFieldSlots<TSchema, TItemSchema>>()

const props = defineProps<NotArrayFieldProps<TSchema, TItemSchema>>()

const arrayField = useNotArrayField<TSchema, TItemSchema>(props)

// #endregion
</script>

<template>
  <slot v-bind="arrayField" />
</template>
