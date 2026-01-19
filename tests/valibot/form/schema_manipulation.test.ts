import { describe, expect, test } from 'vitest'
import * as v from 'valibot'
import { ref } from 'vue'
import { useForm } from '../../../src'
import { withSetup } from '../../utils'

describe('schema_manipulation_valibot', () => {
  test('handles refinements', async () => {
    // schema with refinement
    // Valibot uses forward/check for cross-field validation often, but simplest is pipe on the object
    const schema = v.pipe(
      v.object({
        password: v.string(),
        confirm: v.string(),
      }),
      v.check(input => input.password === input.confirm, "Passwords don't match"),
    )
    // Note: Valibot issues from v.check on object might end up on the root path or specific path if forwarded.
    // Standard schema wrapper might handle "path" differently.
    // If we want it on 'confirm', we usually need to forward it. but let's test basic failure first.

    const { result } = withSetup(() => useForm({
      schema,
      initialState: { password: 'abc', confirm: 'def' },
    }))

    const { state, validate, errors } = result

    // should fail validation
    await validate()
    expect(errors.value.length).toBeGreaterThan(0)
    // We expect the message. Path might be empty or root depending on adapter.
    expect(errors.value[0].message).toBe("Passwords don't match")

    // make valid
    state.value.confirm = 'abc'
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
