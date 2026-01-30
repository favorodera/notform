<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  headline?: string
}>(), {
  title: 'title',
  description: 'description',
  headline: ''
})
const title = computed(() => (props.title || '').slice(0, 60))
const description = computed(() => (props.description || '').slice(0, 200))
const headline = computed(() => (props.headline || '').slice(0, 60))
</script>

<template>
  <div
    class="flex size-full flex-col bg-[#060606] p-16"
    style="background-size: 120px 120px; background-image: linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px);"
  >
    <div class="mb-16 flex items-start justify-between">

      <span class="text-2xl font-bold tracking-wider text-[#00d492]">
        DOCS
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="#00d492"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 4H5v16h3m8-16h3v16h-3"
        />
      </svg>

    </div>
    
    <div class="max-w-3xl">

      <div class="mb-4 flex items-center gap-3">

        <h1 class="text-3xl font-medium text-[#00d492]">
          {{ title }}
        </h1>

        <span
          v-if="headline"
          class="text-3xl font-medium text-[#bebec7]"
        >
          >
        </span>

        <h2
          v-if="headline"
          class="text-3xl font-medium text-[#bebec7]"
        >
          {{ headline }}
        </h2>

      </div>

      <p class="text-xl text-[#a1a1aa]">
        {{ description }}
      </p>
      
    </div>
  </div>
</template>
