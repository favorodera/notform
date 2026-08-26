<script setup lang="ts">
const { siteDescription, siteName, siteTitle } = useAppConfig()

const navigation = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

const sectionsSearch = useAsyncData('search', () => queryCollectionSearchSections('docs'))

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

defineOgImage('OgImage.takumi', {
  description: 'Vue Forms Without the Friction.',
  title: 'NotForm',
})
</script>

<template>
  <App
    :toaster="{
      progress:false,
      position:'top-center',
      duration:4000
    }"
  >
    <Main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Main>

    <ClientOnly>
      <LazyContentSearch
        :files="sectionsSearch.data.value"
        :navigation="navigation.data.value"
      />
    </ClientOnly>
  </App>
</template>
