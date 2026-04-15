<template>
  <div
    class="
      grid min-h-dvh w-full grid-cols-1 grid-rows-[1fr] place-content-center
    "
  >

    <!-- Skip-to-content link: visible only on keyboard focus (sr-only + focus:not-sr-only) -->
    <NuxtLink
      to="#main"
      class="
        sr-only
        focus:not-sr-only focus:absolute focus:z-100 focus:rounded-md
        focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium
        focus:text-primary-foreground focus:shadow-md focus:outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        focus-visible:ring-offset-background
      "
    >
      Skip to main content
    </NuxtLink>

    <main
      id="main"
      class="
        relative mx-auto grid size-full grid-cols-1 grid-rows-[1fr]
        place-content-center 
      "
    >
      <NuxtRouteAnnouncer />
      <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    </main>

  </div>
</template>
