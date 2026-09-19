/* eslint-disable test/no-hooks, test/max-expects, ts/no-invalid-void-type */
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { mountNameEmailForm } from '../helpers/mount-form'
import { nameEmailSchema } from '../helpers/not-validator'

describe('submission', () => {
  const onSubmit = vi.fn()

  const submitEvent = {
    preventDefault: vi.fn(),
  } as unknown as SubmitEvent

  beforeEach(() => {
    onSubmit.mockClear()
    vi.mocked(submitEvent.preventDefault).mockClear()
  })

  it('submit marks all fields as touched and dirty', async () => {
    const { form } = mountNameEmailForm()

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.touchedFields.has('email')).toBe(true)
    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.dirtyFields.has('email')).toBe(true)
  })

  it('submit does not call onSubmit when form is invalid', async () => {
    const { form } = mountNameEmailForm({ onSubmit })

    await form.submit(submitEvent)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submit calls onSubmit with validated values when form is valid', async () => {
    const { form } = mountNameEmailForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane',
    })
  })

  it('isSubmitting is true during submission and false after', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const pendingOnSubmit = vi.fn(() => submitPromise)

    const { form, wrapper } = mountNameEmailForm({ onSubmit: pendingOnSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(form.isSubmitting).toBe(true)

    resolveSubmit()
    await flushPromises()

    expect(form.isSubmitting).toBe(false)
  })

  it('submit ignores the second call while the first is in progress', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const pendingOnSubmit = vi.fn(() => submitPromise)

    const { form, wrapper } = mountNameEmailForm({ onSubmit: pendingOnSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const formElement = wrapper.get('form')

    await formElement.trigger('submit')
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    await formElement.trigger('submit')
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await flushPromises()

    expect(form.isSubmitting).toBe(false)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('submit bails out when a newer validation starts during its validation phase', async () => {
    const { form } = mountNameEmailForm({
      initialValues: { name: 'Jane' },
      onSubmit,
    })

    const submitPromise = form.submit(submitEvent)

    form.setValue('name', 'Jane Doe')

    await flushPromises()
    await submitPromise

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('resets isSubmitting even when onSubmit throws', async () => {
    const throwingOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'))

    const form = createNotFormInstance({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit: throwingOnSubmit,
      schema: nameEmailSchema,
    })

    await expect(form.submit(submitEvent)).rejects.toThrow('Network error')

    expect(form.isSubmitting).toBe(false)
  })

  it('submit resets isSubmitting when validation fails', async () => {
    const { form } = mountNameEmailForm({ onSubmit })

    const submitPromise = form.submit(submitEvent)
    await flushPromises()
    
    await submitPromise
    await flushPromises()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.isSubmitting).toBe(false)
    expect(form.errors.length).toBeGreaterThan(0)
  })

  it('submit calls preventDefault on the event', async () => {
    const { form } = mountNameEmailForm({ onSubmit })

    await form.submit(submitEvent)
    await flushPromises()

    expect(submitEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('submit with no onSubmit handler still validates and completes', async () => {
    const { form } = mountNameEmailForm()

    await expect(form.submit(submitEvent)).resolves.not.toThrow()

    await flushPromises()

    expect(form.isSubmitting).toBe(false)
  })

  it('ignores new submissions while the guard is active even with concurrent validate calls', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const pendingOnSubmit = vi.fn(() => submitPromise)

    const { form } = mountNameEmailForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit: pendingOnSubmit,
    })

    const firstSubmitResult = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    await form.validate()
    await flushPromises()

    const secondSubmitResult = form.submit(submitEvent)
    await flushPromises()

    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await flushPromises()
    await Promise.all([firstSubmitResult, secondSubmitResult])

    expect(form.isSubmitting).toBe(false)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)
  })
})
