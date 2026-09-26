<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const runtimeConfig = useRuntimeConfig()
const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const githubStars = inject<Ref<number>>('githubStars')

const appConfig = useAppConfig()

const navigationMenuItems = [
  {
    active: route.path.startsWith('/docs'),
    icon: 'tabler:book-2',
    label: 'Documentation',
    to: '/docs',
  },
  {
    active: route.path.startsWith('/playground'),
    icon: 'tabler:player-play',
    label: 'Playground',
    to: '/playground',
  },
]
</script>

<template>
  <Header
    to="/"
    :ui="{
      center: 'flex-1',
      title:'items-center'
    }"
    :toggle="{
      variant: 'soft',
    }"
    mode="slideover"
  >
    <template #title>
      <AppLogo />

      <Badge
        :label="`v${runtimeConfig.public.version}`"
        variant="subtle"
        size="sm"
      />
    </template>

    <NavigationMenu
      :items="navigationMenuItems"
      variant="link"
    />

    <template #right>
      <ContentSearchButton
        size="md"
        variant="soft"
      />

      <ColorModeButton
        size="md"
        variant="soft"
      />

      <Button
        :to="appConfig.github.repo.url"
        :icon="appConfig.github.repo.icon"
        target="_blank"
        variant="soft"
        size="md"
        :label="githubStars?.toString()"
      />
    </template>

    <template #body>
      <NavigationMenu
        :items="navigationMenuItems"
        orientation="vertical"
      />

      <Separator class="my-4" />

      <ContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </Header>
</template>
