<script setup lang="ts">
import { useId } from 'vue'
import { siteConfig } from '#shared/site'

const appConfig = useAppConfig()

// Unique per instance, because the card can be in the DOM twice (toc and menu).
const titleId = useId()
</script>

<template>
  <aside
    :aria-labelledby="titleId"
    class="flex flex-col gap-3 border border-default bg-elevated/50 p-4"
  >
    <div class="flex flex-col gap-1">
      <p
        :id="titleId"
        class="text-sm font-medium text-highlighted"
      >
        Support NotForm
      </p>

      <p class="text-xs/relaxed text-muted">
        Free and open source under the MIT license. If it's useful to you,
        consider sponsoring its development.
      </p>
    </div>

    <Button
      :label="siteConfig.links.sponsor.label"
      :to="siteConfig.links.sponsor.to"
      block
      external
      icon="tabler:heart"
      size="sm"
      target="_blank"
      :trailing-icon="appConfig.ui.icons.external"
    />
  </aside>
</template>
