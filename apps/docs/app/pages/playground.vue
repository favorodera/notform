<script setup lang="ts">
definePageMeta({
  ssr: false,
})
</script>

<template>
  <div class="py-2 block-[95%] inline-full">
    <ClientOnly>
      <PlaygroundEditor />

      <template #fallback>
        <PlaygroundSpinner>
          Loading playground
        </PlaygroundSpinner>
      </template>
    </ClientOnly>
  </div>
</template>
