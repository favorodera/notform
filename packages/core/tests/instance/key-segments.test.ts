import { describe, expect, it } from 'vitest'
import { useNotArrayField } from '../../src/composables/use-not-array-field'
import { createNotFormInstance } from '../../src/factories/create-not-form-instance'
import { emailGroupsSchemaWithKeySegments, nameEmailSchemaWithKeySegments } from '../helpers/not-validator'

describe('{ key } path segments from validate/validateField', () => {
  it('getFieldErrors matches a { key }-segmented issue against a plain-string path', async () => {
    const form = createNotFormInstance({ schema: nameEmailSchemaWithKeySegments })

    await form.validateField('name')

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
  })

  it('validate() writes errors whose { key } paths still resolve through getFieldErrors', async () => {
    const form = createNotFormInstance({ schema: nameEmailSchemaWithKeySegments })

    await form.validate()

    expect(form.getFieldErrors('name').length).toBeGreaterThan(0)
    expect(form.getFieldErrors('email').length).toBeGreaterThan(0)
  })
})

describe('{ key } path segments in array fields', () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const createForm = () => createNotFormInstance({
    initialValues: {
      email: '',
      groups: [
        { name: 'Frontend', tags: ['vue'] },
        { name: 'Backend', tags: ['node'] },
      ],
    },
    schema: emailGroupsSchemaWithKeySegments,
  })

  it('isValid recurses into a { key }-segmented issue nested inside an item', async () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.setValue('groups.0.name', '')
    await form.validateField('groups.0.name')

    expect(groups.isValid).toBe(false)
  })

  it('remove remaps a { key }-segmented error onto the surviving item', async () => {
    const form = createForm()
    const groups = useNotArrayField({ form, path: 'groups' })

    form.setValue('groups.1.name', '')
    await form.validateField('groups.1.name')

    expect(form.getFieldErrors('groups.1.name').length).toBeGreaterThan(0)

    groups.remove(0)

    expect(form.getFieldErrors('groups.0.name').length).toBeGreaterThan(0)
    expect(form.getFieldErrors('groups.1.name')).toHaveLength(0)
  })
})