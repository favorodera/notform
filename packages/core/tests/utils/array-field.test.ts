import { describe, expect, it } from 'vitest'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { locatePathInArrayField, remapArrayFieldState } from '../../src/utils/array-field'
import { nameEmailSchema, tagsSchema } from '../helpers/not-validator'

describe('locatePathInArrayField', () => {
  it('returns the item index and remaining segments', () => {
    expect(locatePathInArrayField(['tags', 1], ['tags'])).toStrictEqual({
      index: 1,
      remainingPathSegments: [],
    })

    expect(locatePathInArrayField(['users', '0', 'email'], ['users'])).toStrictEqual({
      index: 0,
      remainingPathSegments: ['email'],
    })
  })

  it('returns undefined when the path is not inside the array', () => {
    expect(locatePathInArrayField(['tags'], ['tags'])).toBeUndefined()
    expect(locatePathInArrayField(['name'], ['tags'])).toBeUndefined()
    expect(locatePathInArrayField(['tags', 'x'], ['tags'])).toBeUndefined()
  })
})

describe('remapArrayFieldState', () => {
  it('moves touched, dirty, and error state with the item after remove', () => {
    const form = createNotFormInstance({
      initialValues: { tags: ['a', 'b', 'c'] },
      schema: tagsSchema,
    })

    form.markFieldAsTouched('tags.2')
    form.markFieldAsDirty('tags.2')
    form.setError({ message: 'bad', path: ['tags', 2] })

    remapArrayFieldState(form, 'tags', (previousIndex) => {
      if (previousIndex === 1) {
        return
      }

      return previousIndex > 1 ? previousIndex - 1 : previousIndex
    })

    expect(form.touchedFields.has('tags.2')).toBe(false)
    expect(form.touchedFields.has('tags.1')).toBe(true)
    expect(form.dirtyFields.has('tags.1')).toBe(true)
    expect(form.errors[0]?.path).toStrictEqual(['tags', 1])
  })

  it('leaves paths outside the array unchanged', () => {
    const form = createNotFormInstance({
      initialValues: { email: '', name: '' },
      schema: nameEmailSchema,
    })

    form.markFieldAsTouched('name')
    form.setError({ message: 'required', path: ['name'] })

    remapArrayFieldState(form, 'missing' as never, previousIndex => previousIndex + 1)

    expect(form.touchedFields.has('name')).toBe(true)
    expect(form.errors[0]?.path).toStrictEqual(['name'])
  })
})
