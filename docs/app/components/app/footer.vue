<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <Footer
    :ui="{
      container:'py-4',
      root:'text-sm border-bs border-default text-muted ',
      center:'hidden'
    }"
  >
    <template #left>
      <span>Published under MIT License</span>
    </template>

    <template #right>
      <span class="text-end">
        Copyright © {{ currentYear }} NotForm
      </span>
    </template>
  </Footer>
</template>
