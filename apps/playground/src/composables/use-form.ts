import { z } from 'zod'
import { useNotForm } from 'notform'

export function useSharedForm() {
  const instance = useNotForm({
    schema: z.object({
      name: z.string().min(2, 'Name is too short'),
      email: z.string().email('Invalid email address'),
    }),
    initialValues: {
      name: '',
      email: '',
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Shared Composable submitted: ${JSON.stringify(values)}`)
    },
  })

  return instance
}
