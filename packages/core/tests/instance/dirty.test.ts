import { describe, expect, it } from 'vitest'
import { createNameEmailForm } from '../helpers/create-form'

describe('dirty', () => {
  it('markFieldAsDirty marks the field as dirty', () => {
    const form = createNameEmailForm()
    form.markFieldAsDirty('name')

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.isDirty).toBe(true)
  })

  it('markAllFieldsAsDirty marks every field as dirty', () => {
    const form = createNameEmailForm()
    form.markAllFieldsAsDirty()

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.dirtyFields.has('email')).toBe(true)
  })

  it('isDirty is false when no fields have been dirtied', () => {
    const form = createNameEmailForm()

    expect(form.isDirty).toBe(false)
  })

  it('unmarkFieldAsDirty clears dirty state for a single field', () => {
    const form = createNameEmailForm()
    form.markAllFieldsAsDirty()
    form.unmarkFieldAsDirty('name')

    expect(form.dirtyFields.has('name')).toBe(false)
    expect(form.dirtyFields.has('email')).toBe(true)
  })
})
