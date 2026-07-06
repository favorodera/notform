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
      description: `Email:${values.email}`,
      title: 'Account created successfully',
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
    class="form"
    @reset="form.reset()"
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

          <input
            v-bind="events"
            :id="path"
            v-model="form.values.email"
            type="email"
            placeholder="Try taken@example.com"
            class="input"
          >
        </label>

        <NotMessage
          :path="path"
          class="message"
        />
      </div>
    </NotField>

    <div class="field grid-cols-2">
      <Button
        type="reset"
        :disabled="form.isSubmitting.value"
        color="neutral"
        variant="subtle"
        block
      >
        Reset
      </Button>

      <Button
        type="submit"
        :loading="form.isSubmitting.value"
        block
      >
        Submit
      </Button>
    </div>
  </NotForm>
</template>
