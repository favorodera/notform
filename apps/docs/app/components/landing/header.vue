<script setup lang="ts">
const { github } = useAppConfig()
</script>

<template>
  <Motion
    as-child
    :initial="{ opacity: 0, y: -14 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1], delay: 0.05 }"
  >
    <UHeader
      :ui="{ center: 'flex-1' }"
      to="/"
      class="h-14 border-dashed"
      :toggle="false"
    >

      <template #title>
        <Logo />
      </template>

      <template #right>
        <UButton
          :to="github.url"
          :icon="github.icon"
          target="_blank"
          size="sm"
          color="primary"
          variant="outline"
        >
          {{ github.label }}
        </UButton>

        <UButton
          to="/docs"
          icon="i-lucide-book-open"
          size="sm"
          color="primary"
          variant="subtle"
        >
          Docs
        </UButton>

      </template>

    </UHeader>
  </Motion>
</template>
