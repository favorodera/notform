<script setup lang="ts">
import { NotForm, NotField } from 'notform'
import { useFormStore } from '../stores/form'

const { form } = useFormStore()
</script>

<template>
  <div class="component-box border-emerald-500">
    <h2>Form One (has NotForm)</h2>
    <NotForm
      :instance="form.instance"
      @submit="form.submit"
    >
      <NotField
        v-slot="{ errors, events }"
        path="email"
      >
        <label>Email</label>
        <input
          v-model="form.values.email"
          v-bind="events"
          type="email"
          placeholder="Email in Form One"
        >
        <p v-if="errors && errors.length">
          {{ errors[0] }}
        </p>
      </NotField>
      <button type="submit">
        Submit from 1
      </button>
    </NotForm>
  </div>
</template>
