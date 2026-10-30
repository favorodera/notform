<script setup lang="ts" generic="TValue">
import type { FieldProps, FieldSlots } from '../types/field'

/**
 * `<Field>`: a headless wrapper that hands one form field to its slot.
 *
 * It renders no markup of its own; you decide what the input looks like.
 * @example
 * <Field v-slot="{ field }" :field="form.field('email')">
 *   <input v-model="field.model">
 * </Field>
 */

// no root element of its own, so attributes are forwarded to the slot instead of a DOM node
defineOptions({ inheritAttrs: false })

defineSlots<FieldSlots<TValue>>()

/** `props.field` is the field created by `form.field('some.path')`. */
const props = defineProps<FieldProps<TValue>>()
</script>

<template>
  <!-- expose the field to the slot, plus any extra attributes as slot props -->
  <slot
    :field="props.field"
    v-bind="$attrs"
  />
</template>
