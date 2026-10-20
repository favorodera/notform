import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { createNameEmailForm } from '../helpers/create-form'
import { createGatedCallSchema, type nameEmailSchema } from '../helpers/not-validator'

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

  it('marks the form submitted and touched on submit', async () => {
    const form = createNameEmailForm()

    await form.submit(submitEvent)

    expect(form.submitCount).toBe(1)
    expect(form.isSubmitted).toBe(true)
    expect(form.isTouched).toBe(true)
    expect(form.isPathTouched('name')).toBe(true)
    expect(form.isPathTouched('email')).toBe(true)
  })

  it('does not call onSubmit when form is invalid', async () => {
    const form = createNameEmailForm({ onSubmit })

    await form.submit(submitEvent)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.isSubmitted).toBe(true)
  })

  it('calls onSubmit with validated values when form is valid', async () => {
    const form = createNameEmailForm({ onSubmit })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    await form.submit(submitEvent)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      name: 'Jane',
    })
  })

  it('keeps isValidating false while onSubmit is pending', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()
    const pendingOnSubmit = vi.fn(() => submitPromise)

    const form = createNameEmailForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit: pendingOnSubmit,
    })

    const submission = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(form.isValidating).toBe(false)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await submission

    expect(form.isSubmitting).toBe(false)
  })

  it('revalidates and continues when values change during submit validation', async () => {
    const { promise: firstGate, resolve: resolveFirst } = Promise.withResolvers<void>()
    const onSubmitDuringRace = vi.fn()

    const form = createNameEmailForm({
      initialValues: { name: 'Jane' },
      onSubmit: onSubmitDuringRace,
      schema: createGatedCallSchema(
        callNumber => (callNumber === 1 ? firstGate : Promise.resolve()),
        (_callNumber, value) => ({ value }),
      ) as typeof nameEmailSchema,
    })

    const submission = form.submit(submitEvent)
    await flushPromises()

    form.setValue('name', 'John')
    resolveFirst()

    await submission

    expect(onSubmitDuringRace).toHaveBeenCalledWith({ name: 'John' })
  })

  it('ignores the second call while the first submit is in progress', async () => {
    const { promise: submitPromise, resolve: resolveSubmit } = Promise.withResolvers<void>()
    const pendingOnSubmit = vi.fn(() => submitPromise)

    const form = createNameEmailForm({ onSubmit: pendingOnSubmit })
    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    const firstSubmit = form.submit(submitEvent)
    await flushPromises()

    const secondSubmit = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await Promise.all([firstSubmit, secondSubmit])

    expect(form.isSubmitting).toBe(false)
    expect(pendingOnSubmit).toHaveBeenCalledTimes(1)
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

    await form.submit(submitEvent)

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

    expect(form.isSubmitting).toBe(false)
  })

  it('revalidates against the updated schema when it changes during submission', async () => {
    const { promise: firstGate, resolve: resolveFirst }
      = Promise.withResolvers<void>()

    const initialSchema = createGatedCallSchema(
      callNumber => (callNumber === 1 ? firstGate : Promise.resolve()),
      (_callNumber, value) => ({ value }),
    ) as typeof nameEmailSchema

    const updatedSchema = createGatedCallSchema(
      () => Promise.resolve(),
      () => ({
        issues: [
          {
            message: 'Rejected by updated schema',
            path: ['name'],
          },
        ],
      }),
    ) as typeof nameEmailSchema

    const schema = shallowRef<typeof nameEmailSchema>(initialSchema)
    const onSubmitAfterSchemaChange = vi.fn()

    const form = createNameEmailForm({
      initialValues: {
        email: 'jane@example.com',
        name: 'Jane',
      },
      onSubmit: onSubmitAfterSchemaChange,
      schema,
    })

    const submission = form.submit(submitEvent)

    // Allow the initial schema validation to start and block.
    await flushPromises()

    expect(form.isSubmitting).toBe(true)

    // Replace the schema while the first validation is pending.
    schema.value = updatedSchema

    resolveFirst()
    await submission

    // The obsolete successful result must not reach the submit handler.
    expect(onSubmitAfterSchemaChange).not.toHaveBeenCalled()

    // The current schema's validation errors should be displayed.
    expect(form.errors[0]?.message).toBe('Rejected by updated schema')
    expect(form.isSubmitting).toBe(false)
  })

  it('releases submission state on reset without clearing a newer submission', async () => {
    const { promise: firstGate, resolve: resolveFirst }
      = Promise.withResolvers<void>()

    const { promise: secondGate, resolve: resolveSecond }
      = Promise.withResolvers<void>()

    const schema = createGatedCallSchema(
      callNumber => (callNumber === 1 ? firstGate : secondGate),
      (_callNumber, value) => ({ value }),
    ) as typeof nameEmailSchema

    const submitHandler = vi.fn()

    const form = createNameEmailForm({
      initialValues: {
        email: 'jane@example.com',
        name: 'Jane',
      },
      onSubmit: submitHandler,
      schema,
    })

    // Start the first submission, which will remain pending.
    const firstSubmission = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)

    // Reset should immediately release the submitting state.
    form.reset()

    expect(form.isSubmitting).toBe(false)

    // A new submission can start while the old validator remains pending.
    const secondSubmission = form.submit(submitEvent)
    await flushPromises()

    expect(form.isSubmitting).toBe(true)

    // Finishing the cancelled submission must not change the new submission's state.
    resolveFirst()
    await firstSubmission

    expect(form.isSubmitting).toBe(true)

    // Finish the current submission.
    resolveSecond()
    await secondSubmission

    expect(submitHandler).toHaveBeenCalledTimes(1)
    expect(form.isSubmitting).toBe(false)
  })
})
