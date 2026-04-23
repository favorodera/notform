<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { github } = useAppConfig()
</script>

<template>
  <UHeader
    :ui="{
      center: 'flex-1' ,
      body:'px-0!'
    }"
    to="/"
    class="border-dashed"
  >

    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <UContentSearchButton />

      <UColorModeButton />

      <UButton
        :to="github.url"
        :icon="github.icon"
        :ui="{
          label:'max-lg:hidden',
        }"
        target="_blank"
        size="sm"
        color="primary"
        variant="outline"
        :label="github.label"
      />

    </template>

    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
        :ui="{
          list: 'mx-0 mt-0',
          listWithChildren: 'ms-0 border-s-0 border-dashed',
          item: 'border-t border-default p-0! border-dashed',
          itemWithChildren: 'border-t border-default font-normal',
          linkTitle:'font-normal!',
          link: 'px-3 py-3 rounded-none before:rounded-none',
          linkLeadingIcon: 'size-5'
        }"
      />
    </template>

  </UHeader>
</template>
