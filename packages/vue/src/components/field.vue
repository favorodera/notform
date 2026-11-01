<script setup lang="ts" generic="TValue">
import type { FieldProps, FieldSlots } from '../types/field'

/**
 * `<Field>`: a headless wrapper that hands one field to its slot. Renders no markup.
 * Works with `form.field(path)` and with array items.
 * @example
 * <Field v-slot="{ field }" :field="form.field('email')">
 *   <input v-model="field.model" v-bind="field.events">
 * </Field>
 */

// no root element, so attributes are forwarded to the slot instead of a DOM node
defineOptions({ inheritAttrs: false })

defineSlots<FieldSlots<TValue>>()

/** `props.field` is the field created by `form.field('some.path')`, or an array item. */
const props = defineProps<FieldProps<TValue>>()
</script>

<template>
  <slot
    :field="props.field"
    v-bind="$attrs"
  />
</template>
