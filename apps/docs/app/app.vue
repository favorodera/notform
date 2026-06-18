<script setup lang="ts">
const { siteDescription, siteName, siteTitle } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false,
})

provide('navigation', navigation)

useSeoMeta({
  description: () => siteDescription,
  ogDescription: () => siteDescription,
  ogTitle: () => siteTitle,
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${siteName}` : siteTitle
  },
  twitterCard: 'summary_large_image',
  twitterCreator: '@favorodera',
  twitterDescription: () => siteDescription,
  twitterSite: '@favorodera',
  twitterTitle: () => siteTitle,
})

defineOgImage('Landing.takumi')
</script>

<template>
  <UApp>
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
