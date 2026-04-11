<script setup lang="ts">
import { NotForm, NotField } from 'notform'
import { useForm } from '../composables/use-form'

const form = useForm()
</script>

<template>
  <div class="component-box border-orange-500">
    <h2>Form Three (Composable)</h2>
    <p class="text-sm text-gray-500 mb-2">
      Same structure as Form Two, but sourced from a shared composable.
    </p>

    <h3>Inside NotForm</h3>
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
          v-model="form.values.name"
          v-bind="events"
          type="text"
          placeholder="Name via NotForm"
        >
        <p v-if="errors && errors.length">
          {{ errors[0] }}
        </p>
      </NotField>
      <button type="submit">Submit Top</button>
      <button type="reset">Reset</button>
    </NotForm>

    <hr class="my-4">

    <h3>Singleton NotField</h3>
    <NotField
      v-slot="{ errors, events }"
      :form="form"
      path="email"
    >
      <label>Email</label>
      <input
        v-model="form.values.email"
        v-bind="events"
        type="email"
        placeholder="Shared Email Input"
      >
      <p v-if="errors && errors.length">
        {{ errors[0] }}
      </p>
    </NotField>
    
    <button @click="form.submit" class="mt-4">
      Manual Submit Target
    </button>

    <div class="state-monitor mt-4">
      <h4>Composable State</h4>
      <pre>Values: {{ form.values }}</pre>
      <pre>Is Dirty: {{ form.isDirty }}</pre>
    </div>
  </div>
</template>
