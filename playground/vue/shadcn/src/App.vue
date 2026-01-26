<script lang="ts" setup>
import 'vue-sonner/style.css'
import { Toaster } from '@/components/sonner'
import Display from '@/components/app/display.vue'
</script>

<template>
  <div>
    <main class="h-dvh flex items-center justify-center">
      <Display />
    </main>
    <Toaster />
  </div>
</template>
