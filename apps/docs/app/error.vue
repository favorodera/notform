<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  description: 'We are sorry but this page could not be found.',
  title: 'Page not found',
})
</script>

<template>
  <App>
    <Header
      to="/"
      class=""
      :toggle="false"
    >
      <template #title>
        <AppLogo />
      </template>
    </Header>

    <Error :error="error" />
    <AppFooter />
  </App>
</template>
