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
  description: 'We are sorry but this page could not be found.',
  title: 'Page not found',
})

const { author, github } = useAppConfig()

const navLinks = [
  { label: 'Docs', to: '/get-started' },
  { label: 'GitHub', target: '_blank', to: github.url },
  { label: 'Author', target: '_blank', to: author.url },
]

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

const { data: files } = useAsyncData('search', () => queryCollectionSearchSections('docs'))

provide('navigation', navigation)
</script>

<template>
  <App>
    <Header
      :ui="{ center: 'flex-1' }"
      to="/"
      class="border-dashed"
      :toggle="false"
    >
      <template #title>
        <AppLogo />
      </template>

      <template #right>
        <Button
          :to="github.url"
          :icon="github.icon"
          target="_blank"
          size="sm"
          color="primary"
          variant="outline"
        >
          {{ github.label }}
        </Button>

        <Button
          to="/get-started"
          icon="i-lucide-book-open"
          size="sm"
          color="primary"
          variant="subtle"
        >
          Docs
        </Button>
      </template>
    </Header>

    <Error
      :error="error"
      :ui="{
        statusMessage: 'text-xl sm:text-2xl',
        message: 'mt-2 text-sm ',
        links: 'mt-3'
      }"
    >
      <template #links>
        <Button
          size="sm"
          color="primary"
          variant="soft"
          icon="lucide:home"
          @click="clearError({ redirect: '/' })"
        >
          Back to home
        </Button>

        <Button
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
        </Button>
      </template>
    </Error>

    <footer
      class="border-bs border-dashed border-default"
    >
      <Container>
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
              <Button
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
              </Button>

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
      </Container>
    </footer>

    <ClientOnly>
      <LazyContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </App>
</template>
