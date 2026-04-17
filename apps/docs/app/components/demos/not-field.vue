<script setup lang="ts">
import { z } from 'zod'

const form = useNotForm({
  schema: z.object({
    email: z.email('Enter a valid email address'),
  }),
  initialValues: { email: '' },
})
</script>

<template>
  <div class="form">

    <NotField
      v-slot="{ events, isTouched, isValid, isDirty, path }"
      :form="form"
      path="email"
    >
      <div class="space-y-1.5">

        <div class="field">

          <div class="flex gap-1.5">
            <template
              v-for="state, key in {isTouched, isValid, isDirty}"
              :key
            >
              <UBadge
                v-if="state"
                size="sm"
                variant="soft"
              >
                {{ key }}
              </UBadge>
            </template>
          </div>
        </div>

        <input
          :id="path"
          v-model="form.values.email"
          :name="path"
          type="email"
          placeholder="jane@example.com"
          v-bind="events"
          class="input"
        >

        <NotMessage
          :path="path"
          :form
          class="message"
        />
      </div>
    </NotField>

    <p class="text-sm text-muted">
      Blur or type to see field states.
    </p>

  </div>
</template>
