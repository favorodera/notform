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
    class="form"
    @submit="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events,path }"
      path="email"
    >
      <label
        class="label"
        :for="path"
      >
        Email

        <input
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="jane@example.com"
          v-bind="events"
          autocomplete="email"
          class="input"
        >

        <NotMessage
          :path="path"
          class="message"
        />
      </label>
    </NotField>

    <NotField
      v-slot="{ events,path }"
      path="password"
    >
      <label
        class="label"
        :for="path"
      >
        Password

        <input
          :id="path"
          v-model="form.values.password"
          type="password"
          placeholder="Min. 8 characters"
          v-bind="events"
          autocomplete="current-password"
          class="input"
        >

        <NotMessage
          :path="path"
          class="message"
        />
      </label>
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
