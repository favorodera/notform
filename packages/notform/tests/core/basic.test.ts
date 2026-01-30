import { describe, expect, test } from 'vitest'
import { NotField, NotForm, NotMessage, useNotForm } from '../../src'
import { notRules, withSetup } from '../utils'

describe('Basic Form Test', () => {
  const schema = notRules.object({
    name: notRules.string(1),
    age: notRules.number(18),
  })

  function setupForm() {
    const rendered = withSetup(() => {
      const { state, getFieldErrors, id } = useNotForm({
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
      return { state, getFieldErrors, id }
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


    const nameInput = rendered.getByRole('textbox', { name: 'name' })
    const ageInput = rendered.getByRole('spinbutton', { name: 'age' })
    const ageMessage = rendered.getByRole('alert', { name: 'age-message' })

    return {
      ...rendered,
      nameInput,
      ageInput,
      ageMessage,
    }
  }

  test('State', async () => {
    const { state, nameInput, ageInput } = setupForm()

    expect(state.value).toEqual({
      name: 'John',
      age: 15,
    })
    await expect.element(nameInput).toHaveValue('John')
    await expect.element(ageInput).toHaveValue(15)
  })

  test('Errors', async () => {
    const { getFieldErrors, ageMessage } = setupForm()

    expect(getFieldErrors('age')).toEqual([{
      path: ['age'],
      message: 'Not up to 18',
    }])
    await expect.element(ageMessage).toHaveTextContent('Not up to 18')
  })
})
