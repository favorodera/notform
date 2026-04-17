<script setup lang="ts">
import { resolveComponent } from 'vue'

defineProps<{
  icon: string
  title: string
  description?: string
  to?: string
}>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="
      group relative h-full rounded-lg bg-default p-6 transition-colors
      duration-200
      hover:bg-muted
    "
    aria-describedby="app:card:title"
    style="
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--ui-border) 100%, transparent),
        0 0 0 4px color-mix(in srgb, var(--ui-border) 40%, transparent);
      background-clip: padding-box;
    "
  >
    <!-- Inner dashed border ring -->
    <span
      class="
        pointer-events-none absolute inset-[4px] rounded-md border border-dashed
        border-default/60
      "
      aria-hidden
    />

    <UIcon
      :name="icon"
      class="
        mb-4 size-5 text-primary transition-transform duration-200
        group-hover:scale-110
      "
    />

    <p
      id="app:card:title"
      class="mb-2 text-sm font-medium text-highlighted"
    >
      {{ title }}
    </p>

    <p class="text-sm/relaxed font-light text-muted">
      <slot mdc-unwrap="p">
        {{ description }}
      </slot>
    </p>
  </component>
</template>
