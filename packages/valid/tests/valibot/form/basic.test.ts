import { describe, expect, test } from 'vitest'
import * as v from 'valibot'
import { ref } from 'vue'
import { useForm, Form } from '../../../src'
import { withSetup } from '../../utils'

describe('use-form-basic-valibot', () => {
  // define a simple schema for testing
  const schema = v.object({
    name: v.pipe(v.string(), v.minLength(1)),
    age: v.pipe(v.number(), v.minValue(18)),
  })

  test('initializes with default values and updates state via DOM', async () => {
    // initialize form with schema only
    const { getByRole, state } = withSetup(() => {
      const { state, id } = useForm({
        schema,
      })
      return { state, id }
    }).render(
      `
        <Form :id="id">
            <input name="name" v-model="state.name" aria-label="name" />
            <input name="age" type="number" v-model.number="state.age" aria-label="age" />
        </Form>
        `,
      { Form },
    )

    const nameInput = getByRole('textbox', { name: 'name' })
    const ageInput = getByRole('spinbutton', { name: 'age' })

    await expect.element(nameInput).toHaveValue('')
    await expect.element(ageInput).toHaveValue(null)

    // Update via DOM
    await nameInput.fill('John')
    await ageInput.fill('25')

    expect(state.value.name).toBe('John')
    expect(state.value.age).toBe(25)
  })

  test('two-way reactivity with multiple variables', async () => {
    const { getByRole, state, searchQuery } = withSetup(() => {
      const { state, id } = useForm({ schema })
      const searchQuery = ref('')

      return { state, id, searchQuery }
    }).render(
      `
      <Form :id="id">
        <input v-model="searchQuery" aria-label="Search" />
        <input v-model="state.name" aria-label="Name" />
      </Form>
      `,
      { Form },
    )

    const searchInput = getByRole('textbox', { name: 'Search' })
    const nameInput = getByRole('textbox', { name: 'Name' })

    // 1. DOM -> Ref
    await searchInput.fill('test query')
    await nameInput.fill('Alice')

    expect(searchQuery.value).toBe('test query')
    expect(state.value.name).toBe('Alice')

    // 2. Ref -> DOM
    searchQuery.value = 'new query'
    state.value.name = 'Bob'

    await expect.element(searchInput).toHaveValue('new query')
    await expect.element(nameInput).toHaveValue('Bob')
  })

  test('initializes with provided initial state', async () => {
    const initialState = {
      name: 'John',
      age: 25,
    }

    const { state, getByRole } = withSetup(() => {
      const { state, id } = useForm({
        schema,
        initialState,
      })
      return { state, id }
    }).render(
      `
        <Form :id="id">
            <input name="name" v-model="state.name" aria-label="name" />
            <input name="age" type="number" v-model.number="state.age" aria-label="age" />
        </Form>
        `,
      { Form },
    )

    const nameInput = getByRole('textbox', { name: 'name' })
    const ageInput = getByRole('spinbutton', { name: 'age' })

    await expect.element(nameInput).toHaveValue('John')
    await expect.element(ageInput).toHaveValue(25)

    expect(state.value).toEqual(initialState)
  })

  test('initializes with provided initial errors', () => {
    const initialErrors = [
      {
        path: ['name'],
        message: 'Name is required',
      },
    ]

    const { errors, isValid } = withSetup(() => useForm({
      schema,
      initialErrors,
    })).render('<div></div>')

    expect(errors.value).toEqual(initialErrors)
    expect(isValid.value).toBe(false)
  })
})
