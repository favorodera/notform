<script setup lang="ts">
import { Form, useForm } from '../../src'
import { z } from 'zod'

const schema = z.object({
  // String field
  name: z.string().min(1, 'Name is required'),
  
  // Number field
  age: z.number().min(18, 'Must be 18 or older'),
  
  // Boolean field
  subscribe: z.boolean(),
  
  // Enum field
  role: z.enum(['admin', 'user', 'guest']),
  
  // Union field
  contact: z.union([
    z.email(),
    z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  ]),
  
  // Object field
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
  
  // Array field
  tags: z.array(z.string().min(5)).min(1, 'At least one tag required'),
})

const { state, id, validate, reset, isValidating, errors } = useForm({
  schema,
  initialState: {
    name: '',
    age: 18,
    subscribe: false,
    role: 'user' as const,
    contact: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
    tags: [''],
  },
  initialErrors: [
    {
      message: 'This is an initial error',
      path: ['tags', 0],
    },
  ],
})

function addTag() {
  state.value.tags.push('')
}

function removeTag(index: number) {
  state.value.tags.splice(index, 1)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <Form
      :id
      action="#"
      class="mx-auto max-w-2xl space-y-6 rounded-lg border border-gray-300 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        Comprehensive Form Example
      </h2>

      <!-- String Field -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white" for="name">
          Name (String)
        </label>
        <input
          v-model="state.name"
          class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          id="name"
          type="text"
          placeholder="Enter your name"
        >
      </div>

      <!-- Number Field -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white" for="age">
          Age (Number)
        </label>
        <input
          v-model.number="state.age"
          class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          id="age"
          type="number"
          min="18"
        >
      </div>

      <!-- Boolean Field -->
      <div class="flex items-center gap-2">
        <input
          v-model="state.subscribe"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
          id="subscribe"
          type="checkbox"
        >
        <label class="text-sm font-medium text-gray-900 dark:text-white" for="subscribe">
          Subscribe to newsletter (Boolean)
        </label>
      </div>

      <!-- Enum Field -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white" for="role">
          Role (Enum)
        </label>
        <select
          v-model="state.role"
          class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          id="role"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      <!-- Union Field -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white" for="contact">
          Contact (Union: Email or Phone)
        </label>
        <input
          v-model="state.contact"
          class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          id="contact"
          type="text"
          placeholder="email@example.com or +1234567890"
        >
      </div>

      <!-- Object Field -->
      <fieldset class="space-y-3 rounded-lg border border-gray-300 p-4 dark:border-gray-600">
        <legend class="px-2 text-sm font-medium text-gray-900 dark:text-white">
          Address (Object)
        </legend>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="street">
            Street
          </label>
          <input
            v-model="state.address.street"
            class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            id="street"
            type="text"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="city">
            City
          </label>
          <input
            v-model="state.address.city"
            class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            id="city"
            type="text"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="zipCode">
            Zip Code
          </label>
          <input
            v-model="state.address.zipCode"
            class="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            id="zipCode"
            type="text"
          >
        </div>
      </fieldset>

      <!-- Array Field -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            Tags (Array)
          </label>
          <button
            type="button"
            @click="addTag"
            class="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
          >
            Add Tag
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(tag, index) in state.tags"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="state.tags[index]"
              class="flex-1 rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              type="text"
              :placeholder="`Tag ${index + 1}`"
            >
            <button
              type="button"
              @click="removeTag(index)"
              class="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
              :disabled="state.tags.length === 1"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          type="button"
          @click="validate"
          :disabled="isValidating"
          class="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ isValidating ? 'Validating...' : 'Validate' }}
        </button>
        <button
          type="button"
          @click="reset"
          class="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Reset
        </button>
      </div>

      <!-- Errors Display -->
      <div v-if="errors.length" class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <h3 class="mb-2 font-medium text-red-800 dark:text-red-400">Validation Errors:</h3>
        <ul class="list-inside list-disc space-y-1 text-sm text-red-700 dark:text-red-300">
          <li v-for="error in errors" :key="error.path?.join('.')">
            {{ error.path?.join('.') }}: {{ error.message }}
          </li>
        </ul>
      </div>
    </Form>

    <!-- Debug Output -->
    <div class="mx-auto mt-6 max-w-2xl">
      <details class="rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <summary class="cursor-pointer font-medium text-gray-900 dark:text-white">
          Debug Info
        </summary>
        <pre class="mt-2 overflow-auto text-xs text-gray-700 dark:text-gray-300">{{ JSON.stringify({ state, isValidating, errors }, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>
