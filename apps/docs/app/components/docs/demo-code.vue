<script setup lang="ts">
const props = defineProps<{
  file: string
}>()

const demos = import.meta.glob('../demos/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const code = computed(() => {
  const lookupPath = `../demos/${props.file}`
  const fileContent = demos[lookupPath] as string

  if (!fileContent) {
    return `> **Error**: File \`${props.file}\` not found.`
  }

  const language = props.file.split('.').pop() ?? 'txt'
  return `\`\`\`${language}\n${fileContent.trim()}\n\`\`\``
})
</script>

<template>
  <ClientOnly>
    <MDC
      v-if="code"
      :value="code.trim()"
      class="[&>div]:my-0"
    />
  </ClientOnly>
</template>
