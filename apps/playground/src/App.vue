<script setup lang="ts">
import { z } from 'zod'
import { NotForm, NotField, NotArrayField, useNotForm } from 'notform'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(18, 'Must be at least 18').optional(),
})

const form = useNotForm({
  schema: z.object({
    users: z.array(userSchema).min(1, 'At least one user is required'),
  }),
  initialValues: {
    users: [{ name: '', age: 18 }],
  },
  onSubmit: (values) => {
    console.log('Submitted:', values)
  },
})
</script>

<template>
  <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
    <h1>NotArrayField Test</h1>
    <NotForm
      :form="form"
      @submit="form.submit"
    >
      <NotArrayField
        v-slot="{ items, append, remove, swap, move, insert, prepend, update }"
        path="users"
        :item-schema="userSchema"
      >
        <div style="margin-bottom: 2rem;">
          <button
            type="button"
            @click="append({ name: '', age: 18 })"
          >
            Append User
          </button>
          <button
            type="button"
            @click="prepend({ name: 'First', age: 20 })"
          >
            Prepend
          </button>
          <button
            type="button"
            @click="insert(1, { name: 'Inserted', age: 25 })"
          >
            Insert at 1
          </button>
        </div>

        <div
          v-for="(item, index) in items"
          :key="item.key"
          style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem;"
        >
          <h3>User {{ index }}</h3>
          
          <NotField
            v-slot="{ events, errors }"
            :path="`${item.path}.name`"
          >
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem;">Name:</label>
              <input
                v-model="form.values.users[index]!.name"
                v-bind="events"
                type="text"
                style="padding: 0.5rem; width: 100%; box-sizing: border-box;"
              >
              <div
                v-if="errors.length"
                style="color: red; font-size: 0.8rem; margin-top: 0.2rem;"
              >
                {{ errors[0] }}
              </div>
            </div>
          </NotField>

          <NotField
            v-slot="{ events, errors }"
            :path="`${item.path}.age`"
          >
            <div style="margin-bottom: 1rem;">
              <label style="display: block; margin-bottom: 0.5rem;">Age:</label>
              <input
                v-model.number="form.values.users[index]!.age"
                v-bind="events"
                type="number"
                style="padding: 0.5rem; width: 100%; box-sizing: border-box;"
              >
              <div
                v-if="errors.length"
                style="color: red; font-size: 0.8rem; margin-top: 0.2rem;"
              >
                {{ errors[0] }}
              </div>
            </div>
          </NotField>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button
              type="button"
              @click="remove(index)"
            >
              Remove
            </button>
            <button
              type="button"
              :disabled="index === 0"
              @click="swap(index, index - 1)"
            >
              Swap Up
            </button>
            <button
              type="button"
              :disabled="index === items.length - 1"
              @click="swap(index, index + 1)"
            >
              Swap Down
            </button>
            <button
              type="button"
              :disabled="index === 0"
              @click="move(index, 0)"
            >
              Move to Top
            </button>
            <button
              type="button"
              @click="update(index, { name: 'Updated', age: 99 })"
            >
              Update to 99
            </button>
          </div>
        </div>
      </NotArrayField>

      <div style="margin-top: 2rem; display: flex; gap: 1rem;">
        <button
          type="submit"
          style="padding: 0.5rem 2rem; background: blue; color: white; border: none; cursor: pointer;"
        >
          Submit
        </button>
        <button
          type="button"
          style="padding: 0.5rem 2rem;"
          @click="form.reset()"
        >
          Reset
        </button>
      </div>

      <pre style="margin-top: 2rem; background: #eee; padding: 1rem; overflow: auto; max-height: 400px; font-size: 0.9rem;">
isValid: {{ form.isValid }}
isDirty: {{ form.isDirty }}
values: {{ JSON.stringify(form.values, null, 2) }}
errors: {{ JSON.stringify(form.errors, null, 2) }}
      </pre>
    </NotForm>
  </div>
</template>
