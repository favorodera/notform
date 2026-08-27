<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  value: z.string().min(4, 'At least 4 characters'),
})

const eagerForm = useNotForm({
  initialValues: { value: '' },
  schema,
})

const lazyForm = useNotForm({
  initialValues: { value: '' },
  schema,
  validationMode: 'lazy',
})
</script>

<template>
  <div data-demo-form>
    <NotField
      v-slot="{ events, path }"
      path="value"
      :form="eagerForm"
    >
      <div data-demo-field>
        <label :for="`eager-${path}`">
          Eager Mode (Default)
        </label>

        <input
          :id="`eager-${path}`"
          v-model="eagerForm.values.value"
          placeholder="Type then blur…"
          v-bind="events"
        >

        <NotMessage
          :form="eagerForm"
          :path="path"
          data-demo-message
        />
      </div>
    </NotField>

    <NotField
      v-slot="{ events, path }"
      path="value"
      :form="lazyForm"
    >
      <div data-demo-field>
        <label
          :for="`lazy-${path}`"
        >
          Lazy Mode
        </label>

        <input
          :id="`lazy-${path}`"
          v-model="lazyForm.values.value"
          placeholder="Type then blur…"
          v-bind="events"
        >

        <NotMessage
          :form="lazyForm"
          :path="path"
          data-demo-message
        />
      </div>
    </NotField>
  </div>
</template>
