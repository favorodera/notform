import { defineStore } from 'pinia'
import { z } from 'zod'
import { useNotForm } from 'notform'
import { toRefs } from 'vue'

export const useFormStore = defineStore('form', () => {
  const form = useNotForm({
    schema: z.object({
      name: z.string().min(2, 'Name is too short'),
      email: z.email('Invalid email address'),
    }),
    onSubmit: (values) => {
      alert(`Shared Form submitted: ${JSON.stringify(values)}`)
    },
  })

  return { form: toRefs(form) }
})
