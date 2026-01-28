import * as yup from 'yup'
import * as v from 'valibot'
import { z } from 'zod'

export type SchemaId = 'zod' | 'yup' | 'valibot'

export const schemaOptions: Array<{ id: SchemaId, label: string }> = [
  { id: 'zod', label: 'Zod' },
  { id: 'yup', label: 'Yup' },
  { id: 'valibot', label: 'Valibot' },
]

const phoneRegex = /^(\+?\d{1,3})?[ -]?\d{7,14}$/

const zodSchema = z.object({
  text: z.string().min(3, 'Text must be at least 3 characters'),
  email: z.email('Please enter a valid email'),
  textarea: z.string().min(10, 'Textarea must be at least 10 characters'),
  select: z.string().min(1, 'Please select an option'),
  tel: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Enter a valid phone number'),
  checkbox: z.literal(true, 'You must agree to continue'),
})

const yupSchema = yup.object({
  text: yup
    .string()
    .min(3, 'Text must be at least 3 characters')
    .required('Text is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  textarea: yup
    .string()
    .min(10, 'Textarea must be at least 10 characters')
    .required('Textarea is required'),
  select: yup.string().required('Please select an option'),
  tel: yup
    .string()
    .required('Phone number is required')
    .matches(phoneRegex, 'Enter a valid phone number'),
  checkbox: yup
    .bool()
    .oneOf([true], 'You must agree to continue'),
})

const valibotSchema = v.object({
  text: v.pipe(
    v.string(),
    v.minLength(3, 'Text must be at least 3 characters'),
  ),
  email: v.pipe(
    v.string(),
    v.email('Please enter a valid email'),
  ),
  textarea: v.pipe(
    v.string(),
    v.minLength(10, 'Textarea must be at least 10 characters'),
  ),
  select: v.pipe(
    v.string(),
    v.minLength(1, 'Please select an option'),
  ),
  tel: v.pipe(
    v.string(),
    v.minLength(1, 'Phone number is required'),
    v.regex(phoneRegex, 'Enter a valid phone number'),
  ),
  checkbox: v.pipe(
    v.boolean(),
    v.literal(true, 'You must agree to continue'),
  ),
})

export default function () {
  const activeSchema = useState<SchemaId>('nf-schema', () => 'zod')

  function setSchema(id: SchemaId) {
    activeSchema.value = id
  }

  const schema = computed(() => {
    switch (activeSchema.value) {
      case 'yup':
        return yupSchema
      case 'valibot':
        return valibotSchema
      case 'zod':
      default:
        return zodSchema
    }
  })

  return {
    activeSchema,
    schemaOptions,
    setSchema,
    schema,
  }
}

