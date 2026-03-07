import { describe, expect, test } from 'vitest'
import { NotForm, NotArrayField, useNotForm } from '../../src'
import { notRules, withSetup } from '../utils'

describe('NotArrayField name and errors', () => {
  const schema = notRules.object({
    users: notRules.array(notRules.object({
      name: notRules.string(1),
      age: notRules.number(18),
    })),
  })

  test('name exposes correct field path', async () => {
    const { getByTitle } = withSetup(() => {
      const form = useNotForm({
        schema,
      })
      return { form, schema }
    }).render(`
      <NotForm :id="form.id">
        <NotArrayField name="users" :schema="schema.shape.users.itemSchema" v-slot="{ name }">
          <span :title="name">{{ name }}</span>
        </NotArrayField>
      </NotForm>
    `, { NotForm, NotArrayField })

    const nameSpan = getByTitle('users')
    await expect.element(nameSpan).toBeTruthy()
  })

  test('errors is empty when array is valid', async () => {
    const { getByTitle } = withSetup(() => {
      const form = useNotForm({
        schema,
        initialState: { users: [{ name: 'John', age: 25 }] },
      })
      return { form, schema }
    }).render(`
      <NotForm :id="form.id">
        <NotArrayField name="users" :schema="schema.shape.users.itemSchema" v-slot="{ errors }">
          <span title="error-count">{{ errors.length }}</span>
        </NotArrayField>
      </NotForm>
    `, { NotForm, NotArrayField })

    const errorCountSpan = getByTitle('error-count')
    await expect.element(errorCountSpan).toHaveTextContent('0')
  })

  test('errors exposes array-level errors', async () => {
    const { getByRole, form } = withSetup(() => {
      const form = useNotForm({
        schema,
        // Use non array value to trigger array-level errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialState: { users: null as any },
      })
      return { form, schema }
    }).render(`
      <NotForm :id="form.id">
        <NotArrayField name="users" :schema="schema.shape.users.itemSchema" v-slot="{ errors }">
          <span v-for="(error, index) in errors" :key="index" role="alert" :title="'array-error-' + index">{{ error }}</span>
        </NotArrayField>
      </NotForm>
    `, { NotForm, NotArrayField })

    await form.validate()

    const error = getByRole('alert', { name: 'array-error-0' })
    await expect.element(error).toHaveTextContent('Must be an array')
  })
})
