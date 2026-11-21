<script setup lang="ts">
import { siteConfig } from '#shared/site'

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

const seo = computed(() => {
  return {
    description: page.data.value?.description ?? siteConfig.description,
    title: page.data.value?.title ?? siteConfig.name,
  }
})

useSeoMeta({
  description: () => {
    return seo.value.description
  },
  ogUrl: () => {
    return `${siteConfig.url}${route.fullPath}`
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
  siteConfig.ogImageVariants,
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
          <!--
            Large screens only: ContentToc hides this slot below `lg`. On
            smaller screens the same card is the last item of the mobile menu.
          -->
          <template #bottom>
            <AppSponsorCard />
          </template>
        </ContentToc>
      </template>
    </Page>
  </Main>
</template>
