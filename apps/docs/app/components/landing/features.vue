<script setup lang="ts">
const features = [
  {
    description: 'Drop in any Standard Schema compliant validator. No adapter layer, no rewiring — swap libraries without touching your form logic.',
    icon: 'tabler:puzzle',
    title: 'Schema-agnostic',
  },
  {
    description: 'Zero UI opinions. Slot-based primitives hand you full render control — works with any component library or none at all.',
    icon: 'tabler:eye-off',
    title: 'Headless by design',
  },
  {
    description: 'Run as many independent forms as you need on the same page. Each instance is fully isolated — no global state, no ID conflicts.',
    icon: 'tabler:layers-intersect',
    title: 'Multiple instances',
  },
  {
    description: 'Validate the whole form or a single field. Override when each field validates — eager, lazy, or any event-driven trigger.',
    icon: 'tabler:bolt',
    title: 'Granular validation',
  },
  {
    description: 'Full array manipulation with stable item keys. Items reorder, insert, and remove without causing unnecessary re-mounts.',
    icon: 'tabler:list',
    title: 'Array fields built-in',
  },
  {
    description: 'Field paths and their value types are inferred straight from your schema. Wrong paths and mismatched values are caught at compile time.',
    icon: 'tabler:braces',
    title: 'End-to-end type safety',
  },
]
</script>

<template>
  <section
    aria-label="NotForm features"
  >
    <Container
      as="ul"
      class="
        grid gap-4

        sm:grid-cols-2

        lg:grid-cols-3
      "
    >
      <li
        v-for="feature, index in features"
        :key="index"
      >
        <AppCard v-bind="feature" />
      </li>
    </Container>
  </section>
</template>
