<script setup lang="ts">
import { NotField } from 'notform'
import { useSharedForm } from '../composables/use-form'

const form = useSharedForm()
</script>

<template>
  <div class="component-box border-emerald-500">
    <h2>Composable Singleton</h2>
    <p class="text-sm text-gray-500 mb-2">
      Works seamlessly without NotForm parent.
    </p>
    
    <NotField
      v-slot="{ events, errors, isDirty, isTouched, isValid, isValidating }"
      :form="form"
      path="email"
    >
      <label>Email (Singleton)</label>
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
      class="mt-4"
      @click="form.submit"
    >
      Submit explicitly
    </button>
  </div>
</template>

