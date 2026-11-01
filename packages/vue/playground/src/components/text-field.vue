<script setup lang="ts">
import type { FieldInstance } from '../../../src/types/field'
import { Field, FieldError } from '../../../src'
import FieldFlags from './field-flags.vue'

// One labelled text input with its error and debug flags: the markup every field here repeats.
const props = withDefaults(defineProps<{
  field: FieldInstance<string | undefined>
  label: string
  type?: string
}>(), {
  type: 'text',
})
</script>

<template>
  <Field
    v-slot="{ field: bound }"
    :field="props.field"
  >
    <p>
      <label :for="bound.path">{{ props.label }}</label>

      <input
        v-bind="bound.events"
        :id="bound.path"
        v-model="bound.model"
        :type="props.type"
        :name="bound.path"
      >

      <FieldError
        :errors="bound"
        class="error"
      />

      <FieldFlags :field="bound" />
    </p>
  </Field>
</template>
