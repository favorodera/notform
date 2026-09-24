<template>
  <div
    class="
      flex flex-col items-center justify-center gap-4 text-sm text-muted
      block-full inline-full
    "
  >
    <div
      class="
        animate-spin rounded-full border-2 border-default border-bs-primary
        block-8 inline-8
      "
      aria-hidden
    />

    <span><slot /></span>
  </div>
</template>
