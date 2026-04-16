<script setup lang="ts">
import { Motion } from 'motion-v'
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard({ legacy: true, source: 'npx nypm add notform' })

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
}
</script>

<template>
  <section
    class="relative overflow-hidden border-b border-dashed border-default"
    aria-labelledby="landing:hero:title"
  >

    <!-- atmospheric glow -->
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

    <Motion
      as-child
      initial="hidden"
      animate="visible"
      :variants="container"
    >

      <UContainer
        class="
          relative grid grid-cols-1 justify-items-center py-28 text-center
          lg:py-36
        "
      >

        <!-- badge -->
        <Motion
          as="div"
          :variants="item"
        >
          <UBadge
            variant="subtle"
            color="primary"
            class="mb-6 font-mono"
          >
            No magic. Just forms.
          </UBadge>
        </Motion>

        <!-- title -->
        <Motion
          id="landing:hero:title"
          as="h1"
          :variants="item"
          class="
            relative max-w-4xl overflow-hidden text-3xl/tight tracking-tight
            text-neutral-800
            sm:text-3xl
            md:text-3xl
            lg:text-[2.5rem]
            dark:text-neutral-200
          "
        >
          <span class="border-b border-dashed border-primary/20 text-primary">Vue</span> Forms<br>
          without the friction.

        </Motion>

        <!-- description -->
        <Motion
          as="p"
          :variants="item"
          class="mt-5 max-w-md text-base/relaxed font-light text-muted"
        >
          Headless, composable Vue 3 forms. Bring your own schema —
          Zod, Valibot, ArkType, or anything Standard Schema compliant.
          You own every pixel of your UI.
        </Motion>

        <!-- ctas -->
        <Motion
          as="div"
          :variants="item"
          class="
            mt-6 flex flex-wrap items-center justify-center gap-3
            sm:mt-8 sm:gap-4
            lg:mt-12
          "
        >
          <UButton
            to="/docs"
            size="lg"
            color="primary"
            variant="subtle"
          >
            Read Docs
          </UButton>

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
                pointer-events-none absolute inset-0 opacity-[0.07]
                dark:opacity-[0.13]
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
