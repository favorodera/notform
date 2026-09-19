import { describe, expect, it } from 'vitest'
import { mountNameEmailForm } from '../helpers/mount-form'

describe('values', () => {
  it('initializes with provided initial values', () => {
    const { form } = mountNameEmailForm()

    expect(form.values.name).toBe('')
    expect(form.values.email).toBe('')
  })

  it('setValue updates the value at the given path', () => {
    const { form } = mountNameEmailForm()
    form.setValue('name', 'Jane')

    expect(form.values.name).toBe('Jane')
  })

  it('setValue marks the field dirty when the value differs from initial', () => {
    const { form } = mountNameEmailForm()
    form.setValue('name', 'Jane')

    expect(form.dirtyFields.has('name')).toBe(true)
    expect(form.isDirty).toBe(true)
  })

  it('setValue marks the field clean when the value matches initial', () => {
    const { form } = mountNameEmailForm()

    form.setValue('name', 'Jane')
    form.setValue('name', '')

    expect(form.dirtyFields.has('name')).toBe(false)
    expect(form.isDirty).toBe(false)
  })
})
