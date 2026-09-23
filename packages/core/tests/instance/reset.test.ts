/* eslint-disable ts/no-invalid-void-type */
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'
import { createFirstCallBlockingSchema, type nameEmailSchema } from '../helpers/not-validator'

describe('reset', () => {
  it('reset restores values to initial state', () => {
    const form = createNameEmailForm()
    form.setValue('name', 'Jane')

    form.reset()

    expect(form.values.name).toBe('')
  })

  it('reset clears touched and dirty fields', () => {
    const form = createNameEmailForm()

    form.markFieldAsTouched('name')
    form.markFieldAsDirty('email')

    form.reset()

    expect(form.touchedFields.size).toBe(0)
    expect(form.dirtyFields.size).toBe(0)
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

    expect(form.errors).toHaveLength(0)

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
  })

  it('reset with new values drops keys absent from the new baseline', () => {
    const form = createNameEmailForm()

    form.reset({ name: 'Jane' })

    expect(form.values).toStrictEqual({ name: 'Jane' })

    form.setValue('name', 'John')
    form.reset()

    expect(form.values).toStrictEqual({ name: 'Jane' })
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

    resolve()
    await validation
    await flushPromises()

    expect(form.errors).toHaveLength(0)
  })

  it('reset does not leave isValidating stuck true after invalidating an in-flight validation', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()

    const form = createNameEmailForm({
      schema: createFirstCallBlockingSchema(promise) as typeof nameEmailSchema,
    })

    const validation = form.validate()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    form.reset()

    resolve()
    await validation
    await flushPromises()

    expect(form.isValidating).toBe(false)
  })
})