<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    message: 'Sorry, we couldn\'t find the page you\'re looking for.',
    fatal: true,
  })
}

const { copy, copied } = useClipboard({ source: await $fetch<string>(`/raw${route.path}.md`), legacy: true })
const { siteUrl, siteName, siteDescription } = useAppConfig()

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('docs', route.path, { fields: ['description'] }))

const seo = computed(() => {
  return {
    title: page.value?.title ?? siteName,
    description: page.value?.description ?? siteDescription,
  }
})

useSeoMeta({
  title: () => seo.value.title,
  ogTitle: () => seo.value.title,
  twitterTitle: () => seo.value.title,
  twitterDescription: () => seo.value.description,
  description: () => seo.value.description,
  ogDescription: () => seo.value.description,
  ogUrl: () => `${siteUrl}${route.fullPath}`,
})

defineOgImage('Docs.takumi', { ...seo.value })
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      class="flex w-full flex-col-reverse"
      :ui="{
        title:'text-[1.75em] font-semibold',
        headline:'mb-0 mt-2.5'
      }"
    >
  
      <template #headline>
        <UButton
          :label="copied ? 'Copied' : 'Copy Markdown'"
          :icon="copied ? 'lucide:check' : 'lucide:copy'"
          color="neutral"
          variant="outline"
          size="sm"
          @click="copy()"
        />

      </template>

    </UPageHeader>

    <UPageBody
      class="
        pb-6
        md:pb-8
        xl:pb-14
      "
    >
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="page.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :links="page.body?.toc?.links"
        :ui="{
          title:'text-sm text-muted font-normal',
          indicator:'ms-0',
          container:'py-3! sm:py-3!'
        }"
        highlight
        highlight-variant="circuit"
        class="
          border-y border-dashed border-default
          lg:border-x
        "
      >

        <template #leading>
          <Icon
            name="lucide:text-align-start"
            class="size-4 text-muted"
          />
        </template>
    
      </UContentToc>
    </template>

  </UPage>
</template>
