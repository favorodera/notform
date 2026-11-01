<script setup lang="ts">
import { reactive, ref } from 'vue'
import { number, object, string } from '../../schemas'
import { Field, FieldError, Form, useForm } from '../../src'

const schema = object({
  age: number(18),
  name: string(1),
})

const submitted = ref<string>()

const form = useForm({
  initialValues: {
    age: 0,
    name: '',
  },
  onSubmit: (data) => {
    submitted.value = JSON.stringify(data, undefined, 2)
  },
  schema,
})

const fieldsState = reactive({
  age: form.field('age'),
  name: form.field('name'),
})
</script>

<template>
  <main>
    <Form
      :form
    >
      <Field
        v-slot="{field}"
        :field="form.field('name')"
      >
        <div>
          <label :for="field.path">Name</label>

          <input
            :id="field.path"
            v-model="field.model"
            :name="field.path"
            type="text"
            v-bind="field.events"
            autocomplete="name"
          >

          <FieldError :errors="field" />
        </div>
      </Field>

      <Field
        v-slot="{field}"
        :field="form.field('age')"
      >
        <div>
          <label :for="field.path">Age</label>

          <input
            :id="field.path"
            v-model="field.model"
            :name="field.path"
            type="number"
            v-bind="field.events"
          >

          <FieldError :errors="field" />
        </div>
      </Field>

      <div>
        <button type="reset">
          Reset
        </button>

        <button type="submit">
          Submit
        </button>
      </div>
    </Form>

    <aside class="state">
      <h2>Form state</h2>

      <pre>{{ JSON.stringify(form, null, 2) }}</pre>

      <h2>Fields state</h2>

      <pre>{{ JSON.stringify(fieldsState, null, 2) }}</pre>

      <h2>Submitted output</h2>

      <pre>{{ submitted ?? 'Nothing submitted yet' }}</pre>
    </aside>
  </main>
</template>

<style>
@import './index.css';
</style>
