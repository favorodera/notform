<script setup lang="ts" generic="TItem">
import type { ArrayFieldProps, ArrayFieldSlots } from '../types/array-field'

/**
 * `<ArrayField>`: a headless wrapper that hands one array field to its slot. Renders no markup.
 * @example
 * <ArrayField v-slot="{ arrayField }" :array-field="form.arrayField('tags')">
 *   <Field v-for="item in arrayField.items" :key="item.id" v-slot="{ field }" :field="item">
 *     <input v-model="field.model" v-bind="field.events">
 *     <button type="button" @click="item.remove()">Remove</button>
 *   </Field>
 *   <button type="button" @click="arrayField.append('')">Add</button>
 * </ArrayField>
 */

// no root element, so attributes are forwarded to the slot instead of a DOM node
defineOptions({ inheritAttrs: false })

defineSlots<ArrayFieldSlots<TItem>>()

/** `props.arrayField` is the field created by `form.arrayField('some.path')`. */
const props = defineProps<ArrayFieldProps<TItem>>()
</script>

<template>
  <slot
    :array-field="props.arrayField"
    v-bind="$attrs"
  />
</template>
