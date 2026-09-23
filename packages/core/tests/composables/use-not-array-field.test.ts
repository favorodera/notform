import { describe, expect, it } from 'vitest'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { useNotArrayField } from '../../src/composables/use-not-array-field'
import { emailGroupsSchema, object, string } from '../helpers/not-validator'

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

describe('errors stay exact-match on the array field own path', () => {
  it('does not include an item-level issue', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.setError({ message: 'Required', path: ['groups', 0, 'name'] })

    expect(groups.errors).toStrictEqual([])
  })

  it('does include an issue reported directly on the array path', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.setError({ message: 'Add at least one group', path: ['groups'] })

    expect(groups.errors).toHaveLength(1)
    expect(groups.errors[0].message).toBe('Add at least one group')
  })
})

describe('isValid/isTouched/isDirty/isValidating recurse to any depth', () => {
  it('isValid becomes false from an issue on a nested object field inside an item', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    expect(groups.isValid).toBe(true)

    form.setError({ message: 'Required', path: ['groups', 0, 'name'] })

    expect(groups.isValid).toBe(false)
    // still exact-match only:
    expect(groups.errors).toStrictEqual([])
  })

  it('isValid becomes false from an issue inside a nested array within an item', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.setError({ message: 'Tag cannot be empty', path: ['groups', 0, 'tags', 0] })

    expect(groups.isValid).toBe(false)
  })

  it('isTouched becomes true from a nested object field being touched', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    expect(groups.isTouched).toBe(false)

    form.markFieldAsTouched('groups.0.name')

    expect(groups.isTouched).toBe(true)
  })

  it('isTouched becomes true from an item inside a nested array being touched', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.markFieldAsTouched('groups.1.tags.0')

    expect(groups.isTouched).toBe(true)
  })

  it('isDirty becomes true from a nested object field differing from baseline', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    expect(groups.isDirty).toBe(false)

    form.setValue('groups.0.name', 'Platform')

    expect(groups.isDirty).toBe(true)
  })

  it('a nested NotArrayField and its ancestor both see the same nested issue', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })
    const firstGroupTags = useNotArrayField({ form, path: 'groups.0.tags' })

    form.setError({ message: 'Tag cannot be empty', path: ['groups', 0, 'tags', 0] })

    // exact-match errors: neither array's `errors` includes it directly
    expect(firstGroupTags.errors).toStrictEqual([])
    expect(groups.errors).toStrictEqual([])

    // recursive aggregates: both ancestors see it
    expect(firstGroupTags.isValid).toBe(false)
    expect(groups.isValid).toBe(false)
  })

  it('does not treat a sibling field with an overlapping name as nested', () => {
    const form = createNotFormInstance({
      initialValues: { group: '', groupOther: '' },
      schema: object({
        group: string(),
        groupOther: string(),
      }),
    })
    const group = useNotArrayField({ form, path: 'group' })

    form.markFieldAsTouched('groupOther')

    expect(group.isTouched).toBe(false)
  })
})

describe('mutation methods remap nested state at any depth (regression)', () => {
  it('remove discards the removed item own nested state and shifts the rest', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.markFieldAsTouched('groups.0.name')
    form.markFieldAsDirty('groups.1.tags.0')
    form.setError({ message: 'Required', path: ['groups', 1, 'name'] })

    groups.remove(0)

    expect(form.touchedFields.has('groups.0.name')).toBe(false)
    expect(form.dirtyFields.has('groups.0.tags.0')).toBe(true)
    expect(form.getFieldErrors('groups.0.name')).toHaveLength(1)
  })

  it('insert shifts nested state of every later item forward', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.markFieldAsTouched('groups.1.tags.0')

    groups.insert(0, { name: 'New', tags: [] })

    expect(form.touchedFields.has('groups.1.tags.0')).toBe(false)
    expect(form.touchedFields.has('groups.2.tags.0')).toBe(true)
  })

  it('swap exchanges nested state between the two items', () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.markFieldAsDirty('groups.0.tags.0')

    groups.swap(0, 1)

    expect(form.dirtyFields.has('groups.0.tags.0')).toBe(false)
    expect(form.dirtyFields.has('groups.1.tags.0')).toBe(true)
  })
})
