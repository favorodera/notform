<script lang="ts">
const sources = import.meta.glob('../../demos/**/*', {
  eager: true,
  import: 'default',
  query: '?raw',
})
</script>

<script setup lang="ts">
const props = defineProps<{
  /** The file name  without extension */
  file: string
}>()

const code = computed(() => {
  // Find the file content in the glob map
  const content = sources[`../../demos/${props.file}.vue`] as string

  if (!content) {
    return `> **Error**: File \`${props.file}\` not found.`
  }

  // Wrap in markdown code block for highlighting, with a disclaimer
  // about demo-only dependencies that aren't part of NotForm itself.
  return `
\`\`\`vue
${content.trim()}
\`\`\`
`
})
</script>

<template>
  <ClientOnly>
    <MDC
      :value="code"
      class="[&>div]:my-0"
    />
  </ClientOnly>
</template>
