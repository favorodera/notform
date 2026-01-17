<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'
import { ValidForm, ValidField } from '../../src'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3),
})

const state = reactive({
  name: '',
})

const form = useTemplateRef('form')
</script>

<template>
  <ValidForm ref="form" :schema="schema" :state="state">

    <ValidField name="name" v-slot="{ field }">

      <input type="text" v-bind="field" />

    </ValidField>

     <pre>{{ JSON.stringify(form, null, 2) }}</pre>
  </ValidForm>
</template>
