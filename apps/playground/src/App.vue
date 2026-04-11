<script setup lang="ts">
import { z } from 'zod'
import { useNotForm, NotField, NotForm } from 'notform'
import { useFormStore } from './stores/form'

const form = useFormStore().form

const { instance, values, submit, reset, isDirty, setValue } = form

</script>

<template>
  <div>

    <NotForm
      :instance="instance"
      @submit="submit"
      @reset="reset()"
    >
    

      <NotField
        v-slot="{ errors }"
        :instance="instance"
        path="email"
      >
        <input
          v-model="values.email"
          type="email"
        >
        <p>{{ errors }}</p>
      </NotField>

      <p>{{ values }}</p>

      <button type="submit">
        Submit
      </button>

      <button type="reset">
        Reset
      </button>
    </NotForm>

    <NotField
      v-slot="{ errors,value,events }"
      :form="instance"
      path="name"
    >
      <input
        type="text"
        v-bind="events"
      >
      <p>{{ errors }},{{ value }}</p>
    </NotField>

    {{ isDirty }}
  </div>
</template>
