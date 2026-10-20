<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  value: z.string().min(4, 'At least 4 characters'),
})

const form = useForm({
  initialValues: { value: '' },
  schema,
})

const validationMode = ref<'eager' | 'lazy'>('eager')
</script>

<template>
  <Form
    :form
    data-demo-form
    @submit="form.submit"
    @reset="form.reset()"
  >
    <Field
      v-slot="{ events, path }"
      path="value"
      :validation-mode="validationMode"
      :validate-on="{ onInput: true }"
    >
      <div data-demo-field>
        <div
          data-demo-field
          class="flex-row justify-between"
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

        <Error
          :path="path"
          data-demo-message
        />
      </div>
    </Field>
  </Form>
</template>
