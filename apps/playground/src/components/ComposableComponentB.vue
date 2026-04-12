<script setup lang="ts">
import { NotForm, NotField } from 'notform'
import { useSharedForm } from '../composables/use-form'

const form = useSharedForm()
</script>

<template>
  <div class="component-box border-emerald-500">
    <h2>Composable Component B</h2>
    <p class="text-sm text-gray-500 mb-2">
      Edits the "email" field. Shares same instance!
    </p>
    
    <NotForm
      :form="form"
      @submit="form.submit"
    >
      <NotField
        v-slot="{ events, errors, isDirty, isTouched, isValid, isValidating }"
        path="email"
      >
        <label>Email</label>
        <input
          v-model="form.values.email"
          v-bind="events"
          type="email"
        >
        <div class="field-api-tags mt-2">
          <span :class="['api-tag', isDirty ? 'tag-active' : '']">isDirty: {{ isDirty }}</span>
          <span :class="['api-tag', isTouched ? 'tag-active' : '']">isTouched: {{ isTouched }}</span>
          <span :class="['api-tag', !isValid ? 'tag-error' : 'tag-active']">isValid: {{ isValid }}</span>
          <span :class="['api-tag', isValidating ? 'tag-loading' : '']">isValidating: {{ isValidating }}</span>
        </div>
        <p v-if="errors.length">
          {{ errors[0].message }}
        </p>
      </NotField>
      <button
        type="submit"
        class="mt-4"
      >
        Submit via B
      </button>
    </NotForm>
  </div>
</template>
