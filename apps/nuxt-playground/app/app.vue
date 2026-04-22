<script setup lang="ts">
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const submissionResult = ref<unknown>(null)

const form = useNotForm({
  schema,
  onSubmit: (values) => {
    submissionResult.value = values
  },
})

const handleReset = async () => {
  form.reset()
  await nextTick()
  submissionResult.value = null
}
</script>

<template>
  <NotForm
    :form="form"
    class="playground"
    @submit="form.submit"
    @reset="handleReset"
  >
    <!-- Name Field -->
    <div>
      <label for="name">Full Name</label>
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
    </div>

    <!-- Email Field -->
    <div>
      <label for="email">Email Address</label>
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
    </div>

    <!-- Tags Array Field -->
    <div>
      <label>Interest Tags</label>
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
    </div>

    <!-- Form Actions -->
    <footer>
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
    </footer>
  </NotForm>
    
</template>

<style>
.playground {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}
</style>

