<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const runtimeConfig = useRuntimeConfig()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const githubStars = inject<Ref<number>>('githubStars')

const appConfig = useAppConfig()

const navigationMenuItems = [
  {
    icon: 'tabler:play',
    label: 'Playground',
    to: `/playground`,
  },
  appConfig.github.repo,
  appConfig.github.changelog,
  appConfig.github.sponsor,
] satisfies NavigationMenuItem[]
</script>

<template>
  <Header
    to="/"
    :ui="{
      center: 'flex-1',
      title:'items-center',
      root:'border-none'
    }"
    :toggle="{
      variant: 'subtle',
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

    <template #right>
      <ContentSearchButton
        size="sm"
        :collapsed="false"
        variant="subtle"
        label="Search"
      />

      <Button
        v-bind="appConfig.github.repo"
        variant="subtle"
        size="sm"
        class="max-lg:hidden"
        :label="githubStars?.toString()"
      />

      <ColorModeButton
        size="sm"
        class="max-lg:hidden"
        variant="subtle"
      />
    </template>

    <template #body>
      <ContentNavigation
        :navigation="navigation"
        :collapsible="false"
      />

      <Separator class="my-4" />

      <NavigationMenu
        :items="navigationMenuItems"
        orientation="vertical"
        :ui="{
          item:'w-fit'
        }"
      />

      <div class="grid grid-cols-1 place-items-center pbs-8 inline-full">
        <ColorModeSelect />
      </div>
    </template>
  </Header>
</template>
