<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import { ArrayField, Field, FieldError, Form, useForm } from '../../src'
import FieldFlags from './field-flags.vue'

/* eslint-disable unicorn/max-nested-calls */
const schema = z.object({
  contacts: z.array(z.object({
    email: z.email('Enter a valid email'),
    label: z.string().min(1, 'Label is required'),
  })),
  // async transform: whole-form validation takes a moment, so `validating` is visible
  dob: z.iso.date('Pick a date')
    .transform(async (value) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 800)
      })

      return Date.parse(value)
    }),
  name: z.string().min(1, 'Name is required'),
  tags: z.array(z.string().min(2, 'At least 2 characters')).min(1, 'Add at least one tag'),
})

const submitted = ref<string>()

const form = useForm({
  initialValues: {
    contacts: [{ email: 'ada@example.com', label: 'Work' }],
    dob: '',
    name: '',
    tags: ['vue', 'forms'],
  },
  onSubmit: (data) => {
    submitted.value = JSON.stringify(data, undefined, 2)
  },
  schema,
})

/** What the right-hand panel prints. */
const snapshot = computed(() => {
  return {
    errors: form.errors,
    flags: {
      isDirty: form.isDirty,
      isSubmitted: form.isSubmitted,
      isSubmitting: form.isSubmitting,
      isTouched: form.isTouched,
      isValid: form.isValid,
      isValidating: form.isValidating,
      resetCount: form.resetCount,
      submitCount: form.submitCount,
    },
    values: form.values,
  }
})
</script>

<template>
  <main class="layout">
    <Form
      :form
      class="column"
    >
      <h1>NotForm playground</h1>

      <!-- plain fields: `form.field()` is called on every render and still returns the same field -->
      <Field
        v-slot="{ field }"
        :field="form.field('name')"
      >
        <p>
          <label :for="field.path">Name</label>

          <input
            :id="field.path"
            v-model="field.model"
            type="text"
            :name="field.path"
            v-bind="field.events"
          >

          <FieldError
            :errors="field"
            class="error"
          />

          <FieldFlags :field />
        </p>
      </Field>

      <Field
        v-slot="{ field }"
        :field="form.field('dob')"
      >
        <p>
          <label :for="field.path">Date of birth</label>

          <input
            :id="field.path"
            v-model="field.model"
            type="date"
            :name="field.path"
            v-bind="field.events"
          >

          <FieldError
            :errors="field"
            class="error"
          />

          <FieldFlags :field />
        </p>
      </Field>

      <!-- array of primitives: every item is itself a field -->
      <ArrayField
        v-slot="{ arrayField }"
        :array-field="form.arrayField('tags')"
      >
        <fieldset>
          <legend>Tags</legend>

          <div class="row">
            <button
              type="button"
              @click="arrayField.append('')"
            >
              Append
            </button>

            <button
              type="button"
              @click="arrayField.prepend('')"
            >
              Prepend
            </button>

            <button
              type="button"
              @click="arrayField.insert(1, '')"
            >
              Insert at 1
            </button>

            <button
              type="button"
              @click="arrayField.swap(0, 1)"
            >
              Swap 0 and 1
            </button>

            <button
              type="button"
              @click="arrayField.move(arrayField.items.length - 1, 0)"
            >
              Last to first
            </button>
          </div>

          <FieldError
            :errors="arrayField"
            class="error"
          />

          <FieldFlags :field="arrayField" />

          <div
            v-for="item in arrayField.items"
            :key="item.id"
            class="item"
          >
            <Field
              v-slot="{ field }"
              :field="item"
            >
              <div class="row">
                <input
                  v-bind="field.events"
                  :id="field.path"
                  v-model="field.model"
                  type="text"
                  :name="field.path"
                >

                <button
                  type="button"
                  @click="item.moveTo(item.index - 1)"
                >
                  Up
                </button>

                <button
                  type="button"
                  @click="item.moveTo(item.index + 1)"
                >
                  Down
                </button>

                <button
                  type="button"
                  @click="item.remove()"
                >
                  Remove
                </button>
              </div>

              <FieldError
                :errors="field"
                class="error"
              />

              <FieldFlags :field />
            </Field>
          </div>
        </fieldset>
      </ArrayField>

      <!-- array of objects: nested fields come from the item and follow it when it moves -->
      <ArrayField
        v-slot="{ arrayField }"
        :array-field="form.arrayField('contacts')"
      >
        <fieldset>
          <legend>Contacts</legend>

          <div class="row">
            <button
              type="button"
              @click="arrayField.append({ email: '', label: '' })"
            >
              Append
            </button>

            <button
              type="button"
              @click="arrayField.swap(0, 1)"
            >
              Swap 0 and 1
            </button>
          </div>

          <FieldFlags :field="arrayField" />

          <div
            v-for="item in arrayField.items"
            :key="item.id"
            class="item"
          >
            <Field
              v-slot="{ field }"
              :field="item.field('label')"
            >
              <div class="row">
                <input
                  v-bind="field.events"
                  :id="field.path"
                  v-model="field.model"
                  type="text"
                  placeholder="Label"
                  :name="field.path"
                >

                <FieldError
                  :errors="field"
                  class="error"
                />
              </div>

              <FieldFlags :field />
            </Field>

            <Field
              v-slot="{ field }"
              :field="item.field('email')"
            >
              <div class="row">
                <input
                  v-bind="field.events"
                  :id="field.path"
                  v-model="field.model"
                  type="text"
                  placeholder="Email"
                  :name="field.path"
                >

                <FieldError
                  :errors="field"
                  class="error"
                />
              </div>

              <FieldFlags :field />
            </Field>

            <div class="row">
              <button
                type="button"
                @click="item.moveTo(item.index - 1)"
              >
                Up
              </button>

              <button
                type="button"
                @click="item.moveTo(item.index + 1)"
              >
                Down
              </button>

              <button
                type="button"
                @click="item.remove()"
              >
                Remove
              </button>
            </div>
          </div>
        </fieldset>
      </ArrayField>

      <div class="row">
        <button type="submit">
          Submit
        </button>

        <button type="reset">
          Reset
        </button>

        <button
          type="button"
          @click="form.validate()"
        >
          Validate all
        </button>
      </div>
    </Form>

    <aside class="column">
      <h2>Form state</h2>

      <pre>{{ JSON.stringify(snapshot, null, 2) }}</pre>

      <h2>Submitted output</h2>

      <pre>{{ submitted ?? 'Nothing submitted yet' }}</pre>
    </aside>
  </main>
</template>

<style>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.column {
  min-width: 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.item {
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #ddd;
}

.error {
  color: #b00020;
}

.flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #555;
}

.flags span {
  opacity: 0.35;
}

.flags span.on {
  opacity: 1;
  font-weight: 600;
}

pre {
  padding: 0.75rem;
  overflow: auto;
  font-size: 12px;
  background: #f5f5f5;
}

@media (max-width: 800px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
