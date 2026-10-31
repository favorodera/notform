<script setup lang="ts">
import { z } from 'zod'
import { Field, Form, useForm } from '../../src'

const schema = z.object({
  dob: z.iso.date()
    .transform(async (value) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })

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
      :field="form.field('name',)"
    >
      <input
        :id="field.path"
        v-model="field.model"
        type="text"
        :name="field.path"
        v-bind="field.events"
      >

      <pre>{{ JSON.stringify(field,null,2) }}</pre>
    </Field>

    <Field
      v-slot="{field}"
      :field="form.field('dob')"
    >
      <input
        :id="field.path"
        v-model="field.model"
        type="date"
        :name="field.path"
        v-bind="field.events"
      >

      <pre>{{ JSON.stringify(field,null,2) }}</pre>
    </Field>

    <pre>{{ JSON.stringify(form,null,2) }}</pre>

    <button type="submit">
      Submit
    </button>

    <button
      type="button"
      @click="form.validateField('dob')"
    >
      Field
    </button>
  </Form>
</template>
