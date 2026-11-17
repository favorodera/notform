<script setup lang="ts">
import { site } from '#shared/site'

definePageMeta({
  layout: 'playground',
})

const route = useRoute()

const seo = {
  description: 'Interactive Vue 3 playground for NotForm.',
  title: 'Playground',
}

useSeoMeta({
  description: () => {
    return seo.description
  },
  ogUrl: () => {
    return `${site.url}${route.fullPath}`
  },
  title: () => {
    return seo.title
  },
})

defineOgImage(
  'Image.takumi',
  { ...seo },
  [
    { key: 'og' },
    { height: 800, key: 'whatsapp', width: 800 },
  ],
)
</script>

<template>
  <Main class="grid grid-cols-1">
    <h1 class="sr-only">
      NotForm Playground
    </h1>

    <ClientOnly>
      <PlaygroundEditor />

      <template #fallback>
        <div
          class="
            flex flex-col items-center justify-center gap-4 text-sm text-muted
            block-full inline-full
          "
        >
          <div
            class="
              animate-spin rounded-full border-2 border-default
              border-bs-primary block-8 inline-8
            "
            aria-hidden
          />

          <span>Loading playground</span>
        </div>
      </template>
    </ClientOnly>
  </Main>
</template>
