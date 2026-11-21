<script setup lang="ts">
import type { NuxtError } from '#app'
import { siteConfig } from '#shared/site'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: siteConfig.locale,
  },
})

useSeoMeta({
  description: 'We are sorry but this page could not be found.',
  title: 'Page not found',
})
</script>

<template>
  <App>
    <AppHeader />

    <Error :error="error" />

    <AppFooter />
  </App>
</template>
