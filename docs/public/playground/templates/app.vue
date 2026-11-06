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
  <Form
    :form="form"
    class="nf-card"
  >
    <Field
      v-slot="{ field }"
      :field="form.field('name')"
    >
      <div class="nf-field">
        <label
          :for="field.path"
          class="nf-label"
        >
          Full Name
        </label>

        <input
          v-bind="field.events"
          :id="field.path"
          v-model="field.model"
          class="nf-input"
          type="text"
          placeholder="e.g. John Doe"
        >

        <FieldError
          :errors="field"
          class="nf-error"
        />
      </div>
    </Field>

    <Field
      v-slot="{ field }"
      :field="form.field('email')"
    >
      <div class="nf-field">
        <label
          :for="field.path"
          class="nf-label"
        >
          Email Address
        </label>

        <input
          v-bind="field.events"
          :id="field.path"
          v-model="field.model"
          class="nf-input"
          type="email"
          placeholder="e.g. john@example.com"
        >

        <FieldError
          :errors="field"
          class="nf-error"
        />
      </div>
    </Field>

    <div class="nf-field">
      <div class="nf-label">
        Interests
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
          <div class="nf-field">
            <div class="nf-group">
              <input
                v-bind="field.events"
                :id="field.path"
                v-model="field.model"
                class="nf-input"
                type="text"
                placeholder="Tag name"
              >

              <div class="nf-group">
                <button
                  type="button"
                  class="nf-button nf-button-secondary"
                  title="Move Up"
                  :disabled="item.index === 0"
                  @click="arrayField.move(item.index, item.index - 1)"
                >
                  &UpArrow;
                </button>

                <button
                  type="button"
                  class="nf-button nf-button-secondary"
                  title="Move Down"
                  :disabled="item.index === arrayField.items.length - 1"
                  @click="arrayField.move(item.index, item.index + 1)"
                >
                  &DownArrow;
                </button>

                <button
                  type="button"
                  class="nf-button nf-button-secondary"
                  title="Remove Tag"
                  @click="arrayField.remove(item.index)"
                >
                  &times;
                </button>
              </div>
            </div>

            <FieldError
              :errors="field"
              class="nf-error"
            />
          </div>
        </Field>

        <button
          type="button"
          class="nf-button nf-button-secondary"
          @click="arrayField.append('')"
        >
          + Add New Tag
        </button>

        <FieldError
          :errors="arrayField"
          class="nf-error"
        />
      </ArrayField>
    </div>

    <div class="nf-group nf-group-fill">
      <button
        type="reset"
        class="nf-button nf-button-secondary"
        :disabled="form.isSubmitting"
      >
        Reset
      </button>

      <button
        type="submit"
        class="nf-button nf-button-primary"
        :disabled="form.isSubmitting"
      >
        {{ form.isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </div>
  </Form>
</template>