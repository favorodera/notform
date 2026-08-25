<script setup lang="ts">
const whys = [
  {
    description: 'Drop in any Standard Schema compliant validator. No adapter layer, no rewiring — swap libraries without touching your form logic.',
    icon: 'i-lucide-puzzle',
    title: 'Schema-agnostic',
  },
  {
    description: 'Zero UI opinions. Slot-based primitives hand you full render control — works with any component library or none at all.',
    icon: 'i-lucide-eye-off',
    title: 'Headless by design',
  },
  {
    description: 'Run as many independent forms as you need on the same page. Each instance is fully isolated — no global state, no ID conflicts.',
    icon: 'i-lucide-layers',
    title: 'Multiple instances',
  },
  {
    description: 'Validate the whole form or a single field. Override when each field validates — eager, lazy, or any event-driven trigger.',
    icon: 'i-lucide-zap',
    title: 'Granular validation',
  },
  {
    description: 'Full array manipulation with stable item keys. Items reorder, insert, and remove without causing unnecessary re-mounts.',
    icon: 'i-lucide-list',
    title: 'Array fields built-in',
  },
  {
    description: 'Field paths and their value types are inferred straight from your schema. Wrong paths and mismatched values are caught at compile time.',
    icon: 'i-lucide-braces',
    title: 'End-to-end type safety',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [
        0.25,
        0.1,
        0.25,
        1,
      ] as const,
    },
    y: 0,
  },
}
</script>

<template>
  <section
    class="relative border-be border-dashed border-default"
    aria-labelledby="home:why-notform:title"
  >
    <!-- Corner accents -->
    <span
      class="
        pointer-events-none absolute inset-s-0 inset-bs-0 border-s border-bs
        border-dashed border-primary/30 block-8 inline-8
      "
      aria-hidden
    />

    <span
      class="
        pointer-events-none absolute inset-e-0 inset-be-0 border-e border-be
        border-dashed border-primary/30 block-8 inline-8
      "
      aria-hidden
    />

    <Container
      class="
        py-20

        lg:py-28
      "
    >
      <!-- Section header -->
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

      <!-- Feature grid — each card is its own bordered island -->
      <Motion
        as="ul"
        initial="hidden"
        while-in-view="visible"
        :in-view-options="{ once: true, margin: '-40px' }"
        :variants="containerVariants"
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
          :variants="cardVariants"
        >
          <AppCard
            v-bind="why"
          />
        </Motion>
      </Motion>
    </Container>
  </section>
</template>
