import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { ref } from 'vue'
import { useForm, Form } from '../../../src'
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

    const { errors, validate, getByRole } = withSetup(() => {
      const { errors, validate, id, state } = useForm({
        schema,
        initialState: { password: 'abc', confirm: 'def' },
      })
      return { errors, validate, id, state }
    }).render(
      `
      <Form :id="id">
        <input name="password" v-model="state.password" aria-label="password" />
        <input name="confirm" v-model="state.confirm" aria-label="confirm" />
      </Form>
      `,
      { Form },
    )

    // should fail validation
    await validate()
    expect(errors.value.length).toBeGreaterThan(0)
    expect(errors.value[0].message).toBe("Passwords don't match")

    // make valid via input
    const confirmInput = getByRole('textbox', { name: 'confirm' })
    await confirmInput.fill('abc')

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

    const { errors, validate, getByRole } = withSetup(() => {
      const { errors, validate, id, state } = useForm({
        schema: formSchema,
        initialState: { field: 'too long string' },
      })
      return { errors, validate, id, state }
    }).render(
      `
      <Form :id="id">
        <input name="field" v-model="state.field" aria-label="field" />
      </Form>
      `,
      { Form },
    )

    const fieldInput = getByRole('textbox', { name: 'field' })

    await validate()
    expect(errors.value[0].message).toBe('Too long')

    await fieldInput.fill('short')

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

    const { errors, validate } = withSetup(() => {
      const { errors, validate, id, state } = useForm({
        schema: currentSchema,
        initialState: { val: 15 },
      })
      return { errors, validate, id, state }
    }).render(
      `
      <Form :id="id">
        <input name="val" type="number" v-model.number="state.val" aria-label="val" />
      </Form>
      `,
      { Form },
    )

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
