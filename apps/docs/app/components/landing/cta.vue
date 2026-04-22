<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard({ legacy: true, source: 'npx nypm add notform' })

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}
</script>

<template>
  <section
    class="relative overflow-hidden border-b border-dashed border-default"
    aria-labelledby="home:cta:title"
  >

    <!-- Atmospheric glow — same language as hero -->
    <div
      class="pointer-events-none absolute inset-0"
      :style="`
        background:
          radial-gradient(ellipse 75% 55% at 50% -5%, var(--ui-primary), transparent 70%),
          radial-gradient(ellipse 50% 35% at 80% 110%, var(--ui-primary), transparent 65%);
        opacity: 0.13;
      `"
      aria-hidden
    />

    <!-- Corner accents -->
    <span
      class="
        pointer-events-none absolute top-0 left-0 size-8 border-t border-l
        border-dashed border-primary/30
      "
      aria-hidden
    />
    <span
      class="
        pointer-events-none absolute right-0 bottom-0 size-8 border-r border-b
        border-dashed border-primary/30
      "
      aria-hidden
    />

    <Motion
      as="div"
      initial="hidden"
      :while-in-view="'visible'"
      :in-view-options="{ once: true, margin: '-60px' }"
      :variants="containerVariants"
    >
      <UContainer
        class="
          relative py-24 text-center
          lg:py-32
        "
      >

        <!-- Eyebrow -->
        <Motion
          as-child
          :variants="itemVariants"
        >
          <p
            class="mb-4 font-mono text-xs tracking-wider text-primary uppercase"
          >
            // get started
          </p>
        </Motion>

        <!-- Headline -->
        <Motion
          id="home:cta:title"
          as="h2"
          :variants="itemVariants"
          class="
            mx-auto max-w-2xl text-3xl font-semibold tracking-tight
            text-highlighted
            lg:text-4xl
          "
        >
          Your schema. Your UI.<br>
          <span class="text-primary">Your form.</span>
        </Motion>

        <!-- Subline -->
        <Motion
          as="p"
          :variants="itemVariants"
          class="mx-auto mt-4 max-w-md text-sm font-light text-muted"
        >
          Read the docs to get up and running in minutes,
          or install the package and start building right now.
        </Motion>

        <!-- Actions -->
        <Motion
          as="div"
          :variants="itemVariants"
          class="
            mt-8 flex flex-wrap items-center justify-center gap-3
            sm:gap-4
          "
        >

          <!-- Docs -->
          <UButton
            to="/get-started"
            size="lg"
            color="primary"
            variant="subtle"
          >
            Read docs
          </UButton>

          <!-- Install command -->
          <UButton
            size="lg"
            :ui="{ trailingIcon: 'size-3' }"
            color="neutral"
            variant="outline"
            :trailing-icon="copied ? 'lucide:check' : 'lucide:copy'"
            class="relative overflow-hidden font-mono"
            @click="copy()"
          >
            <span
              class="
                pointer-events-none absolute inset-0 opacity-[0.06]
                dark:opacity-[0.12]
              "
              :style="`background-image: repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 1px, transparent 5px)`"
              aria-hidden
            />
            npx nypm add notform
          </UButton>

        </Motion>

      </UContainer>
    </Motion>

  </section>
</template>
