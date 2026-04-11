import { z } from 'zod'
import { useNotForm } from 'notform'

export function useForm() {
  const form = useNotForm({
    schema: z.object({
      name: z.string().min(2, 'Name is too short'),
      email: z.email('Invalid email address'),
    }),
    initialValues: {
      name: '',
      email: '',
    },
    onSubmit: (values) => {
      alert(`Shared Form submitted: ${JSON.stringify(values)}`)
    },
  })

  return (form)
}
