<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const schema = z.object({
  name: z.object({
    first: z.string('Enter a valid first name').min(1, 'First name is required'),
    last: z.string('Enter a valid last name').min(1, 'Last name is required'),
  }),
  title: z.literal(['Mr', 'Mrs', 'Miss']),
})

const form = useForm({
  initialValues: {
    name: {},
  },
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
      path="title"
    >
      <div>
        <label :for="path">
          Title
        </label>

        <input
          :id="path"
          v-model="form.values.title"
          type="text"
          placeholder="Title"
          v-bind="events"
          autocomplete="honorific-prefix"
        >

        <Error :path="path" />
      </div>
    </Field>

    <Field
      v-slot="{ events, path }"
      path="name.first"
    >
      <div>
        <label :for="path">First Name</label>

        <input
          :id="path"
          v-model="form.values.name.first"
          type="text"
          placeholder="First Name"
          v-bind="events"
          autocomplete="first-name"
        >

        <Error :path="path" />
      </div>
    </Field>

    <Field
      v-slot="{ events, path }"
      path="name.last"
    >
      <div>
        <label :for="path">Last Name</label>

        <input
          :id="path"
          v-model="form.values.name.last"
          type="text"
          placeholder="Last Name"
          v-bind="events"
          autocomplete="family-name"
        >

        <Error
          :path="path"
        />
      </div>
    </Field>

    <div
      class="flex-row"
    >
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
