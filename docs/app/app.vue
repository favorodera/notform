<script setup lang="ts">
import { site } from '#shared/site'

useSeoMeta({
  colorScheme: 'dark light',
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${site.name}` : site.title
  },
  twitterCard: 'summary_large_image',
  twitterCreator: site.author.twitter,
  twitterSite: site.author.twitter,
})

defineOgImage(
  'Image.takumi',
  {
    description: site.description,
    title: site.name,
  },
  [
    { key: 'og' },
    { height: 800, key: 'whatsapp', width: 800 },
  ],
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
