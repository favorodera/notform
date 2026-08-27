<script setup lang="ts">
const props = defineProps<{
  description: string
  title: string
}>()
</script>

<template>
  <div
    :style="{
      fontFamily: `'Geist Mono', monospace`,
    }"
    class="
      relative flex flex-col items-center justify-center gap-2 border
      border-default bg-black p-10 text-center block-full inline-full
    "
  >
    <Icon
      name="custom:logo"
      class="shrink-0 text-highlighted block-12 inline-12"
    />

    <div class="text-5xl tracking-tight text-highlighted">
      {{ props.title }}
    </div>

    <div class="text-3xl tracking-wide text-muted">
      {{ props.description }}
    </div>
  </div>
</template>
