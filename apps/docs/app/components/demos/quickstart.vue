<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()

const schema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string('Invalid input').min(8, 'At least 8 characters'),
})

const form = useNotForm({
  schema,
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
      v-slot="{ events,path }"
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
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="jane@example.com"
          v-bind="events"
          class="input"
        >

        <NotMessage
          :path="path"
          class="message"
        />
      </div>
    </NotField>

    <NotField
      v-slot="{ events,path }"
      path="password"
    >
      <div class="field">
        <label
          class="label"
          :for="path"
        >
          Password
        </label>
        <input
          :id="path"
          v-model="form.values.password"
          type="password"
          placeholder="Min. 8 characters"
          v-bind="events"
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
    >
      Sign in
    </UButton>
  </NotForm>
</template>
