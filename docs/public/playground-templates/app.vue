<script setup lang="ts">
import {
  ArrayField,
  Field,
  Form,
  Error,
  useForm,
} from 'notform'
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const form = useForm({
  initialValues: {
    tags: [''],
  },
  onSubmit: async (values) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })

    const formattedValues = JSON.stringify(values, undefined, 2)

    alert(`Form submitted successfully!\n\nValues:\n${formattedValues}`)
  },
  schema,
})
</script>

<template>
  <Form
    :form="form"
  >
    <Field
      v-slot="{ events, path }"
      path="name"
    >
      <div >
        <label
          :for="path"
        > Full Name </label>

        <input
          v-bind="events"
          :id="path"
          v-model="form.values.name"
          data-input
          type="text"
          placeholder="e.g. John Doe"
        >

        <Error
          :path
        />
      </div>
    </Field>

    <Field
      v-slot="{ events, path }"
      path="email"
    >
      <div >
        <label :for="path"> Email Address </label>

        <input
          v-bind="events"
          :id="path"
          v-model="form.values.email"
          type="email"
          placeholder="e.g. john@example.com"
        >

        <Error
          :path
        />
      </div>
    </Field>

    <div >
      <div class="text-sm font-medium">
        interests
      </div>

      <ArrayField
        v-slot="{ items, append, remove, move }"
        path="tags"
        :item-schema="tagSchema"
      >
        <Field
          v-for="(item, index) in items"
          v-slot="{ events,path }"
          :key="item.key"
          :path="item.path"
        >
          <div >
            <div
              
              class="flex-row"
            >
              <input
                v-bind="events"
                :id="path"
                v-model="form.values.tags[index]"
                type="text"
                placeholder="Tag name"
              >

              <div
                
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

            <Error
              :path="item.path"
            />
          </div>
        </Field>

        <button
          type="button"
          @click="append('')"
        >
          + Add New Tag
        </button>

        <Error
          path="tags"
        />
      </ArrayField>
    </div>

    <div
      
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
  </Form>
</template>
