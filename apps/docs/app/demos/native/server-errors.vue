<script setup lang="ts">
import { z } from 'zod'

const form = useNotForm({
  initialValues: { email: '' },
  onSubmit: async (values) => {
    // Simulate a server 409 — email taken
    await new Promise(resolve => setTimeout(resolve, 600))

    if (values.email === 'taken@example.com') {
      form.setError({
        message: 'This email is already registered',
        path: [{ key: 'email' }],
      })
      return
    }

    alert(`Account created successfully for: ${values.email}`)
  },
  schema: z.object({
    email: z.email('Enter a valid email'),
  }),
})
</script>

<template>
  <NotForm
    :form="form"
    class="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 space-y-6"
    @submit="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events, path }"
      path="email"
    >
      <div>
        <label :for="path" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Email Address
        </label>
        <input
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="Try taken@example.com"
          v-bind="events"
          class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500"
        >
        <NotMessage :path="path" class="mt-2 text-sm text-red-600 dark:text-red-400" />
      </div>
    </NotField>

    <div class="flex gap-3 pt-2">
      <button
        type="reset"
        :disabled="form.isSubmitting.value"
        class="flex-1 justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700"
      >
        Reset
      </button>

      <button
        type="submit"
        :disabled="form.isSubmitting.value"
        class="flex-1 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
      >
        <span v-if="form.isSubmitting.value">Submitting...</span>
        <span v-else>Submit</span>
      </button>
    </div>
  </NotForm>
</template>
