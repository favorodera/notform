<script setup lang="ts">
import { NotForm, NotField } from 'notform'
import { useFormStore } from '../stores/form'

const { form } = useFormStore()
</script>

<template>
  <div class="component-box border-blue-500">
    <h2>Form Two (has NotForm)</h2>
    <NotForm
      :instance="form.instance"
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
          placeholder="Name in Form Two"
        >
        <p v-if="errors && errors.length">
          {{ errors[0] }}
        </p>
      </NotField>
      <button type="submit">
        Submit from 2
      </button>
      <button type="reset">
        Reset
      </button>
    </NotForm>
  </div>
</template>
