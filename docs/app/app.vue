<script setup lang="ts">
const navigation = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('docs')
})

const sectionsSearch = useAsyncData('search', () => {
  return queryCollectionSearchSections('docs')
})

const githubStars = useFetch('/api/github/stars')

const resolvedNavigation = computed(() => {
  return navigation.data.value?.[0]?.children ?? []
})

provide('navigation', resolvedNavigation)
provide('githubStars', githubStars.data)

useSeoMeta({
  colorScheme: 'dark light',
  googleSiteVerification: 'qYU6PqljRftNzCNBLdEFxnKJKwH-Aj7aJ9CLp6itnhM',
  twitterCard: 'summary_large_image',
  twitterCreator: '@favorodera',
  twitterSite: '@favorodera',
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
