<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <div>
    <AppHeader />

    <Container>
      <Page>
        <template #left>
          <PageAside>
            <ContentNavigation
              :navigation="navigation"
              :collapsible="false"
            />
          </PageAside>
        </template>

        <Main>
          <slot />
        </Main>
      </Page>
    </Container>
  </div>
</template>
