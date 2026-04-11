<script setup lang="ts">
import { z } from 'zod'
import { NotForm, NotField, useNotForm } from 'notform'

const form = useNotForm({
  schema: z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.email('Invalid email address'),
  }),
  initialValues: {
    name: '',
    email: '',
  },
  onSubmit: (values) => {
    alert(`Form One submitted: ${JSON.stringify(values)}`)
  },
})
</script>

<template>
  <div class="component-box border-emerald-500">
    <h2>Form One (Local Form)</h2>
    <p class="text-sm text-gray-500 mb-2">
      Form is directly declared inside this component.
    </p>
    
    <NotForm
      :instance="form"
      @submit="form.submit"
      @reset="form.reset()"
    >
      <NotField
        v-slot="{ errors, events }"
        path="name"
      >
        <label>Name</label>
        <input
          v-model="form.values.value.name"
          v-bind="events"
          type="text"
          placeholder="Name"
        >
        <p v-if="errors && errors.length">
          {{ errors[0] }}
        </p>
      </NotField>
      
      <NotField
        v-slot="{ errors, events }"
        path="email"
      >
        <label>Email</label>
        <input
          v-model="form.values.value.email"
          v-bind="events"
          type="email"
          placeholder="Email"
        >
        <p v-if="errors && errors.length">
          {{ errors[0] }}
        </p>
      </NotField>
      
      <button type="submit">
        Submit
      </button>
      <button type="reset">
        Reset
      </button>
    </NotForm>

    <div class="state-monitor mt-4">
      <h4>Local Form State</h4>
      <pre>Values: {{ form.values }}</pre>
      <pre>Is Dirty: {{ form.isDirty }}</pre>
    </div>
  </div>
</template>
