<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const appConfig = useAppConfig()

const page = await useAsyncData(route.path, () => queryCollection('docs').path(route.path)
  .first())

if (!page.data.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const pageMarkdown = await useAsyncData(`${route.path}-markdown`, () => $fetch<string>(`/raw${route.path}.md`))

const clipboard = useClipboard({
  legacy: true,
  source: computed(() => pageMarkdown.data.value ?? ''),
})

const pageSurround = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description'],
  })
})

const seo = computed(() => {
  return {
    description: page.data.value?.description ?? appConfig.siteDescription,
    title: page.data.value?.title ?? appConfig.siteName,
  }
})

useSeoMeta({
  description: () => seo.value.description,
  ogDescription: () => seo.value.description,
  ogTitle: () => seo.value.title,
  ogUrl: () => `${appConfig.siteUrl}${route.fullPath}`,
  title: () => seo.value.title,
  twitterDescription: () => seo.value.description,
  twitterTitle: () => seo.value.title,
})

defineOgImage('Image.takumi', { ...seo.value })
</script>

<template>
  <div>
    <Page v-if="page.data.value">
      <PageHeader
        :title="page.data.value.title"
        :description="page.data.value.description"
      >
        <template #links>
          <Button
            :label="clipboard.copied.value ? 'Copied' : 'Copy Markdown'"
            :icon="clipboard.copied.value ? 'tabler:check' : 'tabler:copy'"
            color="neutral"
            variant="outline"
            size="sm"
            @click="clipboard.copy()"
          />
        </template>
      </PageHeader>

      <PageBody>
        <ContentRenderer
          v-if="page"
          :value="page"
        />

        <ContentSurround
          :surround="pageSurround.data.value"
          :ui="{
            link:'p-4'
          }"
        />
      </PageBody>

      <template
        v-if="page.data.value?.body?.toc?.links?.length"
        #right
      >
        <ContentToc
          :links="page.data.value?.body?.toc?.links"
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
