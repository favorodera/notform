<script setup lang="ts">
import type { PageLink } from '@nuxt/ui'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const appConfig = useAppConfig()

const page = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path)
    .first()
})

if (!page.data.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const pageSurround = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description'],
  })
})

const tocFooterLinks = computed<PageLink[]>(() => {
  return [
    {
      icon: 'tabler:play',
      label: 'Playground',
      to: `/playground`,
    },
    appConfig.github.changelog,
    appConfig.github.sponsor,
  ]
})

const seo = computed(() => {
  return {
    description: page.data.value?.description ?? appConfig.siteDescription,
    title: page.data.value?.title ?? appConfig.siteName,
  }
})

useSeoMeta({
  description: () => {
    return seo.value.description
  },
  ogUrl: () => {
    return `${appConfig.siteUrl}${route.fullPath}`
  },
  title: () => {
    return seo.value.title
  },
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
          <DocsContextExporter />
        </template>
      </PageHeader>

      <PageBody>
        <ContentRenderer
          v-if="page.data.value"
          :value="page.data.value"
        />

        <ContentSurround
          :surround="pageSurround.data.value"
          :ui="{
            link:'p-4',
            linkDescription:'truncate line-clamp-1'
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
            title:'text-xs text-muted font-medium',
            link:'text-[0.8rem]',
          }"
        >
          <template #bottom>
            <Separator />

            <PageLinks
              :links="tocFooterLinks"
              :ui="{
                linkLabelExternalIcon: 'hidden',
                linkLabel:'flex'
              }"
            />
          </template>
        </ContentToc>
      </template>
    </Page>
  </div>
</template>
