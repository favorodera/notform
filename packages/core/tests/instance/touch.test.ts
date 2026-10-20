import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('touch', () => {
  it('markFieldAsTouched marks the field as touched', () => {
    const form = createNameEmailForm()
    form.markFieldAsTouched('name')

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.isPathTouched('name')).toBe(true)
    expect(form.isTouched).toBe(true)
  })

  it('submit marks every logical field touched without enumerating current leaves', async () => {
    const form = createNameEmailForm({ initialValues: {} })

    await form.submit()

    expect(form.submitCount).toBe(1)
    expect(form.isSubmitted).toBe(true)
    expect(form.isTouched).toBe(true)
    expect(form.isPathTouched('name')).toBe(true)
    expect(form.isPathTouched('email')).toBe(true)
    expect(form.touchedFields.size).toBe(0)
  })

  it('isTouched is false when no fields have been touched or submitted', () => {
    const form = createNameEmailForm()

    expect(form.isTouched).toBe(false)
    expect(form.isSubmitted).toBe(false)
  })

  it('unmarkFieldAsTouched clears explicit touch before submit', () => {
    const form = createNameEmailForm()
    form.markFieldAsTouched('name')
    form.markFieldAsTouched('email')
    form.unmarkFieldAsTouched('name')

    expect(form.touchedFields.has('name')).toBe(false)
    expect(form.touchedFields.has('email')).toBe(true)
    expect(form.isPathTouched('name')).toBe(false)
    expect(form.isPathTouched('email')).toBe(true)
  })
})
