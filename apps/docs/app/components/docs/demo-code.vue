<script lang="ts">
const demos = import.meta.glob('../demos/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
})
</script>

<script setup lang="ts">
const props = defineProps<{
  file: string
}>()

const code = computed(() => {
  const fileContent = demos[`../demos/${props.file}`] as string | undefined
  if (!fileContent) return `> **Error**: File \`${props.file}\` not found.`
  return `\`\`\`vue\n${fileContent.trim()}\n\`\`\``
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
