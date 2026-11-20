<script setup lang="ts">
import { site } from '#shared/site'

const navigation = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('docs')
})

const sectionsSearch = useAsyncData('search', () => {
  return queryCollectionSearchSections('docs')
})

const resolvedNavigation = computed(() => {
  return navigation.data.value?.[0]?.children ?? []
})

provide('navigation', resolvedNavigation)

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
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyContentSearch
        :files="sectionsSearch.data.value"
        :navigation="resolvedNavigation"
        :color-mode="false"
        placeholder="Search documentation..."
      />
    </ClientOnly>
  </App>
</template>
