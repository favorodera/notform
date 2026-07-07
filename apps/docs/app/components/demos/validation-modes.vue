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
  <div class="form">
    <NotField
      v-slot="{ events, path }"
      path="value"
      :form="eagerForm"
    >
      <div class="field">
        <label
          class="label"
          :for="path"
        >
          Eager

          <input
            v-bind="events"
            :id="path"
            v-model="eagerForm.values.value"
            placeholder="Type then blur…"
            class="input"
            :name="path"
          >
        </label>

        <NotMessage
          :form="eagerForm"
          :path="path"
          class="message"
        />
      </div>
    </NotField>

    <NotField
      v-slot="{ events, path }"
      path="value"
      :form="lazyForm"
    >
      <div class="field">
        <label
          class="label"
          :for="path"
        >
          Lazy

          <input
            v-bind="events"
            :id="path"
            v-model="lazyForm.values.value"
            placeholder="Type then blur…"
            class="input"
            :name="path"
          >
        </label>

        <NotMessage
          :form="lazyForm"
          :path="path"
          class="message"
        />
      </div>
    </NotField>
  </div>
</template>
