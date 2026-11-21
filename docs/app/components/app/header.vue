<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { type ContentCollectionName, isContentCollectionName } from '#shared/content-collections'
import { siteConfig, type SiteLink } from '#shared/site'

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

/**
 * Checks whether the current route belongs to a navigation link.
 * @param link Link from `siteConfig`.
 * @returns `true` when the route is the link's `activePrefix` or sits below it.
 * @remarks
 * Matching whole path segments keeps `/docs` active on `/docs/guides/validation`
 * without also matching `/docs-archive`. Links without an `activePrefix`, such
 * as external ones, are never active.
 *
 * The active state is passed to `NavigationMenu` explicitly because a link such
 * as Documentation points at one page but should stay highlighted across the
 * whole section.
 */
function isLinkActive(link: SiteLink) {
  const { activePrefix } = link

  if (!activePrefix) {
    return false
  }

  return route.path === activePrefix || route.path.startsWith(`${activePrefix}/`)
}

/**
 * Primary navigation items shared by the desktop header and the mobile menu.
 * @remarks
 * Built from `siteConfig.navigation`, so changing the links there updates both
 * places. Recomputed on every route change to keep the active state current.
 */
const navigationItems = computed<NavigationMenuItem[]>(() => {
  return siteConfig.navigation.map((link) => {
    return {
      active: isLinkActive(link),
      external: link.external,
      label: link.label,
      target: link.external ? '_blank' : undefined,
      to: link.to,
    }
  })
})

/**
 * Mobile menu items: the primary navigation plus a GitHub link.
 * @remarks
 * On desktop the GitHub link lives in the header as a button with the star
 * count. That button is hidden on small screens, so the menu carries the link
 * instead, with the same star count as a badge.
 */
const mobileNavigationItems = computed<NavigationMenuItem[]>(() => {
  return [
    ...navigationItems.value,
    {
      badge: {
        label: githubStars.data.value,
        size: 'sm',
        variant: 'subtle',
      },
      external: true,
      label: siteConfig.links.github.label,
      target: '_blank',
      to: siteConfig.links.github.to,
    },
  ]
})
</script>

<template>
  <Header
    to="/"
    :ui="{
      root: 'border-none',
      title: 'items-center',
    }"
    :toggle="{
      variant: 'subtle',
    }"
    mode="slideover"
  >
    <template #title>
      <AppLogo />

      <Badge
        :label="`v${siteConfig.version}`"
        variant="subtle"
        size="sm"
        class="block-4"
      />
    </template>

    <!-- Center of the header. Hidden below the `lg` breakpoint by Header itself. -->
    <NavigationMenu
      :items="navigationItems"
      aria-label="Primary"
    />

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
          :links="search.links.value"
          :navigation="search.navigation.value"
          :search="search.search"
          :search-status="search.status.value"
          :color-mode="false"
          placeholder="Search documentation..."
        />
      </ClientOnly>

      <Button
        :aria-label="`${siteConfig.links.github.label} repository`"
        :label="githubStars.data.value"
        :to="siteConfig.links.github.to"
        external
        icon="simple-icons:github"
        size="sm"
        target="_blank"
        variant="subtle"
        class="max-lg:hidden"
      />

      <ColorModeButton
        size="sm"
        variant="subtle"
      />
    </template>

    <!--
      Mobile menu. Links first, then the documentation tree (docs routes only),
      then the sponsor card.
    -->
    <template #body>
      <NavigationMenu
        :items="mobileNavigationItems"
        aria-label="Primary"
        orientation="vertical"
      />

      <template v-if="navigation.data.value.length > 0">
        <Separator class="my-4" />

        <ContentNavigation
          :navigation="navigation.data.value"
          :collapsible="false"
        />
      </template>

      <AppSponsorCard class="mbs-8" />
    </template>
  </Header>
</template>
