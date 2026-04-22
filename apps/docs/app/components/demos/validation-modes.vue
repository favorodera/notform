<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  value: z.string().min(4, 'At least 4 characters'),
})

const eagerForm = useNotForm({
  schema,
  initialValues: { value: '' },
  validationMode: { eager: true },
})

const lazyForm = useNotForm({
  schema,
  initialValues: { value: '' },
  validationMode: { eager: false, lazy: true },
})
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-4">
    <!-- Eager -->
    <NotField
      v-slot="{ events, isValid, path }"
      path="value"
      :form="eagerForm"
    >

      <div class="field">
        <p class="label">
          Eager
        </p>

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

        <NotMessage
          :form="eagerForm"
          :path="path"
          class="message"
        />
      </div>
    </NotField>


    <!-- Lazy -->
    <NotField
      v-slot="{ events, isValid, path }"
      path="value"
      :form="lazyForm"
    >
      <div class="field">
        <p class="label">
          Lazy
        </p>
      
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
        <NotMessage
          :form="lazyForm"
          :path="path"
          class="message"
        />
      </div>
    </NotField>

  </div>
</template>
