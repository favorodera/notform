<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()

const navigationMenuitems = [
  {
    as: 'span',
    class: 'p-0',
    content: {
      align: 'start' as const,
    },
    items: [
      {
        external: true,
        icon: 'simple-icons:vuedotjs',
        label: 'Vue Playground',
        target: '_blank',
        to: 'https://stackblitz.com/edit/notform',
      },
      {
        external: true,
        icon: 'simple-icons:nuxt',
        label: 'Nuxt Playground',
        target: '_blank',
        to: 'https://stackblitz.com/edit/notform-nuxt',
      },
    ] satisfies DropdownMenuItem[],
    slot: 'playground' as const,
  },
  {
    external: true,
    label: 'GitHub Releases',
    target: '_blank',
    to: 'https://github.com/favorodera/notform/releases',
  },
] satisfies NavigationMenuItem[]
</script>

<template>
  <Footer class="border-bs border-default">
    <template #left>
      <p class="text-sm font-light text-muted">
        Published under <NuxtLink
          class="
            font-medium text-default

            hover:underline
          "
          to="https://github.com/favorodera/notform/blob/main/LICENSE"
          external
          rel="noopener noreferrer"
          target="_blank"
        >
          MIT License
        </NuxtLink>
      </p>
    </template>

    <NavigationMenu
      :items="navigationMenuitems"
      variant="link"
      :ui="{ list: 'flex-wrap justify-center' }"
    >
      <template #playground="{ item }">
        <DropdownMenu
          :content="item.content"
          :items="item.items"
        >
          <Button
            label="Playground"
            variant="link"
            color="neutral"
          />
        </DropdownMenu>
      </template>
    </NavigationMenu>

    <template #right>
      <p class="text-sm font-light text-muted">
        Made by <NuxtLink
          class="
            font-medium text-default

            hover:underline
          "
          :to="appConfig.author.url"
          external
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ appConfig.author.name }}
        </NuxtLink>
      </p>
    </template>
  </Footer>
</template>
