<script setup lang="ts">
// Debug strip: path, symbol id and the state flags of one field (works for fields, array fields and array items).
defineProps<{
  field: {
    readonly id: symbol
    readonly isDirty: boolean
    readonly isTouched: boolean
    readonly isValid: boolean
    readonly isValidating: boolean
    readonly path: string
  }
}>()
</script>

<template>
  <small class="flags">
    <code>{{ field.path }}</code>

    <code>{{ field.id.description }}</code>

    <span :class="{ on: field.isTouched }">touched</span>

    <span :class="{ on: field.isDirty }">dirty</span>

    <span :class="{ on: !field.isValid }">invalid</span>

    <span :class="{ on: field.isValidating }">validating</span>
  </small>
</template>
