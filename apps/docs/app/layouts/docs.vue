<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <div>
    <DocsHeader />

    <Container>
      <Page>
        <template #left>
          <PageAside>
            <ContentNavigation
              highlight
              :navigation="navigation"
            />
          </PageAside>
        </template>

        <slot />
      </Page>
    </Container>

    <AppFooter />
  </div>
</template>
