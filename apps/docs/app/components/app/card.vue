<script setup lang="ts">
import { resolveComponent } from 'vue'

defineProps<{
  description?: string
  icon: string
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
      group relative rounded-lg border border-default bg-default bg-clip-padding
      p-4 shadow-xs shadow-neutral-800 transition-colors duration-200 block-full

      hover:bg-muted
    "
    aria-describedby="app:card:title"
  >
    <Icon
      :name="icon"
      class="
        mbe-4 text-primary transition-transform duration-200 block-5 inline-5

        group-hover:scale-110
      "
    />

    <p
      id="app:card:title"
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
