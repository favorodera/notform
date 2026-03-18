<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
// @ts-nocheck
import { useNotForm, NotForm, NotMessage, NotField, NotArrayField } from 'notform'
import { z } from 'zod'

const schema = z.object({
  users: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.email('Invalid email'),
    }),
  ),
})

const { state, id, submit, reset, isDirty } = useNotForm({
  schema,
  onSubmit() {
    // ..
  },
})
</script>

<template>
  <div class="playground">
    <NotForm
      :id="id"
      @submit="submit"
      @reset="reset()"
    >
      <NotArrayField
        v-slot="{ fields, append, remove, prepend, insert, update}"
        name="users"
        :schema="schema.shape.users"
      >
        <div
          v-for="(field, index) in fields"
          :key="field.key"
        >
          <NotField
            v-slot="{ name, methods }"
            :name="`users.${index}.name`"
          >
            <input
              v-bind="methods"
              :id="name"
              v-model="state.users[index].name"
              :name
              type="text"
              :placeholder="`Name ${index}`"
            >
            <NotMessage :name />
          </NotField>

          <NotField
            v-slot="{ name, methods }"
            :name="`users.${index}.email`"
          >
            <input
              v-bind="methods"
              :id="name"
              v-model="state.users[index].email"
              :name
              type="email"
              :placeholder="`Email ${index}`"
            >
            <NotMessage :name />
          </NotField>

          <button
            type="button"
            @click="remove(index)"
          >
            Remove {{ index }}
          </button>
          <button
            type="button"
            @click="update(index, { name: 'Updated', email: 'updated@test.com' })"
          >
            Update {{ index }}
          </button>
          <button
            type="button"
            @click="insert(index, { name: '', email: '' })"
          >
            Insert at {{ index }}
          </button>
        </div>

        <button
          type="button"
          @click="append({ name: '', email: '' })"
        >
          Append
        </button>
        <button
          type="button"
          @click="prepend({ name: '', email: '' })"
        >
          Prepend
        </button>

        <NotMessage name="users" />
      </NotArrayField>


      <button type="submit">
        Submit
      </button>
      <button type="reset">
        Reset
      </button>
    </NotForm>

    <div>isDirty: {{ isDirty }}</div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  min-height: 100dvh;
  min-width: 100%;
}
</style>
