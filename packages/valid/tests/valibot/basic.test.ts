import { describe, expect, test } from 'vitest'
import * as v from 'valibot'
import { Field, Form, Message, useForm } from '../../src'
import { withSetup } from '../utils'

describe('Basic Form - Valibot', () => {

  test('Initializes with default state and errors', async () => {
    const { state, getByRole, getFieldErrors } = withSetup(() => {
      const schema = v.object({
        name: v.pipe(v.string(), v.minLength(1)),
        age: v.pipe(v.number(), v.minValue(18)),
      })
      const { state, id, getFieldErrors } = useForm({
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
      
      <Form :id="id">
        <Field name="name" v-slot="{ methods, name }">
          <label :for="name">
            Name
            <input type="text" v-model="state.name" v-bind="methods" :name="name" :id="name"/>
          </label>
        </Field>

        <Field name="age" v-slot="{ methods, name }">
          <label :for="name">
            Age
            <input type="number" v-model.number="state.age" v-bind="methods" :name="name" :id="name"/>
          </label>
          <Message name="age" v-slot="{message}">
            <span role="alert" title="age-message">{{ message }}</span>
          </Message>
        </Field>
      </Form>
    `, { Form, Field, Message })

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
