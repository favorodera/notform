<script setup lang="ts">
const { author, github } = useAppConfig()

const navLinks = [
  { label: 'GitHub', target: '_blank', to: github.url },
  { label: 'Author', target: '_blank', to: author.url },
]
</script>

<template>
  <footer
    class="border-bs border-dashed border-default"
  >
    <Container>
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
            <Button
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
            </Button>

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
    </Container>
  </footer>
</template>
