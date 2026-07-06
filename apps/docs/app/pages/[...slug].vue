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

defineOgImage('Docs.takumi', { ...seo.value })
</script>

<template>
  <div>
    <UPage v-if="page">
      <UPageHeader
        :title="page.title"
        :description="page.description"
        class="flex inline-full flex-col-reverse"
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
          pbe-6

          md:pbe-8

          xl:pbe-14
        "
      >
        <ContentRenderer
          v-if="page"
          :value="page"
        />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template
        v-if="page?.body?.toc?.links?.length"
        #right
      >
        <UContentToc
          :links="page?.body?.toc?.links"
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
              class="block-4 inline-4 text-muted"
            />
          </template>
        </UContentToc>
      </template>
    </UPage>
  </div>
</template>
