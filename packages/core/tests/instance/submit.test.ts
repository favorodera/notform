/* eslint-disable test/max-expects, ts/no-invalid-void-type */
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('submission', () => {
  const onSubmit = vi.fn()

  const submitEvent = {
    preventDefault: vi.fn(),
  } as unknown as SubmitEvent

  // eslint-disable-next-line test/no-hooks
  beforeEach(() => {
    onSubmit.mockClear()
    vi.mocked(submitEvent.preventDefault).mockClear()
  })

  it('submit marks all fields as touched and dirty', async () => {
    const form = createNameEmailForm()

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.touchedFields.has('email')).toBe(true)
    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.dirtyFields.has('email')).toBe(true)
  })

  it('submit does not call onSubmit when form is invalid', async () => {
    const form = createNameEmailForm({ onSubmit })

    await form.submit(submitEvent)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submit calls onSubmit with validated values when form is valid', async () => {
    const form = createNameEmailForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane',
    })
  })

  it('submit ignores the second call while the first is in progress', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const pendingOnSubmit = vi.fn(() => submitPromise)

    const form = createNameEmailForm({ onSubmit: pendingOnSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const firstSubmit = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    const secondSubmit = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await Promise.all([firstSubmit, secondSubmit])
    await flushPromises()

    expect(form.isSubmitting).toBe(false)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('submit bails out when a newer validation starts during its validation phase', async () => {
    const form = createNameEmailForm({
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

    const form = createNameEmailForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit: throwingOnSubmit,
    })

    await expect(form.submit(submitEvent)).rejects.toThrow('Network error')

    expect(form.isSubmitting).toBe(false)
  })

  it('submit resets isSubmitting when validation fails', async () => {
    const form = createNameEmailForm({ onSubmit })

    const submitPromise = form.submit(submitEvent)
    await flushPromises()

    await submitPromise
    await flushPromises()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.isSubmitting).toBe(false)
    expect(form.errors.length).toBeGreaterThan(0)
  })

  it('submit calls preventDefault on the event', async () => {
    const form = createNameEmailForm({ onSubmit })

    await form.submit(submitEvent)
    await flushPromises()

    expect(submitEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('submit with no onSubmit handler still validates and completes', async () => {
    const form = createNameEmailForm()

    await expect(form.submit(submitEvent)).resolves.not.toThrow()

    await flushPromises()

    expect(form.isSubmitting).toBe(false)
  })

  it('ignores new submissions while the guard is active even with concurrent validate calls', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()

    const pendingOnSubmit = vi.fn(() => submitPromise)

    const form = createNameEmailForm({
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