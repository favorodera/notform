import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { ref } from 'vue'
import { useForm } from '../../../src'
import { withSetup } from '../../utils'

describe('schema_manipulation', () => {
  test('handles refinements', async () => {
    // schema with refinement
    const schema = z.object({
      password: z.string(),
      confirm: z.string(),
    }).refine(data => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ['confirm'],
    })

    const { result } = withSetup(() => useForm({
      schema,
      initialState: { password: 'abc', confirm: 'def' },
    }))

    const { state, validate, errors } = result

    // should fail validation
    await validate()
    expect(errors.value.length).toBeGreaterThan(0)
    expect(errors.value[0].message).toBe("Passwords don't match")

    // make valid
    state.value.confirm = 'abc'
    await validate()
    expect(errors.value.length).toBe(0)
  })

  test('handles superRefine', async () => {
    const schema = z.string().superRefine((val, ctx) => {
      if (val.length > 5) {
        ctx.addIssue({
          code: 'custom',
          message: 'Too long',
        })
      }
    })

    const formSchema = z.object({
      field: schema,
    })

    const { result } = withSetup(() => useForm({
      schema: formSchema,
      initialState: { field: 'too long string' },
    }))

    const { state, validate, errors } = result

    await validate()
    expect(errors.value[0].message).toBe('Too long')

    state.value.field = 'short'
    await validate()
    expect(errors.value.length).toBe(0)
  })

  test('supports dynamic schema updates', async () => {
    const schema1 = z.object({
      val: z.number().max(10),
    })

    const schema2 = z.object({
      val: z.number().max(20),
    })

    const currentSchema = ref(schema1)

    const { result } = withSetup(() => useForm({
      schema: currentSchema,
      initialState: { val: 15 },
    }))

    const { validate, errors } = result

    // fails under schema1 (max 10)
    await validate()
    expect(errors.value.length).toBeGreaterThan(0)

    // switch to schema2 (max 20)
    currentSchema.value = schema2

    // should pass now
    await validate()
    expect(errors.value.length).toBe(0)
  })
})
