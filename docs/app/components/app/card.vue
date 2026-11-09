<script setup lang="ts">
import { resolveComponent } from 'vue'

defineProps<{
  description?: string
  title: string
  to?: string
}>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="
      relative block rounded-lg border border-default bg-default bg-clip-padding
      p-4 shadow-xs shadow-neutral-800 block-full
    "
    :class="{
      'cursor-pointer transition-colors duration-200 hover:bg-muted':to
    }"
    aria-describedby="title"
  >
    <p
      id="title"
      class="mbe-2 text-sm font-medium text-highlighted"
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
