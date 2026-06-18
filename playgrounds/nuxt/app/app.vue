<script setup lang="ts">
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const submissionResult = ref<unknown>()

const form = useNotForm({
  onSubmit: (values) => {
    submissionResult.value = values
  },
  schema,
})

const handleReset = async () => {
  form.reset()
  await nextTick()
  submissionResult.value = undefined
}
</script>

<template>
  <NotForm
    :form="form"
    @submit="form.submit"
    @reset="handleReset"
  >
      <label for="name">
        Full Name

        <NotField
        v-slot="{ events }"
        path="name"
      >
        <input
          v-bind="events"
          id="name"
          v-model="form.values.name"
          type="text"
          placeholder="e.g. John Doe"
        >

        <NotMessage
          path="name"
        />
      </NotField>
      </label>

      <label for="email">
        Email Address

        <NotField
        v-slot="{ events }"
        path="email"
      >
        <input
          v-bind="events"
          id="email"
          v-model="form.values.email"
          type="email"
          placeholder="e.g. john@example.com"
        >

        <NotMessage
          path="email"
        />
      </NotField>
      </label>

      <label>
        Interest Tags

      <NotArrayField
        v-slot="{ items, append, remove }"
        path="tags"
        :item-schema="tagSchema"
      >
        <div>
          <div
            v-for="(item, index) in items"
            :key="item.key"
          >
            <NotField
              v-slot="{ events }"
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
          </div>
        </div>

        <button
          type="button"
          @click="append('')"
        >
          + Add New Tag
        </button>

        <NotMessage
          path="tags"
        />
      </NotArrayField>
      </label>

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
  </NotForm>
</template>