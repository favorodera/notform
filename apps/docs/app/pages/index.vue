<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').first())

if (!page.value) {
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
      v-if="page"
      :value="page"
      :prose="false"
    />
  </div>
</template>
