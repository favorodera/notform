import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { object, string } from '../../schemas'
import { createForm } from '../../src/factories/create-form'

const schema = object({ name: string(2) })

describe('form.field', () => {
  it('caches a field by path and keeps the first config', async () => {
    const form = createForm({ initialValues: { name: 'J' }, schema })
    const field = form.field('name', { validateOn: { input: true }, validationMode: 'lazy' })
    const cachedField = form.field('name', { validateOn: { input: false }, validationMode: 'lazy' })

    expect(cachedField).toBe(field)

    field.events.onInput()
    await flushPromises()

    expect(field.errors).toHaveLength(1)
  })

  it('keeps its model linked to values and tracks dirty and touched state', async () => {
    const form = createForm({ initialValues: { name: 'Jane' }, schema })
    const field = form.field('name')

    field.model = 'Janet'

    expect(form.values.name).toBe('Janet')
    expect(field.isDirty).toBe(true)

    field.model = 'Jane'

    expect(field.isDirty).toBe(false)

    field.events.onBlur()
    await flushPromises()

    expect(field.isTouched).toBe(true)
    expect(form.isTouched).toBe(true)
  })

  it('uses default change validation and eager revalidation after an error', async () => {
    const form = createForm({ initialValues: { name: 'J' }, schema })
    const field = form.field('name')

    field.events.onInput()
    await flushPromises()

    expect(field.errors).toHaveLength(0)
    expect(field.isValid).toBe(true)

    field.events.onChange()
    await flushPromises()

    expect(field.errors).toHaveLength(1)
    expect(field.isValid).toBe(false)

    field.model = 'Jane'
    field.events.onInput()
    await flushPromises()

    expect(field.errors).toHaveLength(0)
    expect(field.isValid).toBe(true)
  })

  it('validates only configured events in lazy mode', async () => {
    const form = createForm({ initialValues: { name: 'J' }, schema })
    const field = form.field('name', {
      validateOn: { blur: false, change: false, input: true },
      validationMode: 'lazy',
    })

    field.events.onChange()
    await flushPromises()

    expect(field.errors).toHaveLength(0)

    field.events.onInput()
    await flushPromises()

    expect(field.errors).toHaveLength(1)
  })

  it('coalesces repeated events into one debounced validation', async () => {
    vi.useFakeTimers()

    try {
      const debouncedSchema = object({ name: string(2) })
      const validate = vi.spyOn(debouncedSchema['~standard'], 'validate')
      const form = createForm({ initialValues: { name: 'J' }, schema: debouncedSchema })
      const field = form.field('name', { debounce: 100 })

      field.events.onChange()
      await vi.advanceTimersByTimeAsync(40)
      field.events.onChange()
      await vi.advanceTimersByTimeAsync(99)

      expect(validate).not.toHaveBeenCalled()

      await vi.advanceTimersByTimeAsync(1)
      await flushPromises()

      expect(validate).toHaveBeenCalledTimes(1)
      expect(field.errors).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('validates immediately on blur when debounce is configured', async () => {
    vi.useFakeTimers()

    try {
      const debouncedSchema = object({ name: string(2) })
      const validate = vi.spyOn(debouncedSchema['~standard'], 'validate')
      const form = createForm({ initialValues: { name: 'J' }, schema: debouncedSchema })
      const field = form.field('name', { debounce: 100 })

      field.events.onBlur()
      await flushPromises()

      expect(validate).toHaveBeenCalledTimes(1)
      expect(field.isTouched).toBe(true)
      expect(field.errors).toHaveLength(1)

      await vi.advanceTimersByTimeAsync(100)

      expect(validate).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('cancels a pending debounce when explicitly validated', async () => {
    vi.useFakeTimers()

    try {
      const debouncedSchema = object({ name: string(2) })
      const validate = vi.spyOn(debouncedSchema['~standard'], 'validate')
      const form = createForm({ initialValues: { name: 'J' }, schema: debouncedSchema })
      const field = form.field('name', { debounce: 100 })

      field.events.onChange()
      await field.validate()
      await flushPromises()
      await vi.advanceTimersByTimeAsync(100)
      await flushPromises()

      expect(validate).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })
})
