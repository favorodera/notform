<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string('Invalid input').min(8, 'At least 8 characters'),
})

const form = useForm({
  async onSubmit(data) {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    toast.add({
      color: 'success',
      description: h('pre', JSON.stringify(data, undefined, 2)),
      title: 'Form submitted successfully',
    })
  },
  schema,
})
</script>

<template>
  <Form :form="form">
    <Field
      v-slot="{ events, path }"
      path="email"
    >
      <div>
        <label :for="path">
          Email
        </label>

        <input
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="jane@example.com"
          v-bind="events"
          autocomplete="email"
        >

        <Error :path="path" />
      </div>
    </Field>

    <Field
      v-slot="{ events, path }"
      path="password"
    >
      <div>
        <label :for="path">Password</label>

        <input
          :id="path"
          v-model="form.values.password"
          type="password"
          placeholder="Min. 8 characters"
          v-bind="events"
          autocomplete="current-password"
        >

        <Error :path="path" />
      </div>
    </Field>

    <div class="flex-row">
      <Button
        type="reset"
        :disabled="form.isSubmitting"
        block
        variant="soft"
        label="Reset"
      />

      <Button
        type="submit"
        block
        :disabled="form.isSubmitting"
        :loading="form.isSubmitting"
        :label="form.isSubmitting ? 'Submitting...' : 'Submit'"
      />
    </div>
  </Form>
</template>
