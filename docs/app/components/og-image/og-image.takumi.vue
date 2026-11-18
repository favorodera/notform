<script setup lang="ts">
const props = defineProps<{
  description: string
  label?: string
  title: string
}>()
</script>

<template>
  <div
    data-theme="light"
    :style="{
      fontFamily: `'Outfit', ui-sans-serif, system-ui, sans-serif`,
    }"
    class="
      relative flex flex-col justify-between bg-default p-10 min-block-full
      min-inline-full
    "
  >
    <div class="flex items-start justify-between inline-full">
      <Icon
        name="custom:logo"
        class="shrink-0 text-highlighted block-12 inline-12"
      />

      <span
        v-if="props.label"
        class="text-3xl text-muted"
      >
        {{ props.label }}
      </span>
    </div>

    <div class="flex flex-col items-start gap-2 inline-full max-inline-[70%]">
      <div class="text-5xl tracking-tight text-highlighted">
        {{ props.title }}
      </div>

      <div class="text-3xl tracking-wide text-muted">
        {{ props.description }}
      </div>
    </div>
  </div>
</template>
