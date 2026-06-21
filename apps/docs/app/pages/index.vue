<script setup lang="ts">
const { data: page } = await useAsyncData(
  'index',
  () => queryCollection('landing').first(),
  {
    lazy: true,
    server: false,
  },
)
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
