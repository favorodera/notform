import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('errors', () => {
  it('errors is empty on initialization', () => {
    const form = createNameEmailForm()

    expect(form.errors).toHaveLength(0)
    expect(form.isValid).toBe(true)
  })

  it('initializes with provided initial errors', () => {
    const form = createNameEmailForm({
      initialErrors: [{ message: 'Server rejected this field', path: ['name'] }],
    })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Server rejected this field')
    expect(form.isValid).toBe(false)
  })

  it('setError appends a new error', () => {
    const form = createNameEmailForm()
    form.setError({ message: 'Required', path: [{ key: 'name' }] })

    expect(form.errors).toHaveLength(1)
    expect(form.isValid).toBe(false)
  })

  it('setError replaces an existing error for the same path', () => {
    const form = createNameEmailForm()

    form.setError({ message: 'Too short', path: [{ key: 'name' }] })
    form.setError({ message: 'Required', path: [{ key: 'name' }] })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Required')
  })

  it('setError appends a pathless error', () => {
    const form = createNameEmailForm()

    form.setError({ message: 'Form-level failure' })

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Form-level failure')
  })

  it('replaceErrors replaces all errors', () => {
    const form = createNameEmailForm()

    form.setError({ message: 'Too short', path: [{ key: 'name' }] })
    form.replaceErrors([{ message: 'Invalid email', path: [{ key: 'email' }] }])

    expect(form.errors).toHaveLength(1)
    expect(form.errors[0].message).toBe('Invalid email')
  })

  it('clearErrors removes all errors', () => {
    const form = createNameEmailForm()

    form.setError({ message: 'Required', path: [{ key: 'name' }] })
    form.clearErrors()

    expect(form.errors).toHaveLength(0)
    expect(form.isValid).toBe(true)
  })

  it('getFieldErrors returns only errors for the given path', () => {
    const form = createNameEmailForm()

    form.replaceErrors([
      { message: 'Too short', path: [{ key: 'name' }] },
      { message: 'Invalid email', path: [{ key: 'email' }] },
    ])
    const nameErrors = form.getFieldErrors('name')

    expect(nameErrors).toHaveLength(1)
    expect(nameErrors[0].message).toBe('Too short')
  })
})