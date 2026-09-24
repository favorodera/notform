<script setup lang="ts">
const { siteDescription, siteName, siteTitle } = useAppConfig()

const navigation = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

const sectionsSearch = useAsyncData('search', () => queryCollectionSearchSections('docs'))

const githubStars = useFetch('/api/github/stars')

const resolvedNavigation = computed(() => navigation.data.value?.[0]?.children ?? [])

provide('navigation', resolvedNavigation)
provide('githubStars', githubStars.data)

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

defineOgImage('Image.takumi', {
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
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <ClientOnly>
      <LazyContentSearch
        :files="sectionsSearch.data.value"
        :navigation="resolvedNavigation"
      />
    </ClientOnly>
  </App>
</template>
