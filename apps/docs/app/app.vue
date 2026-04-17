<script setup lang="ts">
const { siteName, siteDescription, siteTitle } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false,
})

provide('navigation', navigation)

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${siteName}` : siteTitle
  },
  ogTitle: () => siteTitle,
  description: () => siteDescription,
  twitterTitle: () => siteTitle,
  twitterDescription: () => siteDescription,
  ogDescription: () => siteDescription,
  ogImage: () => ({
    url: 'https://myopengraph.com/api/v1/render/ba5454a3-0829-48ea-a9e2-25f82d57c250',
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: siteTitle,
  }),
  twitterImage: () => ({
    url: 'https://myopengraph.com/api/v1/render/ba5454a3-0829-48ea-a9e2-25f82d57c250',
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: siteTitle,
  }),
  twitterCard: 'summary_large_image',
  twitterCreator: '@favorodera',
  twitterSite: '@favorodera',
})
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
