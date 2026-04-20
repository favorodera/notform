<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.',
})

const { github, author } = useAppConfig()

const navLinks = [
  { label: 'Docs', to: '/get-started' },
  { label: 'GitHub', to: github.url, target: '_blank' },
  { label: 'Author', to: author.url, target: '_blank' },
]

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false,
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <UHeader
      :ui="{ center: 'flex-1' }"
      to="/"
      class="border-dashed"
      :toggle="false"
    >

      <template #title>
        <AppLogo />
      </template>

      <template #right>
        <UButton
          :to="github.url"
          :icon="github.icon"
          target="_blank"
          size="sm"
          color="primary"
          variant="outline"
        >
          {{ github.label }}
        </UButton>

        <UButton
          to="/get-started"
          icon="i-lucide-book-open"
          size="sm"
          color="primary"
          variant="subtle"
        >
          Docs
        </UButton>

      </template>

    </UHeader>

    <UError
      :error="error"
      :ui="{
        statusMessage: 'text-xl sm:text-2xl',
        message: 'mt-2 text-sm ',
        links: 'mt-3'
      }"
    >
  
      <template #links>
        <UButton
          size="sm"
          color="primary"
          variant="soft"
          icon="lucide:home"
          @click="clearError({ redirect: '/' })"
        >
          Back to home
        </UButton>

        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          icon="lucide:chevron-left"
          @click="()=>{
            clearError()
            $router.back()
          }"
        >
          Go back
        </UButton>
      </template>
  
    </UError>

    <footer
      class="border-t border-dashed border-default"
    >
      <UContainer>
        <div class="flex flex-wrap items-center justify-between gap-4 py-5">

          <!-- Nav links -->
          <nav
            class="flex items-center gap-1"
            aria-label="Footer navigation"
          >
            <template
              v-for="(link, index) in navLinks"
              :key="link.label"
            >
              <UButton
                :to="link.to"
                :target="link.target"
                variant="link"
                color="neutral"
                size="xs"
                class="
                  font-light text-muted
                  hover:text-highlighted
                "
              >
                {{ link.label }}
              </UButton>

              <span
                v-if="index < navLinks.length - 1"
                class="text-xs text-muted/40"
                aria-hidden
              >
                /
              </span>
            </template>
          </nav>

          <!-- Copyright -->
          <span class="text-xs font-light text-muted">
            MIT © {{ new Date().getFullYear() }}
          </span>

        </div>
      </UContainer>
    </footer>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
