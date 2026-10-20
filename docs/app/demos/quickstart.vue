<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const schema = z.object({
  email: z.email('Enter a valid email'),
  name: z.string('Invalid input').min(1, 'Name is required'),
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
  <Form
    :form="form"
    @submit="form.submit"
    @reset="form.reset()"
  >
    <Field
      v-slot="{ events, path }"
      path="name"
    >
      <div>
        <label :for="path">Name</label>

        <input
          :id="path"
          v-model="form.values.name"
          type="text"
          placeholder="Min. 8 characters"
          v-bind="events"
          autocomplete="name"
        >

        <Error
          :path="path"
        />
      </div>
    </Field>

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

        <Error
          :path="path"
        />
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
