<script setup lang="ts">
const features = [
  {
    description: 'Use Zod, Valibot, ArkType, or any Standard Schema validator. Your validation library stays completely separate from your form state.',
    icon: 'tabler:braces',
    title: 'Bring your own schema',
  },
  {
    description: 'Headless components and composables give you state, events, and validation without forcing a design system, markup structure, or styling approach.',
    icon: 'tabler:components',
    title: 'Headless by design',
  },
  {
    description: 'Keep multiple independent forms on the same page. Every form owns its own values, errors, lifecycle, and submission state.',
    icon: 'tabler:layers-subtract',
    title: 'Isolated form instances',
  },
  {
    description: 'Validate everything or target a specific field, object, or array scope. Choose when validation runs with blur, change, input, mount, or manually.',
    icon: 'tabler:adjustments-horizontal',
    title: 'Granular validation',
  },
  {
    description: 'Append, prepend, insert, update, remove, swap, and move array items while keeping their associated state in sync.',
    icon: 'tabler:list-details',
    title: 'First-class arrays',
  },
  {
    description:
      'Stable array item keys keep reordered fields tied to the right item, avoiding the remount and state-shuffling problems of index-based keys.',
    icon: 'tabler:arrows-shuffle',
    title: 'Stable dynamic fields',
  },
  {
    description: 'Field paths, values, and schema input types are inferred from your schema, so invalid paths and incompatible values are caught before runtime.',
    icon: 'tabler:typography',
    title: 'Type-safe by default',
  },
  {
    description: 'Async validation stays predictable even when values change while validation is in flight. Stale results cannot overwrite newer form state.',
    icon: 'tabler:clock-shield',
    title: 'Async-safe validation',
  },
  {
    description: 'Set server-side issues directly onto fields, render them through the same error system, and keep server errors alongside schema validation.',
    icon: 'tabler:server-cog',
    title: 'Server error handling',
  },
]
</script>

<template>
  <section aria-label="NotForm features">
    <Container
      as="ul"
      class="
        grid gap-4 pbe-8

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
