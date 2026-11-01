<script setup lang="ts">
// Up / Down / Remove for any array item.
const props = defineProps<{
  item: {
    readonly index: number
    moveTo: (to: number) => void
    remove: () => void
  }
}>()
</script>

<template>
  <div class="row">
    <button
      type="button"
      @click="props.item.moveTo(props.item.index - 1)"
    >
      Up
    </button>

    <button
      type="button"
      @click="props.item.moveTo(props.item.index + 1)"
    >
      Down
    </button>

    <button
      type="button"
      @click="props.item.remove()"
    >
      Remove
    </button>
  </div>
</template>
