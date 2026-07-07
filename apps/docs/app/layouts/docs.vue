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
          <PageAside
            class="
              border-x border-dashed border-default

              lg:px-0!
            "
          >
            <ContentNavigation
              highlight
              :navigation="navigation"
              :ui="{
                list: 'mx-0 mt-0',
                listWithChildren: 'ms-0 border-s-0',
                item: 'border-t border-default p-0!',
                itemWithChildren: 'border-t border-default font-normal',
                linkTitle:'font-normal!',
                link: 'px-3 py-3 rounded-none before:rounded-none',
                linkLeadingIcon: 'size-5'
              }"
            />
          </PageAside>
        </template>

        <slot />
      </Page>
    </Container>

    <DocsFooter />
  </div>
</template>
