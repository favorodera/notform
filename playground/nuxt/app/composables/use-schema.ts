import * as yup from 'yup'
import * as v from 'valibot'
import { z } from 'zod'

export type SchemaId = 'zod' | 'yup' | 'valibot'

export const schemaOptions: Array<{ id: SchemaId, label: string }> = [
  { id: 'zod', label: 'Zod' },
  { id: 'yup', label: 'Yup' },
  { id: 'valibot', label: 'Valibot' },
]

// Zod Schema
const zodSchema = z.object({
  text: z.string().min(3, 'Text must be at least 3 characters'),
  select: z.string().min(1, 'Please select an option'),
  number: z.coerce.number().min(1, 'Number must be at least 1'),
  range: z.coerce.number().min(0).max(100),
  date: z.iso.date('Please enter a valid date'),
  file: z.file('File is required').nonoptional('Please upload a file'),
  checkbox: z.literal(true, 'You must agree to continue'),
  radio: z.enum(['option1', 'option2', 'option3'], 'Please select an option'),
  array: z.array(z.string().min(5, 'Array item must be at least 5 characters'))
    .min(1, 'Array must have at least one item'),
})

// Yup Schema
const yupSchema = yup.object({
  text: yup
    .string()
    .min(3, 'Text must be at least 3 characters')
    .required('Text is required'),
  select: yup.string().required('Please select an option'),
  number: yup
    .number()
    .min(1, 'Number must be at least 1')
    .required('Number is required'),
  range: yup.number().min(0).max(100).required('Range is required'),
  date: yup.string().required('Date is required'),
  file: yup
    .mixed<File>()
    .required('Please upload a file')
    .test('fileType', 'File is required', value => value instanceof File),
  checkbox: yup
    .bool()
    .oneOf([true], 'You must agree to continue')
    .required('You must agree to continue'),
  radio: yup
    .string()
    .oneOf(['option1', 'option2', 'option3'], 'Please select an option')
    .required('Please select an option'),
  array: yup.array(yup.string()
    .min(5, 'Array item must be at least 5 characters'))
    .min(1, 'Array must have at least one item'),
})

// Valibot Schema
const valibotSchema = v.object({
  text: v.pipe(v.string(), v.minLength(3, 'Text must be at least 3 characters')),
  select: v.pipe(v.string(), v.minLength(1, 'Please select an option')),
  number: v.pipe(v.number(), v.minValue(1, 'Number must be at least 1')),
  range: v.pipe(v.number(), v.minValue(0), v.maxValue(100)),
  date: v.pipe(v.string(), v.minLength(1, 'Date is required')),
  file: v.pipe(
    v.nullable(v.instance(File)),
    v.check(file => file !== null, 'Please upload a file'),
  ),
  checkbox: v.pipe(v.boolean(), v.literal(true, 'You must agree to continue')),
  radio: v.picklist(['option1', 'option2', 'option3']),
  array: v.pipe(v.array(v.pipe(v.string(), v.minLength(5, 'Array item must be at least 5 characters'))),
    v.minLength(1, 'Array must have at least one item')),
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

