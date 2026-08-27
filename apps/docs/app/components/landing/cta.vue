<script setup lang="ts">
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
    y: 0,
  },
}
</script>

<template>
  <section
    class="relative overflow-hidden border-be border-default"
    aria-labelledby="home:cta:title"
  >
    <LandingGlow />

    <Motion
      as="div"
      initial="hidden"
      while-in-view="visible"
      :in-view-options="{ once: true, margin: '-60px' }"
      :variants="containerVariants"
    >
      <Container
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
            class="
              mbe-4 font-mono text-xs tracking-wider text-primary uppercase
            "
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
            mx-auto text-3xl font-semibold tracking-tight text-highlighted
            max-inline-2xl

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
          class="mx-auto mbs-4 text-sm font-light text-muted max-inline-md"
        >
          Read the docs to get up and running in minutes,
          or install the package and start building right now.
        </Motion>

        <!-- Actions -->
        <Motion
          as="div"
          :variants="itemVariants"
          class="
            mbs-8 flex flex-wrap items-center justify-center gap-3

            sm:gap-4
          "
        >
          <!-- Docs -->
          <Button
            to="/getting-started"
            size="lg"
            color="primary"
            variant="subtle"
          >
            Read docs
          </Button>

          <LandingInstallCommand />
        </Motion>
      </Container>
    </Motion>
  </section>
</template>
