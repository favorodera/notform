<script setup lang="ts">
const props = defineProps<{
  description: string
  title: string
}>()
</script>

<template>
  <div
    :style="{
      fontFamily: `'Outfit', sans-serif`,
    }"
    class="
      relative flex flex-col items-center justify-center gap-4 border
      border-default bg-black p-10 text-center block-full inline-full
    "
  >
    <Icon
      name="custom:logo"
      class="shrink-0 text-highlighted block-14 inline-14"
    />

    <div class="text-5xl tracking-tight font-bold text-highlighted">
      {{ props.title }}
    </div>

    <div class="text-3xl tracking-wide text-muted font-medium">
      {{ props.description }}
    </div>
  </div>
</template>
