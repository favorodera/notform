import { defineStore } from 'pinia'
import { z } from 'zod'
import { useNotForm } from 'notform'

export const useFormStore = defineStore('form', () => {
  const form = useNotForm({
    schema: z.object({
      name: z.string().min(2, 'Name is too short'),
      email: z.email('Invalid email address'),
    }),
    initialValues: {
      name: '',
      email: '',
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Shared Form submitted: ${JSON.stringify(values)}`)
    },
  })

  return { form }
})
