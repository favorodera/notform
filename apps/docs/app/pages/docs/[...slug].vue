<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { copy, copied } = useClipboard()
const { siteUrl } = useAppConfig()

async function copyPage() {
  copy(await $fetch<string>(`/raw${route.path}.md`))
}

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('docs', route.path, { fields: ['description'] }))


useSeoMeta({
  title: () => page.value?.title,
  ogTitle: () => page.value?.title,
  twitterTitle: () => page.value?.title,
  twitterDescription: () => page.value?.description,
  description: () => page.value?.description,
  ogDescription: () => page.value?.description,
  ogUrl: () => `${siteUrl}${route.fullPath}`,
})
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
          @click="copyPage"
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
