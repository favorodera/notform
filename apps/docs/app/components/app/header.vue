<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const githubStars = inject<Ref<number>>('githubStars')

const appConfig = useAppConfig()
</script>

<template>
  <Header
    to="/"
    :ui="{ center: 'flex-1' }"
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <ContentSearchButton />
      <ColorModeButton />

      <Button
        :to="appConfig.github.url"
        :icon="appConfig.github.icon"
        target="_blank"
        size="sm"
        variant="soft"
        class="tabular-nums"
        :label="githubStars?.toString()"
      />
    </template>

    <template #body>
      <ContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </Header>
</template>
