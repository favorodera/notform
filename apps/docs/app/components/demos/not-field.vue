<script setup lang="ts">
import { z } from 'zod'

const form = useNotForm({
  initialValues: { email: '' },
  schema: z.object({
    email: z.email('Enter a valid email address'),
  }),
})
</script>

<template>
  <NotField
    v-slot="{ events, isTouched, isValid, isDirty, path }"
    :form="form"
    path="email"
  >
    <label
      class="label"
      :for="path"
    >

      <input
        :id="path"
        v-model="form.values.email"
        :name="path"
        type="email"
        placeholder="jane@example.com"
        v-bind="events"
        class="input"
      >

      <pre>{{ JSON.stringify({ isTouched, isValid, isDirty }, null, 2) }}</pre>
    </label>
  </NotField>
</template>
