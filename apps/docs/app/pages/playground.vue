<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()

const seo = {
  description: 'Interactive Vue 3 playground for NotForm. Test headless form state, and Standard Schema validation live in your browser.',
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
  <div class="py-2 block-[95%] inline-full">
    <ClientOnly>
      <PlaygroundEditor />

      <template #fallback>
        <PlaygroundSpinner>
          Loading playground
        </PlaygroundSpinner>
      </template>
    </ClientOnly>
  </div>
</template>
