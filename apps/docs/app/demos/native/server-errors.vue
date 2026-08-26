<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const form = useNotForm({
  initialValues: { email: '' },
  onSubmit: async (values) => {
    // Simulate a server 409 — email taken
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    if (values.email === 'taken@example.com') {
      form.setError({
        message: 'This email is already registered',
        path: ['email'],
      })
      return
    }

    toast.add({
      color: 'success',
      title: `Account created successfully for: ${values.email}`,
    })
  },
  schema: z.object({
    email: z.email('Enter a valid email'),
  }),
})
</script>

<template>
  <NotForm
    :form="form"
    data-demo-form
    @submit="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events, path }"
      path="email"
    >
      <div data-demo-field>
        <label :for="path">
          Email Address
        </label>

        <input
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="Try taken@example.com"
          v-bind="events"
        >

        <NotMessage
          :path="path"
          data-demo-message
        />
      </div>
    </NotField>

    <div
      data-demo-field
      class="flex-row"
    >
      <Button
        type="reset"
        :disabled="form.isSubmitting.value"
        block
        variant="soft"
        label="Reset"
      />

      <Button
        type="submit"
        block
        :disabled="form.isSubmitting.value"
        :loading="form.isSubmitting.value"
        :label="form.isSubmitting.value ? 'Submitting...' : 'Submit'"
      />
    </div>
  </NotForm>
</template>
