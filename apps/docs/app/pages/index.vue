<script setup lang="ts">
const page = await useAsyncData('index', () => queryCollection('landing').first())

if (!page.data.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}
</script>

<template>
  <div>
    <ContentRenderer
      v-if="page.data.value"
      :value="page.data.value"
      :prose="false"
    />
  </div>
</template>
