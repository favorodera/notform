import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { useForm } from '../../../src'
import { withSetup } from '../../utils'

describe('use-form-methods', () => {
  // define schema
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  test('validates single field correctly', async () => {
    // init form
    const { result } = withSetup(() => useForm({
      schema,
      initialState: { email: '', password: '' },
    }))

    const { validateField, state, getFieldErrors } = result

    // set invalid email
    state.value.email = 'invalid-email'

    // validation should fail
    const resultFail = await validateField('email')
    expect('issues' in resultFail).toBe(true)
    expect(getFieldErrors('email')).toHaveLength(1)

    // set valid email
    state.value.email = 'test@example.com'

    // validation should pass
    const validResult = await validateField('email')

    if ('issues' in validResult) {
      throw new Error('Validation should have passed')
    }

    expect(validResult.value).toBe('test@example.com')
    expect(getFieldErrors('email')).toHaveLength(0)
  })

  test('handles field touching', () => {
    // init form
    const { result } = withSetup(() => useForm({
      schema,
      initialState: { email: '', password: '' },
    }))

    const { touchField, isTouched, touchedFields, touchAllFields } = result

    // initially not touched
    expect(isTouched.value).toBe(false)

    // touch a field
    touchField('email')

    // check touched status
    expect(isTouched.value).toBe(true)
    expect(touchedFields.value.has('email')).toBe(true)
    expect(touchedFields.value.has('password')).toBe(false)

    // touch all fields
    touchAllFields()
    expect(touchedFields.value.has('password')).toBe(true)
  })

  test('handles dirty state correctly', () => {
    // init form with initial state
    const { result } = withSetup(() => useForm({
      schema,
      initialState: { email: 'test@example.com', password: 'password123' },
    }))

    const { dirtyField, isDirty, dirtyFields, state } = result

    // initially not dirty
    dirtyField('email')

    // verify clean state
    expect(isDirty.value).toBe(false)

    // change value
    state.value.email = 'changed@example.com'
    dirtyField('email')

    // verify dirty state
    expect(isDirty.value).toBe(true)
    expect(dirtyFields.value.has('email')).toBe(true)

    // revert value
    state.value.email = 'test@example.com'
    dirtyField('email')

    // verify clean state again
    expect(isDirty.value).toBe(false)
  })

  test('reset restores initial state and clear errors', async () => {
    // init form
    const { result } = withSetup(() => useForm({
      schema,
      initialState: { email: '', password: '' },
    }))

    const { state, errors, reset, validate } = result

    // set some values and errors
    state.value.email = 'test@test.com'
    await validate()

    // verify we have errors or changed state
    expect(state.value.email).toBe('test@test.com')

    // reset form
    reset()

    // verify returned to initial
    expect(state.value.email).toBe('')
    expect(errors.value).toEqual([])
  })
})
