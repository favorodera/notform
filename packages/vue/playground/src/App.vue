<script setup lang="ts">
import { z } from 'zod'
import { Field, Form, useForm } from '../../src'

const schema = z.object({
  dob: z.object({
    year: z.iso.date(),
  }),
  name: z.string().min(1),
})

const form = useForm({
  initialValues: {
    name: 'Ada',
  },
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

    <pre>{{ JSON.stringify(form.values,null,2) }}</pre>
  </Form>
</template>
