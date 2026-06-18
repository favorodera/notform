<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').first())

if (!page.value) {
  throw createError({
    fatal: true,
    message: 'Sorry, we couldn\'t find the page you\'re looking for.',
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
