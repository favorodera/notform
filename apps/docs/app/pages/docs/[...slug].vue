<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('docs', route.path, { fields: ['description'] }))

useSeoMeta({
  title: () => page.value.title,
  ogTitle: () => page.value.title,
  description: () => page.value.description,
  ogDescription: () => page.value.description,
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
    >
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>

       <template
      v-if="page.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        title="On this page"
        :links="page.body?.toc?.links"
      >

      </UContentToc>
    </template>

  </UPage>
</template>