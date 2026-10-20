import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('values', () => {
  it('initializes with provided initial values', () => {
    const form = createNameEmailForm()

    expect(form.values.name).toBe('')
    expect(form.values.email).toBe('')
  })

  it('setValue updates the value at the given path', () => {
    const form = createNameEmailForm()
    form.setValue('name', 'Jane')

    expect(form.values.name).toBe('Jane')
  })

  it('setValue makes only the changed path dirty', () => {
    const form = createNameEmailForm()
    form.setValue('name', 'Jane')

    expect(form.isPathDirty('name')).toBe(true)
    expect(form.isPathDirty('email')).toBe(false)
    expect(form.isDirty).toBe(true)
  })

  it('reset leaves a partial baseline partial at runtime', () => {
    const form = createNameEmailForm()

    form.reset({ name: 'Jane' })

    expect(form.values).toStrictEqual({ name: 'Jane' })
    expect(form.isPathDirty('email')).toBe(false)
    expect(form.isDirty).toBe(false)
  })
})
