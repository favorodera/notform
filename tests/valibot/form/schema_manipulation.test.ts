import { describe, expect, test } from 'vitest'
import * as v from 'valibot'
import { ref } from 'vue'
import { useForm, Form } from '../../../src'
import { withSetup } from '../../utils'

describe('schema_manipulation_valibot', () => {
  test('handles refinements', async () => {
    // schema with refinement
    const schema = v.pipe(
      v.object({
        password: v.string(),
        confirm: v.string(),
      }),
      v.check(input => input.password === input.confirm, "Passwords don't match"),
    )

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

  test('supports dynamic schema updates', async () => {
    const schema1 = v.object({
      val: v.pipe(v.number(), v.maxValue(10)),
    })

    const schema2 = v.object({
      val: v.pipe(v.number(), v.maxValue(20)),
    })

    const currentSchema = ref<typeof schema1 | typeof schema2>(schema1)

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
