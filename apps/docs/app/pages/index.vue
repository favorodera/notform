<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').first())

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    message: 'Sorry, we couldn\'t find the page you\'re looking for.',
    fatal: true,
  })
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
