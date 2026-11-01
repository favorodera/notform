import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { object, string } from '../../schemas'
import { createForm } from '../../src/factories/create-form'

const schema = object({
  email: string(5),
  name: string(2),
})

describe('createForm', () => {
  it('replaces only errors at the validated field path', async () => {
    const form = createForm({
      initialErrors: [
        { message: 'Old name error', path: ['name'] },
        { message: 'Email error', path: ['email'] },
      ],
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      schema,
    })

    const validResult = await form.validateField('name')

    expect(validResult).toStrictEqual({ value: 'Jane' })
    expect(form.errors).toStrictEqual([{ message: 'Email error', path: ['email'] }])

    form.setValue('name', 'J')
    const invalidResult = await form.validateField('name')

    expect(invalidResult.issues).toStrictEqual([{ message: 'Must be at least 2 characters', path: ['name'] }])
    expect(form.errors).toStrictEqual([
      { message: 'Email error', path: ['email'] },
      { message: 'Must be at least 2 characters', path: ['name'] },
    ])
  })

  it('does not apply an older same-field validation after a newer run starts', async () => {
    const firstGate = Promise.withResolvers<void>()
    const secondGate = Promise.withResolvers<void>()
    const gates = [firstGate, secondGate]
    let callCount = 0
    const raceSchema = object({ name: string(2) })

    vi.spyOn(raceSchema['~standard'], 'validate').mockImplementation(async (value) => {
      const call = callCount++
      const gate = gates[call]

      if (!gate) {
        throw new Error('Unexpected schema validation call')
      }

      await gate.promise

      return call === 0
        ? { issues: [{ message: 'Stale error', path: ['name'] }] }
        : { value: value as { name: string } }
    })

    const form = createForm({ initialValues: { name: 'Jane' }, schema: raceSchema })
    const field = form.field('name')
    const first = field.validate()
    await flushPromises()
    const second = field.validate()
    await flushPromises()

    expect(field.isValidating).toBe(true)

    firstGate.resolve()
    await first

    expect(form.isValidating).toBe(true)
    expect(field.isValidating).toBe(true)
    expect(form.errors).toHaveLength(0)

    secondGate.resolve()
    await second

    expect(form.isValidating).toBe(false)
    expect(field.isValidating).toBe(false)
    expect(field.isValid).toBe(true)
    expect(form.errors).toHaveLength(0)
  })

  it('retries submission when values change during validation', async () => {
    const firstGate = Promise.withResolvers<void>()
    const raceSchema = object({ name: string(2) })
    let callCount = 0

    vi.spyOn(raceSchema['~standard'], 'validate').mockImplementation(async (value) => {
      if (callCount++ === 0) {
        await firstGate.promise
        return { issues: [{ message: 'Stale error', path: ['name'] }] }
      }

      return { value: value as { name: string } }
    })

    const onSubmit = vi.fn()
    const form = createForm({ initialValues: { name: 'J' }, onSubmit, schema: raceSchema })
    const submission = form.submit()
    await flushPromises()

    expect(form.isValidating).toBe(true)

    form.setValue('name', 'Jane')
    firstGate.resolve()
    await submission

    expect(callCount).toBe(2)
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ name: 'Jane' })
    expect(form.errors).toHaveLength(0)
  })

  it('blocks invalid submission and passes validated values to the handler', async () => {
    const onSubmit = vi.fn()
    const form = createForm({ initialValues: { email: 'jane@example.com', name: 'J' }, onSubmit, schema })

    await form.submit()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.errors).toHaveLength(1)
    expect(form.isValid).toBe(false)
    expect(form.isSubmitted).toBe(true)
    expect(form.isSubmitting).toBe(false)

    form.setValue('name', 'Jane')
    await form.submit()

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ email: 'jane@example.com', name: 'Jane' })
    expect(form.errors).toHaveLength(0)
    expect(form.isValid).toBe(true)
    expect(form.isSubmitting).toBe(false)
  })

  it('resets to the latest baseline and clears transient state', async () => {
    const initialError = { message: 'Server error', path: ['name'] }
    const nextError = { message: 'Updated server error', path: ['name'] }
    const form = createForm({
      initialErrors: [initialError],
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      schema,
    })

    form.field('name').events.onBlur()
    await flushPromises()
    await form.submit()
    form.setValue('name', 'Changed')
    form.reset({ email: 'new@example.com', name: 'New name' }, [nextError])

    expect(form.values).toStrictEqual({ email: 'new@example.com', name: 'New name' })
    expect(form.errors).toStrictEqual([nextError])
    expect(form.isTouched).toBe(false)
    expect(form.isSubmitted).toBe(false)

    form.setValue('name', 'Changed again')
    form.reset()

    expect(form.values).toStrictEqual({ email: 'new@example.com', name: 'New name' })
    expect(form.errors).toStrictEqual([nextError])
    expect(form.isDirty).toBe(false)
  })

  it('does not apply validation results made stale by reset', async () => {
    const gate = Promise.withResolvers<void>()
    const resetSchema = object({ name: string(2) })

    vi.spyOn(resetSchema['~standard'], 'validate').mockImplementation(async () => {
      await gate.promise
      return { issues: [{ message: 'Stale error', path: ['name'] }] }
    })

    const form = createForm({ initialValues: { name: 'Jane' }, schema: resetSchema })
    const validation = form.validate()
    await flushPromises()

    form.reset()

    expect(form.isValidating).toBe(false)

    gate.resolve()
    await validation

    expect(form.errors).toHaveLength(0)
  })
})
