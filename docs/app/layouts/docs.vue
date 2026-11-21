<script setup lang="ts">
const navigation = useCollectionNavigation('docs')
</script>

<template>
  <div>
    <AppHeader />

    <Container>
      <Page>
        <template #left>
          <PageAside>
            <ContentNavigation
              :navigation="navigation.data.value"
              :collapsible="false"
            />
          </PageAside>
        </template>

        <slot />
      </Page>
    </Container>

    <AppFooter />
  </div>
</template>
