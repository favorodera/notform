<script setup lang="ts">
import { siteConfig } from '#shared/site'
</script>

<template>
  <Footer
    :ui="{
      container: 'py-4',
      root: 'text-sm border-bs border-default text-muted',
    }"
  >
    <div class="flex items-center gap-1">
      <span>Released and published under the</span>

      <NuxtLink
        variant="link"
        size="sm"
        :to="siteConfig.github.license"
        external
        target="_blank"
        class="underline underline-offset-4"
      >
        MIT License
      </NuxtLink>
    </div>
  </Footer>
</template>
