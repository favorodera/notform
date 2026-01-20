import { describe, expect, test, vi } from 'vitest'
import * as v from 'valibot'
import { useForm, Form } from '../../../src'
import { withSetup } from '../../utils'

describe('use_form_methods_valibot', () => {
  // define schema
  const schema = v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.pipe(v.string(), v.minLength(6)),
  })

  test('validates single field correctly', async () => {
    // init form
    const { validateField, getFieldErrors, getByRole } = withSetup(() => {
      const { validateField, state, getFieldErrors, id } = useForm({
        schema,
        initialState: { email: '', password: '' },
      })
      return { validateField, state, getFieldErrors, id }
    }).render(
      `
        <Form :id="id">
            <input name="email" v-model="state.email" aria-label="email" />
        </Form>
        `,
      { Form },
    )

    const emailInput = getByRole('textbox', { name: 'email' })

    // set invalid email
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
            <input name="email" v-model="state.email" aria-label="email" />
            <input name="password" v-model="state.password" aria-label="password" />
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
            <input name="email" v-model="state.email" aria-label="email" />
        </Form>
        `,
      { Form },
    )

    const emailInput = getByRole('textbox', { name: 'email' })

    // initially not dirty
    dirtyField('email')

    // verify clean state
    expect(isDirty.value).toBe(false)

    // change value
    await emailInput.fill('changed@example.com')
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
            <input name="email" v-model="state.email" aria-label="email" />
        </Form>
        `,
      { Form },
    )

    const emailInput = getByRole('textbox', { name: 'email' })

    // set some values and errors
    await emailInput.fill('test@test.com')
    await validate()

    // verify we have errors or changed state
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

    const result = await validate()
    if (!('issues' in result)) {
      submitHandler(state.value)
    }

    expect(submitHandler).not.toHaveBeenCalled()
  })
})

