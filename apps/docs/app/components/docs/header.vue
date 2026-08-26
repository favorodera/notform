<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { github } = useAppConfig()
</script>

<template>
  <Header
    to="/"
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <ContentSearchButton />
      <ColorModeButton />

      <Button
        :to="github.url"
        :icon="github.icon"
        :ui="{
          label:'max-sm:hidden',
        }"
        target="_blank"
        size="sm"
        color="primary"
        variant="outline"
        :label="github.label"
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
