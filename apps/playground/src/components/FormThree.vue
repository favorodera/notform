<script setup lang="ts">
import { NotField } from 'notform'
import { useFormStore } from '../stores/form'

const { form } = useFormStore()
</script>

<template>
  <div class="component-box border-orange-500">
    <h2>Form Three (Standalone)</h2>
    <p class="text-sm text-gray-500 mb-2">
      No NotForm component, just NotField singletons sharing the instance.
    </p>
    
    <NotField
      v-slot="{ errors, events }"
      :form="form.instance"
      path="email"
    >
      <label>Email (Singleton)</label>
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

    <NotField
      v-slot="{ errors, events }"
      :form="form.instance"
      path="name"
    >
      <label>Name (Singleton)</label>
      <input
        v-model="form.values.name"
        v-bind="events"
        type="text"
        placeholder="Shared Name Input"
      >
      <p v-if="errors && errors.length">
        {{ errors[0] }}
      </p>
    </NotField>
    
    <button @click="form.submit">
      Manual Submit from 3
    </button>
  </div>
</template>
