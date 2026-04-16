<script setup lang="ts">
const { github, author } = useAppConfig()

const navLinks = [
  { label: 'Docs', to: '/docs' },
  { label: 'GitHub', to: github.url, target: '_blank' },
  { label: 'Author', to: author.url, target: '_blank' },
]
</script>

<template>
  <Motion
    as="footer"
    :initial="{ opacity: 0 }"
    :while-in-view="{ opacity: 1 }"
    :viewport="{ once: true }"
    :transition="{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }"
    class="border-t border-dashed border-default"
  >
    <UContainer>
      <div class="flex flex-wrap items-center justify-between gap-4 py-5">

        <!-- Nav links -->
        <nav
          class="flex items-center gap-1"
          aria-label="Footer navigation"
        >
          <template
            v-for="(link, index) in navLinks"
            :key="link.label"
          >
            <UButton
              :to="link.to"
              :target="link.target"
              variant="link"
              color="neutral"
              size="xs"
              class="
                font-light text-muted
                hover:text-highlighted
              "
            >
              {{ link.label }}
            </UButton>

            <span
              v-if="index < navLinks.length - 1"
              class="text-xs text-muted/40"
              aria-hidden
            >
              /
            </span>
          </template>
        </nav>

        <!-- Copyright -->
        <span class="text-xs font-light text-muted">
          MIT © {{ new Date().getFullYear() }}
        </span>

      </div>
    </UContainer>
  </Motion>
</template>
