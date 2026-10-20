import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('dirty', () => {
  it('derives field dirty state from values versus the reset baseline', () => {
    const form = createNameEmailForm()

    expect(form.isPathDirty('name')).toBe(false)
    expect(form.isDirty).toBe(false)

    form.setValue('name', 'Jane')

    expect(form.isPathDirty('name')).toBe(true)
    expect(form.isDirty).toBe(true)
  })

  it('returns to clean when a field is restored to its baseline', () => {
    const form = createNameEmailForm()

    form.setValue('name', 'Jane')
    form.setValue('name', '')

    expect(form.isPathDirty('name')).toBe(false)
    expect(form.isDirty).toBe(false)
  })

  it('tracks direct nested mutations without an event handler', () => {
    const form = createNameEmailForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
    })

    form.values.name = 'John'

    expect(form.isPathDirty('name')).toBe(true)
    expect(form.isDirty).toBe(true)

    form.values.name = 'Jane'

    expect(form.isPathDirty('name')).toBe(false)
    expect(form.isDirty).toBe(false)
  })
})
