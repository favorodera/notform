import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { ref } from 'vue'
import { useForm, Form } from '../../../src'
import { withSetup } from '../../utils'

describe('use-form-basic', () => {
  test('initializes with default values and updates state via DOM', async () => {
    const { getByRole, state } = withSetup(() => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18),
      })

      const { state, id } = useForm({ schema })

      return { state, id }
    }).render(
      `
    <Form :id="id">
      <label for="name">name</label>
      <input id="name" name="name" type="text" v-model="state.name" />

      <label for="age">age</label>
      <input id="age" name="age" type="number" v-model.number="state.age" />
    </Form>
  `,
      { Form },
    )

    const nameInput = getByRole('textbox', { name: 'name' })
    const ageInput = getByRole('spinbutton', { name: 'age' })

    await expect.element(nameInput).toHaveValue('')
    await expect.element(ageInput).toHaveValue(null)

    // Update values via DOM
    await nameInput.fill('John')
    await ageInput.fill('25')

    // check state is updated (Input -> Ref)
    expect(state.value.name).toBe('John')
    expect(state.value.age).toBe(25)
  })

  test('two-way reactivity with multiple variables', async () => {
    const { getByRole, state, searchQuery } = withSetup(() => {
      const schema = z.object({
        name: z.string().min(1),
      })
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

    const { getByRole, state } = withSetup(() => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18),
      })

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

  test('initializes with provided initial errors', async () => {
    const initialErrors = [
      {
        path: ['name'],
        message: 'Name is required',
      },
    ]

    const { errors, isValid } = withSetup(() => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18),
      })

      return useForm({
        schema,
        initialErrors,
      })
    }).render('<div></div>')

    expect(errors.value).toEqual(initialErrors)
    expect(isValid.value).toBe(false)
  })
})
