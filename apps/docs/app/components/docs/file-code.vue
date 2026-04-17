<script setup lang="ts">
const props = defineProps<{
  path: string
  language?: string
}>()

const { data: code } = await useAsyncData(`file-code-${props.path}`, () =>
  $fetch('/api/file-code', {
    query: {
      path: props.path,
      language: props.language,
    },
  }),
)
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
