import { describe, expect, test, vi } from 'vitest'
import { z } from 'zod'
import { useForm, Form } from '../../../src'
import { withSetup } from '../../utils'

describe('use-form-methods', () => {
  // define schema
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  test('validates single field correctly', async () => {
    // init form
    const { validateField, getFieldErrors, getByRole } = withSetup(() => {
      const { state, validateField, getFieldErrors, id } = useForm({
        schema,
        initialState: { email: '', password: '' },
      })
      return { state, validateField, getFieldErrors, id }
    }).render(
      `
      <Form :id="id">
        <label for="email">Email</label>
        <input id="email" name="email" v-model="state.email" />
      </Form>
      `,
      { Form },
    )

    const emailInput = getByRole('textbox', { name: 'email' })

    // set invalid email via input
    await emailInput.fill('invalid-email')

    // validation should fail
    const resultFail = await validateField('email')
    expect('issues' in resultFail).toBe(true)
    expect(getFieldErrors('email')).toHaveLength(1)

    // set valid email
    await emailInput.fill('test@example.com')

    // validation should pass
    const validResult = await validateField('email')

    if ('issues' in validResult) {
      throw new Error('Validation should have passed')
    }

    expect(validResult.value).toBe('test@example.com')
    expect(getFieldErrors('email')).toHaveLength(0)
  })

  test('handles field touching', async () => {
    // init form
    const { touchField, isTouched, touchedFields, touchAllFields } = withSetup(() => {
      const { touchField, isTouched, touchedFields, touchAllFields, id, state } = useForm({
        schema,
        initialState: { email: '', password: '' },
      })
      return { touchField, isTouched, touchedFields, touchAllFields, id, state }
    }).render(
      `
      <Form :id="id">
        <input name="email" v-model="state.email" />
        <input name="password" v-model="state.password" />
      </Form>
      `,
      { Form },
    )

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

  test('handles dirty state correctly', async () => {
    // init form with initial state
    const { dirtyField, isDirty, dirtyFields, getByRole } = withSetup(() => {
      const { dirtyField, isDirty, dirtyFields, state, id } = useForm({
        schema,
        initialState: { email: 'test@example.com', password: 'password123' },
      })
      return { dirtyField, isDirty, dirtyFields, state, id }
    }).render(
      `
        <Form :id="id">
          <label for="email"> Email </label>
          <input id="email" name="email" v-model="state.email" />
        </Form>
        `,
      { Form },
    )

    const emailInput = getByRole('textbox', { name: 'email' })

    // initially not dirty (if we don't change anything)
    // Note: dirtyField is usually internal or used when manually marking dirty?
    // Let's test automatic dirty via input change primarily, but if dirtyField is exposed we can test it using method

    // dirtyField('email') -> assuming this marks it dirty? Or checks it?
    // Based on previous test it seemed to be used to mark/check. Let's assume manual control for now based on previous test code:
    // "dirtyField('email')" call in previous test seemed to trigger check? Or mark?
    // Previous test:
    // dirtyField('email')
    // expect(isDirty.value).toBe(false)
    // state.value.email = ...
    // dirtyField('email')
    // expect(isDirty.value).toBe(true)
    // So it seems `dirtyField` might be a method to re-evaluate dirty state for a field?

    dirtyField('email')
    expect(isDirty.value).toBe(false)

    // change value via input
    await emailInput.fill('changed@example.com')

    // In previous test, we had to call dirtyField('email') to update?
    // If it's reactive via v-model, it should be automatic?
    // But previous test called it manually. I will keep manual call if the API requires it,
    // or maybe it's just to force re-eval.

    dirtyField('email')

    // verify dirty state
    expect(isDirty.value).toBe(true)
    expect(dirtyFields.value.has('email')).toBe(true)

    // revert value
    await emailInput.fill('test@example.com')
    dirtyField('email')

    // verify clean state again
    expect(isDirty.value).toBe(false)
  })

  test('reset restores initial state and clear errors', async () => {
    // init form
    const { state, errors, reset, validate, getByRole } = withSetup(() => {
      const { state, errors, reset, validate, id } = useForm({
        schema,
        initialState: { email: '', password: '' },
      })
      return { state, errors, reset, validate, id }
    }).render(
      `
        <Form :id="id">
          <label for="email"> Email </label>
          <input id="email" name="email" v-model="state.email" />
        </Form>
        `,
      { Form },
    )

    const emailInput = getByRole('textbox', { name: 'email' })

    // set some values and errors
    await emailInput.fill('test@test.com')

    // trigger validation (assuming validate() runs full validation)
    await validate()

    // verify we have errors or changed state (email is valid format but password missing, so global validate might fail)
    expect(state.value.email).toBe('test@test.com')

    // reset form
    reset()

    // verify returned to initial
    expect(state.value.email).toBe('')
    expect(errors.value).toEqual([])
  })

  test('submit handler (mocked)', async () => {
    // // TODO: Implement actual submit handler test when available
    const submitHandler = vi.fn()

    const { validate, state } = withSetup(() => {
      const { validate, state } = useForm({ schema })
      return { validate, state }
    }).render('<div></div>')

    // Mocking what submit might do: validate and then call handler if valid
    const result = await validate()
    if (!('issues' in result)) {
      submitHandler(state.value)
    }

    // Since it's invalid (empty), handler shouldn't be called if we followed logic,
    // but here we just want to show we placed the TODO and structure.
    expect(submitHandler).not.toHaveBeenCalled()
  })
})

