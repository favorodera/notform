<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()

const navigationMenuitems = [
  {
    class: ' text-pink-400 hover:text-pink-500',
    external: true,
    label: 'Sponsor',
    target: '_blank',
    to: appConfig.github.sponsor.url,
  },
  {
    external: true,
    label: 'Author',
    target: '_blank',
    to: appConfig.author.url,
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

    <template #right>
      <NavigationMenu
        :items="navigationMenuitems"
        variant="link"
        :ui="{ list: 'flex-wrap justify-center' }"
      />
    </template>
  </Footer>
</template>
