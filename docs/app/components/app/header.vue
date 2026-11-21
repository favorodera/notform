<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { type ContentCollectionName, isContentCollectionName } from '#shared/content-collections'
import { site } from '#shared/site'

const search = useSearch()

const route = useRoute()

/**
 * Collection selected from the first route path segment.
 * @remarks
 * Routes outside the content collections fall back to `''`. 
 * 
 * This removes the header navigation from DOM.
 */
const collection = computed<ContentCollectionName>(() => {
  const routeCollection = route.path.split('/').find(Boolean)

  if (routeCollection && isContentCollectionName(routeCollection)) {
    return routeCollection
  }

  return '' as ContentCollectionName
})

const navigation = useCollectionNavigation(collection)

const numberFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const githubStars = useFetch('/api/github/stars', {
  default: () => {
    return '20' // shown while pending or on error
  },
  key: 'github-stars',
  lazy: true, // don't block navigation
  transform: (stars: number) => {
    return numberFormatter.format(stars)
  },
})

const navigationMenuItems = computed(() => {
  return [
    {
      icon: 'tabler:play',
      label: 'Playground',
      to: `/playground`,
    },
    {
      badge: {
        label: githubStars.data.value,
        size: 'sm',
        variant: 'subtle',
      },
      external: true,
      icon: 'simple-icons:github',
      label: 'GitHub',
      target: '_blank',
      to: site.github.url,
    },
    {
      external: true,
      icon: 'tabler:clock-code',
      label: 'Releases',
      target: '_blank',
      to: site.github.releases,
    },
    {
      external: true,
      icon: 'tabler:heart',
      label: 'Become a sponsor',
      target: '_blank',
      to: site.github.sponsor,
    },
  ] satisfies NavigationMenuItem[]
})
</script>

<template>
  <Header
    to="/"
    :ui="{
      center: 'flex-1',
      title: 'items-center',
      root: 'border-none',
    }"
    :toggle="{
      variant: 'subtle',
    }"
    mode="slideover"
  >
    <template #title>
      <AppLogo />

      <Badge
        :label="`v${site.version}`"
        variant="subtle"
        size="sm"
        class="block-4"
      />
    </template>

    <template #right>
      <ContentSearchButton
        size="sm"
        :collapsed="false"
        variant="subtle"
        class="max-lg:hidden"
        label="Search"
      />

      <ContentSearchButton
        size="sm"
        variant="subtle"
        class="lg:hidden"
      />

      <ClientOnly>
        <LazyContentSearch
          :navigation="search.navigation.value"
          :search="search.search"
          :search-status="search.status.value"
          :color-mode="false"
          placeholder="Search documentation..."
        />
      </ClientOnly>

      <Button
        v-bind="navigationMenuItems[1]"
        variant="subtle"
        size="sm"
        class="max-lg:hidden"
        :label="githubStars.data.value"
      />

      <ColorModeButton
        size="sm"
        variant="subtle"
      />
    </template>

    <template #body>
      <ContentNavigation
        :navigation="navigation.data.value"
        :collapsible="false"
      />

      <Separator
        v-if="navigation.data.value.length > 0"
        class="my-4"
      />

      <NavigationMenu
        :items="navigationMenuItems"
        orientation="vertical"
        :ui="{
          item: 'w-fit',
        }"
      />
    </template>
  </Header>
</template>
