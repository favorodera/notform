<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const content = 'npm install notform'

const { copied, copy } = useClipboard({ legacy: true, source: content })
</script>

<template>
  <Button
    size="lg"
    color="neutral"
    variant="outline"
    :ui="{ trailingIcon: 'size-4' }"
    :trailing-icon="copied ? 'tabler:check' : 'tabler:copy'"
    class="relative overflow-hidden font-mono"
    @click="copy()"
  >
    <span
      class="
        pointer-events-none absolute inset-0 opacity-[0.07]

        dark:opacity-[0.13]
      "
      :style="{
        backgroundImage: 'repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 1px, transparent 5px)',
      }"
      aria-hidden
    />
    {{ content }}
  </Button>
</template>
