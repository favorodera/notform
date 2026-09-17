<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  value: z.string().min(4, 'At least 4 characters'),
})

const form = useNotForm({
  initialValues: { value: '' },
  schema,
})

const validationMode = ref<'eager' | 'lazy'>('eager')
</script>

<template>
  <NotForm
    :form
    data-demo-form
    @submit="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events, path }"
      path="value"
      :validation-mode="validationMode"
      :validate-on="{ onInput: true }"
    >
      <div data-demo-field>
        <div
          data-demo-field
          class="flex-row"
        >
          <label
            :for="path"
            class="capitalize"
          >
            {{ validationMode }} Mode
          </label>

          <Switch
            v-model:model-value="validationMode"
            size="sm"
            true-value="eager"
            false-value="lazy"
          />
        </div>

        <input
          :id="path"
          v-model="form.values.value"
          placeholder="Type then blur…"
          v-bind="events"
        >

        <NotMessage
          :path="path"
          data-demo-message
        />
      </div>
    </NotField>
  </NotForm>
</template>
