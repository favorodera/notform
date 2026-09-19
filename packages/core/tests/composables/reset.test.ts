/* eslint-disable test/max-expects, ts/no-invalid-void-type */
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { mountNameEmailForm } from '../helpers/mount-form'
import { createFirstCallBlockingSchema, type nameEmailSchema } from '../helpers/not-validator'

describe('reset', () => {
  it('reset restores values to initial state', async () => {
    const { form } = mountNameEmailForm()
    form.setValue('name', 'Jane')

    form.reset()

    expect(form.values.name).toBe('')
  })

  it('native reset does not overwrite restored input values', async () => {
    const { form, wrapper } = mountNameEmailForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
    })

    const nameInput = wrapper.get('#name')
    const nameInputElement = nameInput.element as HTMLInputElement
    const emailInput = wrapper.get('#email')
    const emailInputElement = emailInput.element as HTMLInputElement

    await nameInput.setValue('ChangedName')
    await emailInput.setValue('ChangedEmail')
    await flushPromises()

    expect(form.values.name).toBe('ChangedName')
    expect(form.values.email).toBe('ChangedEmail')
    expect(nameInputElement.value).toBe('ChangedName')
    expect(emailInputElement.value).toBe('ChangedEmail')

    await wrapper.get('#reset').trigger('click')

    expect(form.values.name).toBe('Jane')
    expect(form.values.email).toBe('jane@example.com')
    expect(nameInputElement.value).toBe('Jane')
    expect(emailInputElement.value).toBe('jane@example.com')
  })

  it('reset clears touched and dirty fields', async () => {
    const { form } = mountNameEmailForm()

    form.markFieldAsTouched('name')
    form.markFieldAsDirty('email')

    form.reset()

    expect(form.touchedFields.size).toBe(0)
    expect(form.dirtyFields.size).toBe(0)
    expect(form.isTouched).toBe(false)
    expect(form.isDirty).toBe(false)
  })

  it('reset clears all errors', async () => {
    const { form } = mountNameEmailForm()

    form.setError({ message: 'Required', path: [{ key: 'name' }] })
    form.reset()

    expect(form.errors).toHaveLength(0)
  })

  it('reset restores initialErrors', () => {
    const { form } = mountNameEmailForm({
      initialErrors: [{ message: 'Server error', path: ['email'] }],
    })

    form.clearErrors()

    expect(form.errors).toHaveLength(0)

    form.reset()

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Server error')
  })

  it('reset with new values updates the baseline', async () => {
    const { form } = mountNameEmailForm()

    form.reset({ email: 'jane@example.com', name: 'Jane' })

    expect(form.values.name).toBe('Jane')
    expect(form.values.email).toBe('jane@example.com')

    form.setValue('name', 'John')
    form.reset()

    expect(form.values.name).toBe('Jane')
  })

  it('reset with new values drops keys absent from the new baseline', async () => {
    const { form } = mountNameEmailForm()

    form.reset({ name: 'Jane' })

    expect(form.values).toStrictEqual({ name: 'Jane' })

    form.setValue('name', 'John')
    form.reset()

    expect(form.values).toStrictEqual({ name: 'Jane' })
  })

  it('reset invalidates an in-flight validation result', async () => {
    const { promise, resolve } = Promise.withResolvers<void>()

    const { form } = mountNameEmailForm({
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

    const { form } = mountNameEmailForm({
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
