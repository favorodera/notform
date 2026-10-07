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
    icon: 'tabler:play',
    label: 'Playground',
    to: `/playground`,
  },
  {
    external: true,
    icon: 'simple-icons:stackblitz',
    label: 'Stackblitz(Vue 3)',
    target: '_blank',
    to: `https://stackblitz.com/edit/notform`,
    ui: {
      linkLeadingIcon: 'text-info',
    },
  },
  {
    external: true,
    icon: 'simple-icons:stackblitz',
    label: 'Stackblitz(Nuxt 4)',
    target: '_blank',
    to: `https://stackblitz.com/edit/notform-nuxt`,
    ui: {
      linkLeadingIcon: 'text-info',
    },
  },
  {
    external: true,
    icon: 'tabler:history',
    label: 'Releases',
    target: '_blank',
    to: 'https://github.com/favorodera/notform/releases',
  },
  {
    class: 'font-semibold text-pink-400 hover:text-pink-500',
    external: true,
    icon: 'tabler:heart',
    label: 'Become a sponsor',
    target: '_blank',
    to: 'https://github.com/sponsors/favorodera',
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
  ogUrl: () => `${appConfig.siteUrl}${route.fullPath}`,
  title: () => seo.value.title,
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
                linkLabelExternalIcon: 'relative',
                linkLabel:'flex'
              }"
            />
          </template>
        </ContentToc>
      </template>
    </Page>
  </div>
</template>
