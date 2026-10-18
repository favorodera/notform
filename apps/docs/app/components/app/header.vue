<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const runtimeConfig = useRuntimeConfig()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const githubStars = inject<Ref<number>>('githubStars')

const appConfig = useAppConfig()

const navigationMenuItems = [
  {
    class: 'w-fit',
    external: true,
    icon: 'simple-icons:github',
    label: 'Github',
    target: '_blank',
    to: appConfig.github.repo.url,
  },
  {
    class: ' text-pink-400 hover:text-pink-500 **:text-pink-400 **:hover:text-pink-500 w-fit',
    external: true,
    icon: 'tabler:heart',
    label: 'Become a Sponsor',
    target: '_blank',
    to: appConfig.github.sponsor.url,
  },
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
      variant: 'soft',
    }"
    mode="slideover"
  >
    <template #title>
      <AppLogo />

      <Badge
        :label="`v${runtimeConfig.public.version}`"
        variant="soft"
        size="sm"
      />
    </template>

    <template #right>
      <ContentSearchButton
        size="md"
        :collapsed="false"
        variant="soft"
        label="Search"
      />

      <ColorModeButton
        size="md"
        class="max-lg:hidden"
        variant="soft"
      />

      <Button
        :to="appConfig.github.repo.url"
        :icon="appConfig.github.repo.icon"
        target="_blank"
        variant="soft"
        size="md"
        class="max-lg:hidden"
        :label="githubStars?.toString()"
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
      />

      <div class="grid grid-cols-1 place-items-center pbs-8 inline-full">
        <ColorModeSelect />
      </div>
    </template>
  </Header>
</template>
