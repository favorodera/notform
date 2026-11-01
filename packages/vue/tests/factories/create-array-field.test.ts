import { describe, expect, it } from 'vitest'
import { array, object, string } from '../../schemas'
import { createForm } from '../../src/factories/create-form'

const personSchema = object({
  name: string(2),
  tags: array(string()),
})

const schema = object({ people: array(personSchema) })

const initialPeople = [
  { name: 'Ada', tags: ['red'] },
  { name: 'Bea', tags: ['green'] },
  { name: 'Cal', tags: ['blue'] },
]

describe('form.arrayField', () => {
  it('inserts cloned items and remaps errors when inserting and removing', () => {
    const form = createForm({ initialValues: { people: initialPeople }, schema })
    const people = form.arrayField('people')
    const secondId = people.items[1]?.id
    const inserted = { name: 'Dee', tags: ['yellow'] }

    form.setError({ message: 'First error', path: ['people', 0, 'name'] })
    form.setError({ message: 'Second error', path: ['people', 1, 'name'] })
    people.insert(1, inserted)

    expect(form.values.people.map((person) => {
      return person.name
    })).toStrictEqual(['Ada', 'Dee', 'Bea', 'Cal'])
    expect(form.values.people[1]).not.toBe(inserted)
    expect(people.items[2]?.id).toBe(secondId)
    expect(form.getFieldErrors('people.2.name')).toStrictEqual([{ message: 'Second error', path: ['people', 2, 'name'] }])

    inserted.name = 'Changed outside the form'
    inserted.tags.push('external')

    expect(form.values.people[1]?.name).toBe('Dee')
    expect(form.values.people[1]?.tags).toStrictEqual(['yellow'])

    people.remove(0)

    expect(form.values.people.map((person) => {
      return person.name
    })).toStrictEqual(['Dee', 'Bea', 'Cal'])
    expect(form.getFieldErrors('people.0.name')).toHaveLength(0)
    expect(form.getFieldErrors('people.1.name')).toStrictEqual([{ message: 'Second error', path: ['people', 1, 'name'] }])

    people.prepend({ name: 'Eve', tags: [] })
    people.append({ name: 'Fox', tags: [] })

    expect(form.values.people.map((person) => {
      return person.name
    })).toStrictEqual(['Eve', 'Dee', 'Bea', 'Cal', 'Fox'])
  })

  it('keeps item identities and errors with their items during move and swap', () => {
    const form = createForm({ initialValues: { people: initialPeople }, schema })
    const people = form.arrayField('people')
    const initialIds = people.items.map((item) => {
      return item.id
    })

    form.setError({ message: 'Ada error', path: ['people', 0, 'name'] })
    form.setError({ message: 'Cal error', path: ['people', 2, 'name'] })

    people.move(0, 2)

    expect(people.items.map((item) => {
      return item.id
    })).toStrictEqual([initialIds[1], initialIds[2], initialIds[0]])
    expect(people.items[2]?.path).toBe('people.2')
    expect(form.getFieldErrors('people.2.name')).toStrictEqual([{ message: 'Ada error', path: ['people', 2, 'name'] }])
    expect(form.getFieldErrors('people.1.name')).toStrictEqual([{ message: 'Cal error', path: ['people', 1, 'name'] }])

    people.swap(0, 2)

    expect(people.items.map((item) => {
      return item.id
    })).toStrictEqual([initialIds[0], initialIds[2], initialIds[1]])
    expect(form.getFieldErrors('people.0.name')).toStrictEqual([{ message: 'Ada error', path: ['people', 0, 'name'] }])
    expect(form.getFieldErrors('people.1.name')).toStrictEqual([{ message: 'Cal error', path: ['people', 1, 'name'] }])
  })

  it('keeps an updated item identity and drops its old errors', () => {
    const form = createForm({ initialValues: { people: initialPeople }, schema })
    const people = form.arrayField('people', { validateOn: { blur: false } })
    const firstItemId = people.items[0]?.id
    const firstItem = people.items[0]
    const replacement = { name: 'Dee', tags: ['yellow'] }

    firstItem?.events.onBlur()
    form.setError({ message: 'Old item error', path: ['people', 0, 'name'] })
    people.update(0, replacement)

    expect(people.items[0]?.id).toBe(firstItemId)
    expect(people.items[0]?.isTouched).toBe(true)
    expect(form.values.people[0]).not.toBe(replacement)
    expect(form.getFieldErrors('people.0.name')).toHaveLength(0)

    people.update(-1, { name: 'Ada', tags: ['red'] })

    expect(form.values.people[0]?.name).toBe('Dee')
  })

  it('tracks array-level errors and validity through append', async () => {
    const requiredSchema = object({ people: array(personSchema, 1) })
    const form = createForm({ initialValues: { people: [] }, schema: requiredSchema })
    const people = form.arrayField('people')
    const invalidResult = await people.validate()

    expect(invalidResult.issues).toHaveLength(1)
    expect(people.errors).toStrictEqual([{ message: 'Must have at least 1 item', path: ['people'] }])
    expect(people.isValid).toBe(false)

    people.append({ name: 'Ada', tags: ['red'] })
    const validResult = await people.validate()

    expect(validResult.issues).toBeUndefined()
    expect(people.errors).toHaveLength(0)
    expect(people.isValid).toBe(true)
  })

  it('renews item identities on reset and makes removed item handles inert', () => {
    const form = createForm({ initialValues: { people: initialPeople }, schema })
    const people = form.arrayField('people')
    const initialIds = people.items.map((item) => {
      return item.id
    })
    const removedItem = people.items[0]

    expect(removedItem).toBeDefined()

    people.remove(0)
    removedItem.model = { name: 'Stale write', tags: [] }

    expect(form.values.people.map((person) => {
      return person.name
    })).toStrictEqual(['Bea', 'Cal'])

    form.reset()

    expect(people.items.map((item) => {
      return item.id
    })).toHaveLength(initialIds.length)
    expect(people.items.every((item) => {
      return !initialIds.includes(item.id)
    })).toBe(true)
  })

  it('keeps nested fields attached to their item after a move', () => {
    const form = createForm({ initialValues: { people: initialPeople }, schema })
    const people = form.arrayField('people')
    const firstItem = people.items[0]

    expect(firstItem).toBeDefined()

    const nameField = firstItem.field('name')

    people.move(0, 2)

    expect(firstItem.index).toBe(2)
    expect(nameField.path).toBe('people.2.name')

    nameField.model = 'Adele'

    expect(form.values.people[2]?.name).toBe('Adele')
  })
})
