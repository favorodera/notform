<script setup lang="ts">
definePageMeta({
  layout: 'playground',
})

const appConfig = useAppConfig()
const route = useRoute()

const seo = {
  description: 'Interactive Vue 3 form playground for NotForm. Edit forms, test schema validation and dynamic fields, and share reproducible examples in your browser.',
  title: 'Playground',
}

useSeoMeta({
  description: () => seo.description,
  ogUrl: () => `${appConfig.siteUrl}${route.fullPath}`,
  title: () => seo.title,
})

defineOgImage('Image.takumi', { ...seo })
</script>

<template>
  <Main>
    <h1
      class="sr-only"
    >
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
