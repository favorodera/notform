<script setup lang="ts">
import { z } from 'zod'

const form = useNotForm({
  schema: z.object({
    email: z.string().email('Enter a valid email address'),
  }),
  initialValues: { email: '' },
})
</script>

<template>
  <div class="w-full max-w-sm space-y-1">
    <NotField
      v-slot="{ events, errors, isTouched, isDirty }"
      :form
      path="email"
    >
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-highlighted">Email</label>
          <div class="flex gap-1.5">
            <UBadge
              v-if="isTouched"
              size="xs"
              color="neutral"
              variant="subtle"
            >
              touched
            </UBadge>
            <UBadge
              v-if="isDirty"
              size="xs"
              color="primary"
              variant="subtle"
            >
              dirty
            </UBadge>
          </div>
        </div>
        <UInput
          v-model="form.values.email"
          type="email"
          placeholder="jane@example.com"
          :color="isTouched && errors.length ? 'error' : 'neutral'"
          v-bind="events"
          class="w-full"
        />
        <p
          v-if="isTouched && errors.length"
          class="text-xs text-red-500"
        >
          {{ errors[0]?.message }}
        </p>
      </div>
    </NotField>
    <p class="text-xs text-muted">
      Blur to see touched state. Type to see dirty state.
    </p>
  </div>
</template>
