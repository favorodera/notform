<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  value: z.string().min(4, 'At least 4 characters'),
})

const eagerForm = useNotForm({
  initialValues: { value: '' },
  schema,
})

const lazyForm = useNotForm({
  initialValues: { value: '' },
  schema,
  validationMode: 'lazy',
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
    <div class="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
      <NotField
        v-slot="{ events, path }"
        path="value"
        :form="eagerForm"
      >
        <div>
          <label :for="`eager-${path}`" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Eager Mode (Default)
          </label>
          <input
            :id="`eager-${path}`"
            v-model="eagerForm.values.value"
            placeholder="Type then blur…"
            v-bind="events"
            class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500"
          >
          <NotMessage :form="eagerForm" :path="path" class="mt-2 text-sm text-red-600 dark:text-red-400" />
        </div>
      </NotField>
    </div>

    <div class="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
      <NotField
        v-slot="{ events, path }"
        path="value"
        :form="lazyForm"
      >
        <div>
          <label :for="`lazy-${path}`" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Lazy Mode
          </label>
          <input
            :id="`lazy-${path}`"
            v-model="lazyForm.values.value"
            placeholder="Type then blur…"
            v-bind="events"
            class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-blue-500"
          >
          <NotMessage :form="lazyForm" :path="path" class="mt-2 text-sm text-red-600 dark:text-red-400" />
        </div>
      </NotField>
    </div>
  </div>
</template>
