<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = defineProps<{ value: string }>()
const { copy, copied } = useClipboard({ source: props.value, legacy: true })
</script>

<template>
  <label>
    <UInput
      :model-value="value"
      size="lg"
      disabled
      class="w-50"
    >
      <div
        class="absolute inset-0"
        :class="[copied ? 'cursor-default' : 'cursor-copy']"
        @click="copy()"
      />
      <template #trailing>
        <UButton
          :icon="copied ? 'i-tabler-check' : 'i-tabler-copy'"
          color="neutral"
          variant="link"
          :padded="false"
          :ui="{ leadingIcon: 'size-4' }"
          :class="{ 'text-primary hover:text-primary/80': copied }"
          aria-label="copy button"
          @click="copy()"
        />
      </template>
    </UInput>
  </label>
</template>
