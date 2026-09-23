import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('touch', () => {
  it('markFieldAsTouched marks the field as touched', () => {
    const form = createNameEmailForm()
    form.markFieldAsTouched('name')

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.isTouched).toBe(true)
  })

  it('markAllFieldsAsTouched marks every field as touched', () => {
    const form = createNameEmailForm()
    form.markAllFieldsAsTouched()

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.touchedFields.has('email')).toBe(true)
  })

  it('isTouched is false when no fields have been touched', () => {
    const form = createNameEmailForm()

    expect(form.isTouched).toBe(false)
  })

  it('unmarkFieldAsTouched clears touched state for a single field', () => {
    const form = createNameEmailForm()
    form.markAllFieldsAsTouched()
    form.unmarkFieldAsTouched('name')

    expect(form.touchedFields.has('name')).toBe(false)
    expect(form.touchedFields.has('email')).toBe(true)
  })
})