<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <div>
    <DocsHeader />

    <UContainer>
      <UPage>
        <template #left>
          <UPageAside
            class="
              border-x border-dashed border-default
              lg:px-0!
            "
          >
            <UContentNavigation
              highlight
              :navigation="navigation?.[0]?.children ?? navigation"
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
          </UPageAside>
        </template>

        <slot />
      </UPage>

    </UContainer>

    <DocsFooter />
  </div>
</template>
