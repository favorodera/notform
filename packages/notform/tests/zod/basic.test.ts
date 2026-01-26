import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { NotField, NotForm, NotMessage, useNotForm } from '../../src'
import { withSetup } from '../utils'

describe('Basic Form - Zod', () => {

  test('Initializes with default state and errors', async () => {
    const { state, getByRole, getFieldErrors } = withSetup(() => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(18),
      })
      const { state, id, getFieldErrors } = useNotForm({
        schema,
        initialState: {
          name: 'John',
          age: 15,
        },
        initialErrors: [
          {
            path: ['age'],
            message: 'Not up to 18',
          },
        ],
      })
      
      return { state, id, getFieldErrors }
    }).render(`
      
      <NotForm :id="id">
        <NotField name="name" v-slot="{ methods, name }">
          <label :for="name">
            Name
            <input type="text" v-model="state.name" v-bind="methods" :name="name" :id="name"/>
          </label>
        </NotField>

        <NotField name="age" v-slot="{ methods, name }">
          <label :for="name">
            Age
            <input type="number" v-model="state.age" v-bind="methods" :name="name" :id="name"/>
          </label>
          <NotMessage name="age" v-slot="{message}">
            <span role="alert" title="age-message">{{ message }}</span>
          </NotMessage>
        </NotField>
      </NotForm>
    `, { NotForm, NotField, NotMessage })
    
    const nameInput = getByRole('textbox', { name: 'name' })

    const ageInput = getByRole('spinbutton', { name: 'age' })
    const ageMessage = getByRole('alert', { name: 'age-message' })

    expect(state.value).toEqual({
      name: 'John',
      age: 15,
    })

    await expect.element(nameInput).toHaveValue('John')
    await expect.element(ageInput).toHaveValue(15)
    await expect.element(ageMessage).toHaveTextContent('Not up to 18')

    expect(getFieldErrors('age')).toEqual([{
      path: ['age'],
      message: 'Not up to 18',
    }])
  })
})
