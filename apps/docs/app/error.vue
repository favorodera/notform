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

const navigation = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

const sectionsSearch = useAsyncData('search', () => queryCollectionSearchSections('docs'))

const githubStars = useFetch('/api/github/stars')

const resolvedNavigation = computed(() => navigation.data.value?.[0]?.children ?? [])

provide('navigation', resolvedNavigation)
provide('githubStars', githubStars.data)
</script>

<template>
  <App>
    <AppHeader />
    <Error :error="error" />
    <AppFooter />

    <ClientOnly>
      <LazyContentSearch
        :files="sectionsSearch.data.value"
        :navigation="resolvedNavigation"
      />
    </ClientOnly>
  </App>
</template>
