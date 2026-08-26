<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string('Invalid input').min(8, 'At least 8 characters'),
})

const form = useNotForm({
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

        <NotMessage
          :path="path"
          class="
            mbs-2 text-sm text-red-600

            dark:text-red-400
          "
        />
      </div>
    </NotField>

    <NotField
      v-slot="{ events, path }"
      path="password"
    >
      <div data-demo-field>
        <label :for="path">Password</label>

        <input
          :id="path"
          v-model="form.values.password"
          type="password"
          placeholder="Min. 8 characters"
          v-bind="events"
          autocomplete="current-password"
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
