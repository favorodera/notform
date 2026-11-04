<script setup lang="ts">
import {
  ArrayField,
  FieldError,
  Field,
  Form,
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
  <Form :form="form">
    <Field
      v-slot="{ field }"
      :field="form.field('name')"
    >
      <div>
        <label :for="field.path">
          Full Name
        </label>

        <input
          v-bind="field.events"
          :id="field.path"
          v-model="field.model"
          type="text"
          placeholder="e.g. John Doe"
        >

        <FieldError :errors="field" />
      </div>
    </Field>

    <Field
      v-slot="{ field }"
      :field="form.field('email')"
    >
      <div>
        <label :for="field.path"> Email Address </label>

        <input
          v-bind="field.events"
          :id="field.path"
          v-model="field.model"
          type="email"
          placeholder="e.g. john@example.com"
        >

        <FieldError :errors="field" />
      </div>
    </Field>

    <div>
      <div class="text-sm font-medium">
        interests
      </div>

      <ArrayField
        v-slot="{ arrayField }"
        :arrayField="form.arrayField('tags')"
      >
        <Field
          v-for="item in arrayField.items"
          v-slot="{ field }"
          :key="item.id"
          :path="item.path"
          :field="item"
        >
          <div>
            <div class="flex-row">
              <input
                :id=" field.path"
                type="text"
                v-model="field.model" v-bind="field.events"
                placeholder="Tag name"
              >

              <div class="flex-row gap-2 inline-fit">
                <button
                  type="button"
                  title="Move Up"
                  :disabled="item.index === 0"
                  @click="arrayField.move(item.index, item.index - 1)"
                >
                  &UpArrow;
                </button>

                <button
                  type="button"
                  title="Move Down"
                  :disabled="item.index === arrayField.items.length - 1"
                  @click="arrayField.move(item.index, item.index + 1)"
                >
                  &DownArrow;
                </button>

                <button
                  type="button"
                  title="Remove Tag"
                  @click="arrayField.remove(item.index)"
                >
                  &times;
                </button>
              </div>
            </div>

            <FieldError :errors="field" />
          </div>
        </Field>

        <button
          type="button"
          @click="arrayField.append('')"
        >
          + Add New Tag
        </button>

        <FieldError :errors="arrayField" />
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
        {{ form.isSubmitting ? 'Submitting...': 'Submit' }} 
      </button>
    </div>
  </Form>
</template>
