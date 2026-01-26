import { describe, expect, test } from 'vitest'
import * as yup from 'yup'
import { NotField, NotForm, NotArrayField, NotMessage, useNotForm } from '../../src'
import { withSetup } from '../utils'

describe('Array Field - Yup', () => {

  test('Manages array items correctly', async () => {
    const { state, getByRole, touchedFields } = withSetup(() => {
      const schema = yup.object({
        users: yup.array(yup.object({
          name: yup.string().required('Name is required'),
          age: yup.number().required().min(18, 'Must be at least 18'),
        })).min(1, 'At least one user is required'),
      })

      const { state, id, getFieldErrors, touchedFields } = useNotForm({
        schema,
        initialState: {
          users: [
            { name: 'John', age: 25 },
          ],
        },
      })

      return { state, id, getFieldErrors, touchedFields, schema }
    }).render(`
      <NotForm :id="id">
        <NotArrayField name="users" :schema="schema.fields.users" v-slot="{ fields, append, prepend, remove, insert, update }">
          <div v-for="(field, index) in fields" :key="field.key">
            <NotField :name="'users.' + index + '.name'" v-slot="{ methods, name }">
              <label :for="name">
                Name {{ index }}
                <input type="text" v-model="state.users[index].name" v-bind="methods" :name="name" :id="name"/>
              </label>
              <NotMessage :name="name" v-slot="{ message }">
                <span role="alert" :title="'name-error-' + index">{{ message }}</span>
              </NotMessage>
            </NotField>

            <NotField :name="'users.' + index + '.age'" v-slot="{ methods, name }">
              <label :for="name">
                Age {{ index }}
                <input type="number" v-model.number="state.users[index].age" v-bind="methods" :name="name" :id="name"/>
              </label>
              <NotMessage :name="name" v-slot="{ message }">
                <span role="alert" :title="'age-error-' + index">{{ message }}</span>
              </NotMessage>
            </NotField>

            <button type="button" @click="remove(index)">Remove {{ index }}</button>
            <button type="button" @click="update(index, { name: 'Updated', age: 30 })">Update {{ index }}</button>
            <button type="button" @click="insert(index, { name: 'Inserted', age: 20 })">Insert {{ index }}</button>
          </div>

          <button type="button" @click="append({ name: '', age: 0 })">Append</button>
          <button type="button" @click="prepend({ name: 'First', age: 22 })">Prepend</button>
        </NotArrayField>
      </NotForm>
    `, { NotForm, NotField, NotArrayField, NotMessage })

    // Initial state
    expect(state.value.users).toHaveLength(1)
    expect(state.value.users[0]).toEqual({ name: 'John', age: 25 })

    // Test Append
    const appendBtn = getByRole('button', { name: 'Append' })
    await appendBtn.click()
    expect(state.value.users).toHaveLength(2)
    expect(state.value.users[1]).toEqual({ name: '', age: 0 })

    // Test Prepend
    const prependBtn = getByRole('button', { name: 'Prepend' })
    await prependBtn.click()
    expect(state.value.users).toHaveLength(3)
    expect(state.value.users[0]).toEqual({ name: 'First', age: 22 })
    expect(state.value.users[1]).toEqual({ name: 'John', age: 25 })
    expect(state.value.users[2]).toEqual({ name: '', age: 0 })

    // Test Remove
    const removeBtn1 = getByRole('button', { name: 'Remove 1' }) // Removes 'John' at index 1
    await removeBtn1.click()
    expect(state.value.users).toHaveLength(2)
    expect(state.value.users[0]).toEqual({ name: 'First', age: 22 })
    expect(state.value.users[1]).toEqual({ name: '', age: 0 })

    // Test Update
    const updateBtn1 = getByRole('button', { name: 'Update 1' }) // Updates user at index 1
    await updateBtn1.click()
    expect(state.value.users[1]).toEqual({ name: 'Updated', age: 30 })

    // Test Insert
    const insertBtn0 = getByRole('button', { name: 'Insert 0' }) // Inserts at index 0
    await insertBtn0.click()
    expect(state.value.users).toHaveLength(3)
    expect(state.value.users[0]).toEqual({ name: 'Inserted', age: 20 })
    expect(state.value.users[1]).toEqual({ name: 'First', age: 22 })
    expect(state.value.users[2]).toEqual({ name: 'Updated', age: 30 })

    // Test Validation (fill triggers blur/change)
    const nameInput0 = getByRole('textbox', { name: 'Name 0' })
    await nameInput0.fill('')

    // Message title is used for finding the alert (following user pattern)
    const nameError0 = getByRole('alert', { name: 'name-error-0' })
    await expect.element(nameError0).toHaveTextContent('Name is required')

    const ageInput0 = getByRole('spinbutton', { name: 'Age 0' })
    await ageInput0.fill('15')

    const ageError0 = getByRole('alert', { name: 'age-error-0' })
    await expect.element(ageError0).toHaveTextContent('Must be at least 18')

    // Test Touch behavior (click then click another)
    const nameInput1 = getByRole('textbox', { name: 'Name 1' })
    const ageInput1 = getByRole('spinbutton', { name: 'Age 1' })

    await nameInput1.click()
    await ageInput1.click() // Leaving name input triggers touch

    expect(touchedFields.value.has('users.1.name')).toBeTruthy()
  })
})
