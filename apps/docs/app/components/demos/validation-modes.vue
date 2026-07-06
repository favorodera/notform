<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  value: z.string().min(4, 'At least 4 characters'),
})

const eagerForm = useNotForm({
  initialValues: { value: '' },
  schema,
  validationMode: { eager: true },
})

const lazyForm = useNotForm({
  initialValues: { value: '' },
  schema,
  validationMode: { eager: false, lazy: true },
})
</script>

<template>
  <div class="form">
    <NotField
      v-slot="{ events, isValid, path }"
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
            :class="{
              'ring-success':isValid
            }"
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
      v-slot="{ events, isValid, path }"
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
            :class="{
              'ring-success':isValid
            }"
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
