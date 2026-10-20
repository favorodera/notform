/* eslint-disable ts/no-invalid-void-type */
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'
import { createFirstCallBlockingSchema, type nameEmailSchema } from '../helpers/not-validator'

describe('reset', () => {
  it('reset restores values to the current baseline', () => {
    const form = createNameEmailForm()
    form.setValue('name', 'Jane')

    form.reset()

    expect(form.values.name).toBe('')
    expect(form.isDirty).toBe(false)
  })

  it('reset clears explicit touch and submitted state', async () => {
    const form = createNameEmailForm()

    form.markFieldAsTouched('email')
    await form.submit()

    expect(form.isTouched).toBe(true)
    expect(form.isSubmitted).toBe(true)

    form.reset()

    expect(form.touchedFields.size).toBe(0)
    expect(form.submitCount).toBe(0)
    expect(form.isSubmitted).toBe(false)
    expect(form.isTouched).toBe(false)
    expect(form.isDirty).toBe(false)
  })

  it('reset clears all errors', () => {
    const form = createNameEmailForm()

    form.setError({ message: 'Required', path: [{ key: 'name' }] })
    form.reset()

    expect(form.errors).toHaveLength(0)
  })

  it('reset restores initialErrors', () => {
    const form = createNameEmailForm({
      initialErrors: [{ message: 'Server error', path: ['email'] }],
    })

    form.clearErrors()
    form.reset()

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Server error')
  })

  it('reset with new values updates the baseline', () => {
    const form = createNameEmailForm()

    form.reset({ email: 'jane@example.com', name: 'Jane' })

    expect(form.values.name).toBe('Jane')
    expect(form.values.email).toBe('jane@example.com')

    form.setValue('name', 'John')
    form.reset()

    expect(form.values.name).toBe('Jane')
    expect(form.isDirty).toBe(false)
  })

  it('reset with new values drops keys absent from the new baseline', () => {
    const form = createNameEmailForm()

    form.reset({ name: 'Jane' })

    expect(form.values).toStrictEqual({ name: 'Jane' })

    form.setValue('name', 'John')
    form.reset()

    expect(form.values).toStrictEqual({ name: 'Jane' })
  })

  it('reset(Event) is a no-op baseline selection, suitable for direct DOM binding', () => {
    const form = createNameEmailForm()
    form.setValue('name', 'Jane')

    form.reset(new Event('reset'))

    expect(form.values.name).toBe('')
    expect(form.isDirty).toBe(false)
  })

  it('reset invalidates an in-flight validation result', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()

    const form = createNameEmailForm({
      schema: createFirstCallBlockingSchema(promise) as typeof nameEmailSchema,
    })

    const validation = form.validate()
    await flushPromises()

    form.reset()

    expect(form.errors).toHaveLength(0)
    expect(form.isValidating).toBe(false)

    resolve()
    await validation

    expect(form.errors).toHaveLength(0)
  })
})
