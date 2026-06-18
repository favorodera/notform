<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const form = useNotForm({
  initialValues: { email: '' },
  onSubmit: async (values) => {
    // Simulate a server 409 — email taken
    await new Promise((resolve) => {
      setTimeout(resolve, 600)
    })

    if (values.email === 'taken@example.com') {
      form.setError({
        message: 'This email is already registered',
        path: [{ key: 'email' }],
      })

      return
    }

    toast.add({
      color: 'success',
      description: 'Account created successfully',
      title: 'Success',
    })
    form.reset()
  },
  schema: z.object({
    email: z.email('Enter a valid email'),
  }),
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
          placeholder="Try taken@example.com"
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
      :loading="form.isSubmitting.value"
      block
      color="primary"
      variant="subtle"
    >
      Create account
    </UButton>
  </NotForm>
</template>
