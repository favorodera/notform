<script setup lang="ts">
import { z } from 'zod'
import { Field, Form, useForm } from '../../src'

const schema = z.object({
  dob: z.iso.date().transform((value) => {
    return Date.parse(value)
  }),
  name: z.string().min(1),
})

const form = useForm({
  schema,
})
</script>

<template>
  <Form :form>
    <Field
      v-slot="{field}"
      :handler="form.field('name')"
    >
      <input
        :id="field.path"
        v-model="field.model"
        type="text"
        :name="field.path"
      >

      <pre>{{ JSON.stringify(field,null,2) }}</pre>
    </Field>

    <Field
      v-slot="{field}"
      :handler="form.field('dob')"
    >
      <input
        :id="field.path"
        v-model="field.model"
        type="date"
        :name="field.path"
      >

      <pre>{{ JSON.stringify(field,null,2) }}</pre>
    </Field>

    <pre>{{ JSON.stringify(form,null,2) }}</pre>

    <button type="submit">
      Submit
    </button>
  </Form>
</template>
