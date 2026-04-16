<script setup lang="ts">
const whys = [
  {
    icon: 'i-lucide-puzzle',
    title: 'Schema-agnostic',
    description: 'Works with any [Standard Schema](https://standardschema.dev) library. Zod, Valibot, ArkType, or your own.',
  },
  {
    icon: 'i-lucide-eye-off',
    title: 'Headless by design',
    description: 'Renderless slot components — `NotField`{color="primary" class="text-xs font-mono"}, `NotArrayField`{color="primary" class="text-xs font-mono"}. You own every pixel.',
  },
  {
    icon: 'i-lucide-zap',
    title: 'Granular validation',
    description: 'Validate the whole form or a single field. Eager, lazy, per-field trigger overrides — all built in.',
  },
  {
    icon: 'i-lucide-list',
    title: 'Array fields built-in',
    description: '`append`{color="primary" class="text-xs font-mono"}, `remove`{color="primary" class="text-xs font-mono"}, `swap`{color="primary" class="text-xs font-mono"}, `move`{color="primary" class="text-xs font-mono"} — with stable keys so `v-for`{color="primary" class="text-xs font-mono"} never re-mounts.',
  },
  {
    icon: 'i-lucide-activity',
    title: 'Dirty & touched tracking',
    description: 'Know which fields were changed or interacted with. Surface errors only when the user is ready.',
  },
  {
    icon: 'i-lucide-braces',
    title: 'TypeScript first',
    description: 'Paths inferred from your schema. `setValue`{color="primary" class="text-xs font-mono"} and `errorsMap`{color="primary" class="text-xs font-mono"} know your field names at compile time.',
  },
]

</script>

<template>
  <section
    class="border-default border-b"
    aria-labelledby="home:why-notform:title"
  >
    <UContainer class="py-20">
      <p class="text-primary mb-2 font-mono text-xs tracking-wider uppercase">
        // why notform
      </p>

      <h2
        id="home:why-notform:title"
        class="text-highlighted max-w-sm text-3xl font-semibold tracking-tight"
      >
        Built for how you actually write Vue.
      </h2>

      <p class="text-muted mt-3 max-w-sm text-sm font-light">
        No wrappers. No adapter boilerplate. Composables and renderless
        components that disappear into your codebase.
      </p>

      <ul
        class="
          border-default bg-border mt-12 grid gap-px overflow-hidden rounded-lg
          border
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        <li
          v-for="why, index in whys"
          :key="index"
          class="
            bg-default
            hover:bg-muted
            p-6 transition-colors
          "
        >
          <UIcon
            :name="why.icon"
            class="text-primary mb-4 size-5"
          />

          <h3 class="text-highlighted mb-2 text-sm font-medium">
            {{ why.title }}
          </h3>

          <p class="text-muted text-sm/relaxed font-light">
            <MDC :value="why.description" />
          </p>
  
        </li>

      </ul>
      
    </UContainer>

  </section>
</template>
