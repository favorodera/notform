<script setup lang="ts">
const { github } = useAppConfig()
</script>

<template>
  <Motion
    as-child
    :initial="{ opacity: 0, y: -14 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.05
    }"
  >
    <Header
      :ui="{ center: 'flex-1' }"
      to="/"
      class="border-dashed"
      :toggle="false"
    >
      <template #title>
        <AppLogo />
      </template>

      <template #right>
        <Button
          :to="github.url"
          :icon="github.icon"
          target="_blank"
          size="sm"
          color="primary"
          variant="outline"
        >
          {{ github.label }}
        </Button>

        <Button
          to="/get-started"
          icon="i-lucide-book-open"
          size="sm"
          color="primary"
          variant="subtle"
        >
          Docs
        </Button>
      </template>
    </Header>
  </Motion>
</template>
