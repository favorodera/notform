<script setup lang="ts">
import type { PageLink } from '@nuxt/ui'
import { site } from '#shared/site'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()

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
    {
      external: true,
      icon: 'tabler:clock-code',
      label: 'Releases',
      target: '_blank',
      to: site.github.releases,
    },
    {
      external: true,
      icon: 'tabler:heart',
      label: 'Become a sponsor',
      target: '_blank',
      to: site.github.sponsor,
    },
  ]
})

const seo = computed(() => {
  return {
    description: page.data.value?.description ?? site.description,
    title: page.data.value?.title ?? site.name,
  }
})

useSeoMeta({
  description: () => {
    return seo.value.description
  },
  ogUrl: () => {
    return `${site.url}${route.fullPath}`
  },
  title: () => {
    return seo.value.title
  },
})

defineOgImage(
  'Image.takumi',
  {
    description: () => {
      return seo.value.description
    },
    label: 'DOCUMENTATION',
    title: () => {
      return seo.value.title
    },
  },
  [
    { key: 'og' },
    { height: 800, key: 'whatsapp', width: 800 },
  ],
)
</script>

<template>
  <Main class="grid grid-cols-1">
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

        <Separator />

        <ContentSurround
          :surround="pageSurround.data.value"
          prev-icon="tabler:chevron-left"
          next-icon="tabler:chevron-right"
        />
      </PageBody>

      <template
        v-if="page.data.value?.body?.toc?.links?.length"
        #right
      >
        <ContentToc
          :links="page.data.value?.body?.toc?.links"
          :ui="{
            title: 'text-xs text-muted font-medium',
            link: 'text-[0.8rem]',
          }"
        >
          <template #bottom>
            <Separator />

            <PageLinks
              :links="tocFooterLinks"
              :ui="{
                linkLabelExternalIcon: 'hidden',
                linkLabel: 'flex',
              }"
            />
          </template>
        </ContentToc>
      </template>
    </Page>
  </Main>
</template>
