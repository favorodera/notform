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
      border-default bg-black p-10 block-full inline-full text-center
    "
  >
    <Icon
      name="custom:logo"
      class="shrink-0 text-highlighted block-12 inline-12"
    />

    <div class="text-5xl tracking-tight text-highlighted">
      {{ props.title }}
    </div>

    <div class="text-3xl text-muted tracking-wide">
      {{ props.description }}
    </div>
  </div>
</template>
