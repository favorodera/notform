import { describe, expect, it } from 'vitest'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { locatePathInArrayField, remapArrayFieldState } from '../../src/utils/array-field'
import { emailGroupsSchema } from '../helpers/not-validator'

describe('locatePathInArrayField', () => {
  it('returns undefined for a path outside the array', () => {
    expect(locatePathInArrayField(['tags', 0], ['groups'])).toBeUndefined()
  })

  it('returns undefined for the array path itself, with no item segment', () => {
    expect(locatePathInArrayField(['groups'], ['groups'])).toBeUndefined()
  })

  it('returns undefined for a sibling field with an overlapping name prefix', () => {
    expect(locatePathInArrayField(['groupsOther', 0], ['groups'])).toBeUndefined()
  })

  it('locates an item with no remaining segments', () => {
    expect(locatePathInArrayField(['groups', 0], ['groups'])).toStrictEqual({
      index: 0,
      remainingPathSegments: [],
    })
  })

  it('locates a field one level inside an object item', () => {
    expect(locatePathInArrayField(['groups', 1, 'name'], ['groups'])).toStrictEqual({
      index: 1,
      remainingPathSegments: ['name'],
    })
  })

  it('locates a field arbitrarily many levels inside an item', () => {
    expect(locatePathInArrayField(['groups', 0, 'tags', 2], ['groups'])).toStrictEqual({
      index: 0,
      remainingPathSegments: ['tags', 2],
    })
  })

  it('normalizes numeric and string index segments the same way as areSegmentsEqual', () => {
    expect(locatePathInArrayField(['groups', '0', 'name'], ['groups'])).toStrictEqual({
      index: 0,
      remainingPathSegments: ['name'],
    })
  })
})

const createForm = () => createNotFormInstance({
  initialValues: {
    email: '',
    groups: [
      { name: 'Frontend', tags: ['vue'] },
      { name: 'Backend', tags: ['node'] },
    ],
  },
  schema: emailGroupsSchema,
})

describe('remapArrayFieldState', () => {
  it('shifts touched, dirty, and error state nested at any depth inside an item', () => {
    const form = createForm()

    form.markFieldAsTouched('groups.0.name')
    form.markFieldAsTouched('groups.1.tags.0')
    form.markFieldAsDirty('groups.1.name')
    form.setError({ message: 'Required', path: ['groups', 1, 'tags', 0] })

    // simulate removing index 0: index 0 drops out, index 1 becomes index 0
    remapArrayFieldState(form, 'groups', (previousIndex) => {
      if (previousIndex === 0) {
        return
      }
      return previousIndex - 1
    })

    expect(form.touchedFields.has('groups.0.name')).toBe(false)
    expect(form.touchedFields.has('groups.0.tags.0')).toBe(true)
    expect(form.dirtyFields.has('groups.0.name')).toBe(true)
    expect(form.getFieldErrors('groups.0.tags.0')).toHaveLength(1)
  })

  it('leaves paths outside the array untouched', () => {
    const form = createForm()
    form.markFieldAsTouched('email')

    remapArrayFieldState(form, 'groups', previousIndex => previousIndex + 1)

    expect(form.touchedFields.has('email')).toBe(true)
  })
})
