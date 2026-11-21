<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { siteConfig } from '#shared/site'

const route = useRoute()
const toast = useToast()
const clipboard = useClipboard({ legacy: true })
const appConfig = useAppConfig()

const routePath = computed(() => {
  return route.path.replace(/\/$/, '') || '/'
})

const mdPath = computed(() => {
  return `${siteConfig.url}${routePath.value === '/' ? '/index' : routePath.value}.md`
})

const items = computed(() => {
  return [
    {
      icon: 'tabler:link',
      label: 'Copy Markdown link',
      onSelect() {
        clipboard.copy(mdPath.value)
        toast.add({
          icon: appConfig.ui.icons.check,
          title: 'Copied to clipboard',
        })
      },
    },
    {
      icon: 'simple-icons:markdown',
      label: 'View as Markdown',
      target: '_blank',
      to: `${routePath.value}.md`,
    },
    {
      icon: 'simple-icons:openai',
      label: 'Open in ChatGPT',
      target: '_blank',
      to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
    },
    {
      icon: 'simple-icons:claude',
      label: 'Open in Claude',
      target: '_blank',
      to: `https://claude.ai/new?q=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
    },
  ]
})

async function copyPage() {
  const pageMarkdown = await $fetch<string>(`${routePath.value}.md`)

  clipboard.copy(pageMarkdown)
}
</script>

<template>
  <FieldGroup>
    <Button
      label="Copy Markdown"
      :icon="clipboard.copied.value ?  appConfig.ui.icons.check : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      size="sm"
      @click="copyPage"
    />

    <DropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8,
      }"
      :ui="{
        content: 'w-48',
      }"
    >
      <Button
        :icon="appConfig.ui.icons.chevronDown"
        size="sm"
        color="neutral"
        variant="outline"
        aria-label="Open copy actions menu"
      />
    </DropdownMenu>
  </FieldGroup>
</template>
