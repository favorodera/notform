<!-- eslint-disable node/no-extraneous-import -->
<!-- eslint-disable no-alert -->
<script setup lang="ts">
import {
  NotArrayField,
  NotField,
  NotForm,
  NotMessage,
  useNotForm,
} from 'notform'
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const form = useNotForm({
  initialValues: {
    tags: [''],
  },
  onSubmit: async (values) => {
    await new Promise(resolve => {
      setTimeout(resolve, 2000)
    })

    const formattedValues = JSON.stringify(values, undefined, 2)

    alert(`Form submitted successfully!\n\nValues:\n${formattedValues}`)
  },
  schema,
})
</script>

<template>
  <NotForm
    :form="form"
    data-form
    @submit.prevent="form.submit"
    @reset="form.reset()"
  >
    <NotField
      v-slot="{ events, path }"
      path="name"
    >
      <div data-field>
        <label :for="path"> Full Name </label>

        <input
          v-bind="events"
          :id="path"
          v-model="form.values.name"
          type="text"
          placeholder="e.g. John Doe"
        >

        <NotMessage
          :path
          data-message
        />
      </div>
    </NotField>

    <NotField
      v-slot="{ events, path }"
      path="email"
    >
      <div data-field>
        <label :for="path"> Email Address </label>

        <input
          v-bind="events"
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="e.g. john@example.com"
        >

        <NotMessage
          :path
          data-message
        />
      </div>
    </NotField>

    <div data-field>
      <div data-label>
        interests
      </div>

      <NotArrayField
        v-slot="{ items, append, remove, move }"
        path="tags"
        :item-schema="tagSchema"
      >
        <NotField
          v-for="(item, index) in items"
          v-slot="{ events,path }"
          :key="item.key"
          :path="item.path"
        >
          <div data-field>
            <div
              data-field
              class="flex-row"
            >
              <input
                v-bind="events"
                v-model="form.values.tags[index]"
                type="text"
                placeholder="Tag name"
                :id="path"
              >

              <div
                data-field
                class="flex-row gap-2 inline-fit"
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
            </div>

            <NotMessage
              :path="item.path"
              data-message
            />
          </div>
        </NotField>

        <button
          type="button"
          @click="append('')"
        >
          + Add New Tag
        </button>

        <NotMessage
          path="tags"
          data-message
        />
      </NotArrayField>
    </div>

    <div
      data-field
      class="
        flex-row inline-full

        *:flex-1
      "
    >
      <button
        type="reset"
        :disabled="form.isSubmitting"
      >
        Reset
      </button>

      <button
        type="submit"
        :disabled="form.isSubmitting"
      >
        <span v-if="form.isSubmitting"> Submitting... </span>
        <span v-else> Submit </span>
      </button>
    </div>
  </NotForm>
</template>
