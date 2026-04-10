<script setup lang="ts">
import { z } from 'zod'
import { useNotForm, NotField, NotForm } from 'notform'

const { instance, values, submit, reset } = useNotForm({
  schema: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.email('Invalid email address'),
    min: z.number().min(1, 'Min must be at least 1'),
  }),
  initialValues: {
    name: '',
    email: '',
  },
})

</script>

<template>
  <div>

    <NotForm
      :instance="instance"
      @submit="submit"
      @reset="reset()"
    >

      <NotField
        v-slot="{ errors,value }"
        :instance="instance"
        path="name"
      >
        <input
          v-model="values.name"
          type="text"
        >
        <p>{{ errors }},{{ value }}</p>
      </NotField>

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

  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height:100dvh;
  min-width:100%;
  align-items: center;
  justify-content: center;
}
</style>
