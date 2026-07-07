<script setup lang="ts">
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const form = useNotForm({
  schema,
})
</script>

<template>
  <NotForm
    :form="form"
    @submit.prevent="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events,path }"
      path="name"
    >
      <label :for="path">
        Full Name

        <input
          v-bind="events"
          :id="path"
          v-model="form.values.name"
          type="text"
          placeholder="e.g. John Doe"
        >

        <NotMessage
          :path
        />
      </label>
    </NotField>

    <NotField
      v-slot="{ events,path }"
      path="email"
    >
      <label :for="path">
        Email Address
        <input
          v-bind="events"
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="e.g. john@example.com"
        >

        <NotMessage
          path="email"
        />
      </label>
    </NotField>

    <NotArrayField
      v-slot="{ items, append, remove,move }"
      path="tags"
      :item-schema="tagSchema"
    >
      <label for="tags">
        Interests
        <NotField
          v-for="(item, index) in items"
          v-slot="{ events }"
          :key="item.key"
          :path="item.path"
        >
          <div>
            <input
              v-bind="events"
              v-model="form.values.tags[index]"
              type="text"
              placeholder="Tag name"
            >

            <button
              type="button"
              title="Move Up"
              :disabled="item.index === 0"
              @click="move(index, index - 1)"
            >
              &UpArrow;
            </button>

            <button
              type="button"
              title="Move Down"
              :disabled="item.index === items.length - 1"
              @click="move(index, index + 1)"
            >
              &DownArrow;
            </button>

            <button
              type="button"
              title="Remove Tag"
              @click="remove(index)"
            >
              &times;
            </button>
          </div>

          <NotMessage
            :path="item.path"
          />
        </NotField>

        <button
          type="button"
          @click="append('')"
        >
          + Add New Tag
        </button>

        <NotMessage
          path="tags"
        />
      </label>
    </NotArrayField>

    <button
      type="submit"
      :disabled="!form.isDirty"
    >
      Submit Form
    </button>

    <button
      type="reset"
    >
      Clear All
    </button>

    <pre>{{ JSON.stringify(form.values, null, 2) }}</pre>
  </NotForm>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  max-width: 26rem;
  margin-inline: auto;
  height: 100dvh;
  font-family: system-ui, sans-serif;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2933;
}

input {
  font: inherit;
  font-weight: 400;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd2d9;
  border-radius: 0.375rem;
  background: #fff;
}

input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
}

/* validation text — direct child of a label, but never the input/button/div */
label > span {
  font-size: 0.75rem;
  font-weight: 400;
  color: #d64545;
  min-height: 1em;
}

/* one tag row: text input + its remove button */
label div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

label div input {
  flex: 1;
}

label div button {
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid #cbd2d9;
  border-radius: 50%;
  background: #f5f7fa;
  line-height: 1;
  cursor: pointer;
}

/* "+ Add New Tag" — the only button that's a direct child of a label */
label > button {
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  border: 1px dashed #9aa5b1;
  border-radius: 0.375rem;
  background: none;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #3b4754;
  cursor: pointer;
}

/* Submit / Clear All — direct children of the form itself */
form > button {
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

form > button[type="submit"] {
  border: none;
  background: #3b82f6;
  color: #fff;
}

form > button[type="submit"]:disabled {
  background: #bcd2f7;
  cursor: not-allowed;
}

form > button[type="reset"] {
  border: 1px solid #cbd2d9;
  background: #fff;
  color: #1f2933;
}
</style>
