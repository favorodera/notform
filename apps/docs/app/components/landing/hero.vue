<script setup lang="ts">
import { Motion } from 'motion-v'

const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [ 0.25, 0.1, 0.25, 1 ] as const,
    },
    y: 0,
  },
}
</script>

<template>
  <section
    class="relative overflow-hidden border-be border-default"
    aria-labelledby="landing:hero:title"
  >
    <LandingGlow />

    <Motion
      as-child
      initial="hidden"
      animate="visible"
      :variants="container"
    >
      <Container
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
          <Badge
            variant="subtle"
            color="primary"
            class="mbe-6 font-mono"
          >
            Not another form library
          </Badge>
        </Motion>

        <!-- title -->
        <Motion
          id="landing:hero:title"
          as="h1"
          :variants="item"
          class="
            relative overflow-hidden text-3xl/tight tracking-tight
            max-inline-4xl

            sm:text-3xl

            lg:text-[2.5rem]
          "
        >
          <span
            class="inline-block border-be border-primary/20 text-primary"
          >
            Vue
          </span>

          Forms<br>

          <span
            class="inline-block border-be border-primary/20 text-primary"
          >
            without
          </span> the friction.
        </Motion>

        <!-- description -->
        <Motion
          as="p"
          :variants="item"
          class="mbs-5 text-base/relaxed font-light text-muted max-inline-md"
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
            mbs-6 flex flex-wrap items-center justify-center gap-3

            sm:mbs-8 sm:gap-4

            lg:mbs-12
          "
        >
          <Button
            to="/getting-started"
            size="lg"
            color="primary"
            variant="subtle"
          >
            Read Docs
          </Button>

          <LandingInstallCommand />
        </Motion>
      </Container>
    </Motion>
  </section>
</template>
