<script setup lang="ts">
import { siteConfig } from '#shared/site'

useSeoMeta({
  colorScheme: 'dark light',
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${siteConfig.name}` : siteConfig.title
  },
  twitterCard: 'summary_large_image',
  twitterCreator: siteConfig.author.twitter,
  twitterSite: siteConfig.author.twitter,
})

defineOgImage(
  'Image.takumi',
  {
    description: siteConfig.description,
    title: siteConfig.name,
  },
  siteConfig.ogImageVariants,
)
</script>

<template>
  <App>
    <NuxtLayout>
      <NuxtRouteAnnouncer />

      <NuxtPage />
    </NuxtLayout>
  </App>
</template>
