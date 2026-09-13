<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { DropdownMenuItem } from '@nuxt/ui'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const githubStars = inject<Ref<number>>('githubStars')

const appConfig = useAppConfig()

const playgroundMenuItems = ref<DropdownMenuItem[]>([
  {
    external: true,
    icon: 'simple-icons:vuedotjs',
    label: 'Core',
    target: '_blank',
    to: 'https://stackblitz.com/edit/notform',
  },
  {
    external: true,
    icon: 'simple-icons:nuxt',
    label: 'Nuxt',
    target: '_blank',
    to: 'https://stackblitz.com/edit/notform-nuxt',
  },
])
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
      <ContentSearchButton
        size="sm"
        variant="soft"
      />

      <DropdownMenu
        :items="playgroundMenuItems"
        :ui="{
          itemLabelExternalIcon: 'hidden',
        }"
      >
        <Button
          icon="tabler:play"
          size="sm"
          variant="soft"
        />
      </DropdownMenu>

      <ColorModeButton
        size="sm"
        variant="soft"
        class="max-sm:hidden"
      />

      <Button
        :to="appConfig.github.repo.url"
        :icon="appConfig.github.repo.icon"
        target="_blank"
        size="sm"
        variant="soft"
        class="tabular-nums"
        :label="githubStars?.toString()"
      />

      <Tooltip
        text="Sponsor on GitHub"
        :delay-duration="0"
        arrow
      >
        <Button
          :to="appConfig.github.sponsor.url"
          :icon="appConfig.github.sponsor.icon"
          target="_blank"
          size="sm"
          variant="soft"
          aria-label="Sponsor on GitHub"
          class="text-pink-500"
        />
      </Tooltip>
    </template>

    <template #body>
      <ContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </Header>
</template>
