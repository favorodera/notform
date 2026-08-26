<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()

const { data: page } = await useAsyncData(
  route.path,
  () => queryCollection('docs')
    .path(route.path)
    .first(),
)
if (!page.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const { data: markdownContent } = await useAsyncData(`${route.path}-markdown`, () => $fetch<string>(`/raw${route.path}.md`))

const { copied, copy } = useClipboard({
  legacy: true,
  source: computed(() => markdownContent.value ?? ''),
})

const { siteDescription, siteName, siteUrl } = useAppConfig()

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description'],
  })
})

const seo = computed(() => {
  return {
    description: page.value?.description ?? siteDescription,
    title: page.value?.title ?? siteName,
  }
})

useSeoMeta({
  description: () => seo.value.description,
  ogDescription: () => seo.value.description,
  ogTitle: () => seo.value.title,
  ogUrl: () => `${siteUrl}${route.fullPath}`,
  title: () => seo.value.title,
  twitterDescription: () => seo.value.description,
  twitterTitle: () => seo.value.title,
})

defineOgImage('OgImage.takumi', { ...seo.value })
</script>

<template>
  <div>
    <Page v-if="page">
      <PageHeader
        :title="page.title"
        :description="page.description"
      >
        <template #links>
          <Button
            :label="copied ? 'Copied' : 'Copy Markdown'"
            :icon="copied ? 'lucide:check' : 'lucide:copy'"
            color="neutral"
            variant="outline"
            size="sm"
            @click="copy()"
          />
        </template>
      </PageHeader>

      <PageBody>
        <ContentRenderer
          v-if="page"
          :value="page"
        />

        <ContentSurround
          :surround="surround"
          :ui="{
            link:'p-4'
          }"
        />
      </PageBody>

      <template
        v-if="page?.body?.toc?.links?.length"
        #right
      >
        <ContentToc
          :links="page?.body?.toc?.links"
          :ui="{
            title:'text-sm text-muted font-normal',
          }"
          highlight
          highlight-variant="circuit"
        />
      </template>
    </Page>
  </div>
</template>
