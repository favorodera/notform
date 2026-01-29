<script setup lang="ts">

const { activeSchema, schemaOptions, setSchema } = useSchema()
</script>

<template>
  <div class="flex flex-col items-end gap-1">
    <p class="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
      Schema
    </p>
    <div
      class="nf-tabs"
      role="tablist"
      aria-label="Validation schema selector"
    >
      <button
        v-for="schema in schemaOptions"
        :key="schema.id"
        class="nf-tab"
        :class="{ 'nf-tab-active': activeSchema === schema.id }"
        type="button"
        role="tab"
        :aria-selected="activeSchema === schema.id"
        @click="setSchema(schema.id)"
      >
        {{ schema.label }}
      </button>
    </div>
  </div>
</template>

