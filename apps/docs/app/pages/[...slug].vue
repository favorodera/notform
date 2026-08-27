<script setup lang="ts">
import type { PageLink } from '@nuxt/ui'
import { computed } from '#imports'

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

const pageSurround = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description'],
  })
})

const tocFooterLinks = computed<PageLink[]>(() => [
  {
    icon: 'tabler:edit',
    label: 'Edit this page',
    target: '_blank',
    to: `https://github.com/favorodera/notform/edit/main/apps/docs/content/${page.data.value?.stem}.md`,
  }, {
    icon: 'tabler:star',
    label: 'Star on GitHub',
    target: '_blank',
    to: 'https://github.com/favorodera/notform',
  }, {
    icon: 'tabler:rocket',
    label: 'Releases',
    to: 'https://github.com/favorodera/notform/releases',
  },
])

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
            title:'text-sm text-muted font-normal',
          }"
          highlight
          highlight-variant="circuit"
        >
          <template #bottom>
            <Separator />

            <PageLinks
              :links="tocFooterLinks"
              :ui="{
                linkLabelExternalIcon: 'hidden',
              }"
            />
          </template>
        </ContentToc>
      </template>
    </Page>
  </div>
</template>
