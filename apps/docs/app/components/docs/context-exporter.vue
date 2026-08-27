<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { withoutTrailingSlash } from 'ufo'

const route = useRoute()
const toast = useToast()
const clipboard = useClipboard({ legacy: true })
const site = useSiteConfig()

const routePath = computed(() => withoutTrailingSlash(route.path))
const mdPath = computed(() => `${site.url}/raw${routePath.value}.md`)

const items = [
  {
    icon: 'tabler:link',
    label: 'Copy Markdown link',
    onSelect() {
      clipboard.copy(mdPath.value)
      toast.add({
        icon: 'tabler:circle-check',
        title: 'Copied to clipboard',
      })
    },
  },
  {
    icon: 'simple-icons:markdown',
    label: 'View as Markdown',
    target: '_blank',
    to: `/raw${routePath.value}.md`,
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
  {
    icon: 'tabler:brand-x',
    label: 'Open in Grok',
    target: '_blank',
    to: `https://x.com/i/grok?text=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
  },
]

/** Copy the current page markdown to the clipboard */
async function copyPage() {
  const pageMarkdown = await $fetch<string>(`/raw${route.path}.md`)

  clipboard.copy(pageMarkdown)
}
</script>

<template>
  <FieldGroup>
    <Button
      :label="clipboard.copied.value ? 'Copied' : 'Copy Markdown'"
      :icon="clipboard.copied.value ? 'tabler:check' : 'tabler:copy'"
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
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <Button
        icon="tabler:chevron-down"
        size="sm"
        color="neutral"
        variant="outline"
        aria-label="Open copy actions menu"
      />
    </DropdownMenu>
  </FieldGroup>
</template>
