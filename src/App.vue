<script lang="ts" setup>
import { reactive, useTemplateRef } from 'vue'
import ValidForm from './components/valid-form.vue'
import { z } from 'zod'

const schema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('EVE'),
    first: z.literal('EVE'),
    last: z.string(),
    color: z.string(),
  }),
  z.object({
    name: z.literal('ADAM'),
    first: z.literal('ADAM'),
    last: z.string(),
    color: z.string(),
  }),
])

const state = reactive<Partial<z.output<typeof schema>>>({})

const form = useTemplateRef('form')
</script>

<template>
  <div>
    <ValidForm ref="form" :schema :state :validate-on="['mount']">

      <input
        id="first"
        v-model="state.first"
        type="text"
        name="first"
      >
      <input
        id="last"
        v-model="state.last"
        type="text"
        name="last"
      >
      <input
        id="color"
        v-model="state.color"
        type="color"
        name="color"
      >

      <button type="submit">
        Submit
      </button>

    </ValidForm>

     <pre>{{ JSON.stringify(form, null, 2) }}</pre>
  </div>
</template>

