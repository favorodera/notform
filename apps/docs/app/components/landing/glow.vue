<template>
  <div
    class="pointer-events-none absolute inset-0"
    :style="{
      background: `
            radial-gradient(ellipse 75% 55% at 50% -5%, var(--ui-primary), transparent 70%),
            radial-gradient(ellipse 50% 35% at 80% 110%, var(--ui-primary), transparent 65%)
          `,
      opacity: 0.13,
    }"
    aria-hidden
  />
</template>
