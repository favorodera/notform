<template>
  <Container
    class="relative grid grid-cols-1 justify-items-center py-16 text-center"
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
      Headless, composable Vue 3 forms. Bring your own schema —
      Zod, Valibot, ArkType, or anything Standard Schema compliant.
      You own every pixel of your UI.
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
        icon="tabler:book"
        color="primary"
        variant="subtle"
      >
        Read Docs
      </Button>

      <Button
        to="/playground"
        size="lg"
        icon="tabler:play"
        color="primary"
        variant="subtle"
      >
        Playground
      </Button>
    </div>
  </Container>
</template>
