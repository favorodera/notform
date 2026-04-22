<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const form = useNotForm({
  schema: z.object({
    name: z.string().min(2, 'Must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
  }),
  initialValues: { name: '', email: '' },
  onSubmit: async () => {
    await new Promise(resolve => setTimeout(resolve, 600))

    toast.add({
      title: 'Form submitted successfully',
      color: 'success',
    })

    setTimeout(() => {
      form.reset()
    }, 2000)

  },
})
</script>

<template>
  <NotForm
    :form="form"
    class="form"
    @submit="form.submit"
  >
    <NotField
      v-slot="{ events, path }"
      path="name"
    >
      <div class="field">
        <label
          class="label"
          :for="path"
        >
          Name
        </label>
        <input
          v-bind="events"
          :id="path"
          v-model="form.values.name"
          placeholder="Jane"
          class="input"
        >
        <NotMessage
          :path="path"
          class="message"
        />
      </div>
    </NotField>

    <NotField
      v-slot="{ events, path }"
      path="email"
    >
      <div class="field">
        <label
          class="label"
          :for="path"
        >
          Email
        </label>
        <input
          v-bind="events"
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="jane@example.com"
          class="input"
        >
        <NotMessage
          :path="path"
          class="message"
        />
      </div>
    </NotField>

    <UButton
      type="submit"
      block
      color="primary"
      variant="subtle"
    >
      Submit
    </UButton>

    <p class="text-sm text-muted">
      Blur a field or submit to see error messages appear.
    </p>
  </NotForm>
</template>
