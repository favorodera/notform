import { describe, expect, it } from 'vitest'
import { mountNameEmailForm } from '../helpers/mount-form'

describe('dirty', () => {
  it('markFieldAsDirty marks the field as dirty', () => {
    const { form } = mountNameEmailForm()
    form.markFieldAsDirty('name')

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.isDirty).toBe(true)
  })

  it('markAllFieldsAsDirty marks every field as dirty', () => {
    const { form } = mountNameEmailForm()
    form.markAllFieldsAsDirty()

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.dirtyFields.has('email')).toBe(true)
  })

  it('isDirty is false when no fields have been dirtied', () => {
    const { form } = mountNameEmailForm()

    expect(form.isDirty).toBe(false)
  })

  it('unmarkFieldAsDirty clears dirty state for a single field', () => {
    const { form } = mountNameEmailForm()
    form.markAllFieldsAsDirty()
    form.unmarkFieldAsDirty('name')

    expect(form.dirtyFields.has('name')).toBe(false)
    expect(form.dirtyFields.has('email')).toBe(true)
  })
})
