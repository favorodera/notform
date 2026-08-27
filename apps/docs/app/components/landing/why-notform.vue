<script setup lang="ts">
const whys = [
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
    class="relative border-be border-default"
    aria-labelledby="home:why-notform:title"
  >
    <Container
      class="
        py-20

        lg:py-28
      "
    >
      <Motion
        as-child
        :initial="{ opacity: 0, y: 16 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true, margin: '-60px' }"
        :transition="{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }"
      >
        <div>
          <p
            class="
              mbe-2 font-mono text-xs tracking-wider text-primary uppercase
            "
          >
            // why notform
          </p>

          <h2
            id="home:why-notform:title"
            class="
              text-3xl font-semibold tracking-tight text-highlighted
              max-inline-sm
            "
          >
            Built for how you actually write Vue.
          </h2>

          <p class="mbs-3 text-sm font-light text-muted max-inline-sm">
            No wrappers. No adapter boilerplate. Composables and renderless
            components that disappear into your codebase.
          </p>
        </div>
      </Motion>

      <ul
        class="
          mbs-12 grid gap-4

          sm:grid-cols-2

          lg:grid-cols-3
        "
      >
        <Motion
          v-for="(why, index) in whys"
          :key="index"
          as="li"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.35,
              delay: (index % 3) * 0.08,
              ease: [0.25, 0.1, 0.25, 1],
            },
          }"
          :in-view-options="{ once: true, margin: '-40px' }"
        >
          <AppCard v-bind="why" />
        </Motion>
      </ul>
    </Container>
  </section>
</template>
