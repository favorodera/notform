<template>
  <Container
    class="relative grid grid-cols-1 justify-items-center py-8 text-center"
    as="section"
  >
    <h1
      class="
        relative overflow-hidden text-3xl/tight tracking-tight max-inline-4xl

        sm:text-3xl

        lg:text-[2.5rem]
      "
    >
      Vue Forms
      <br>
      without the friction.
    </h1>

    <p
      class="mbs-5 text-base/relaxed font-light text-muted max-inline-md"
    >
      Headless form state and validation library for Vue 3.
      Bring your own schema, keep your own components, and stay in control
      of every interaction.
    </p>

    <div
      class="
        mbs-6 flex flex-wrap items-center justify-center gap-3

        sm:mbs-8 sm:gap-4

        lg:mbs-12
      "
    >
      <Button
        to="/docs/getting-started"
        size="lg"
        icon="tabler:book-2"
        color="primary"
        variant="subtle"
      >
        Read the Docs
      </Button>

      <Button
        to="/playground"
        size="lg"
        icon="tabler:player-play"
        color="primary"
        variant="subtle"
      >
        Try the Playground
      </Button>
    </div>
  </Container>
</template>
