import { describe, expect, test } from 'vitest'
import { NotField, NotForm, NotArrayField, NotMessage, useNotForm } from '../../src'
import { notRules, withSetup } from '../utils'

describe('Array Field - Core', () => {
  const schema = notRules.object({
    users: notRules.array(notRules.object({
      name: notRules.string(1),
      age: notRules.number(18),
    })),
  })

  function setupForm() {
    const rendered = withSetup(() => {
      const form = useNotForm({
        schema,
        initialState: {
          users: [
            { name: 'John', age: 25 },
          ],
        },
      })

      return { form, schema }
    }).render(`
      <NotForm :id="form.id">
        <NotArrayField name="users" :schema="schema.shape.users.itemSchema" v-slot="{ fields, append, prepend, remove, insert, update }">
          <div v-for="(field, index) in fields" :key="field.key">
            <NotField :name="'users.' + index + '.name'" v-slot="{ methods, name }">
              <label :for="name">
                Name {{ index }}
                <input type="text" v-model="form.state.value.users[index].name" v-bind="methods" :name="name" :id="name"/>
              </label>
              <NotMessage :name="name" v-slot="{ message }">
                <span role="alert" :title="'name-error-' + index">{{ message }}</span>
              </NotMessage>
            </NotField>

            <NotField :name="'users.' + index + '.age'" v-slot="{ methods, name }">
              <label :for="name">
                Age {{ index }}
                <input type="number" v-model.number="form.state.value.users[index].age" v-bind="methods" :name="name" :id="name"/>
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

    return rendered
  }

  test('Initial state', () => {
    const { form } = setupForm()

    expect(form.state.value.users).toHaveLength(1)
    expect(form.state.value.users[0]).toEqual({ name: 'John', age: 25 })
  })

  test('Append', async () => {
    const { getByRole, form } = setupForm()
      
    const appendBtn = getByRole('button', { name: 'Append' })
    await appendBtn.click()
    
    expect(form.state.value.users).toHaveLength(2)
    expect(form.state.value.users[0]).toEqual({ name: 'John', age: 25 })
    expect(form.state.value.users[1]).toEqual({ name: '', age: 0 })
  })

  test('Prepend', async () => {
    const { getByRole, form } = setupForm()

    const prependBtn = getByRole('button', { name: 'Prepend' })
    await prependBtn.click()
    
    expect(form.state.value.users).toHaveLength(2)
    expect(form.state.value.users[0]).toEqual({ name: 'First', age: 22 })
    expect(form.state.value.users[1]).toEqual({ name: 'John', age: 25 })
  })

  test('Remove', async () => {
    const { getByRole, form } = setupForm()

    // Start with initial state: [{ name: 'John', age: 25 }]
    const removeBtn0 = getByRole('button', { name: 'Remove 0' })
    await removeBtn0.click()
    
    expect(form.state.value.users).toHaveLength(0)
  })

  test('Update', async () => {
    const { getByRole, form } = setupForm()

    // Start with initial state: [{ name: 'John', age: 25 }]
    const updateBtn0 = getByRole('button', { name: 'Update 0' })
    await updateBtn0.click()
    
    expect(form.state.value.users).toHaveLength(1)
    expect(form.state.value.users[0]).toEqual({ name: 'Updated', age: 30 })
  })

  test('Insert', async () => {
    const { getByRole, form } = setupForm()

    // Start with initial state: [{ name: 'John', age: 25 }]
    const insertBtn0 = getByRole('button', { name: 'Insert 0' })
    await insertBtn0.click()
    
    expect(form.state.value.users).toHaveLength(2)
    expect(form.state.value.users[0]).toEqual({ name: 'Inserted', age: 20 })
    expect(form.state.value.users[1]).toEqual({ name: 'John', age: 25 })
  })

  test('Multiple operations in sequence', async () => {
    const { getByRole, form } = setupForm()

    // Append
    const appendBtn = getByRole('button', { name: 'Append' })
    await appendBtn.click()
    expect(form.state.value.users).toHaveLength(2)

    // Prepend
    const prependBtn = getByRole('button', { name: 'Prepend' })
    await prependBtn.click()
    expect(form.state.value.users).toHaveLength(3)
    expect(form.state.value.users[0]).toEqual({ name: 'First', age: 22 })
    expect(form.state.value.users[1]).toEqual({ name: 'John', age: 25 })
    expect(form.state.value.users[2]).toEqual({ name: '', age: 0 })

    // Update index 1
    const updateBtn1 = getByRole('button', { name: 'Update 1' })
    await updateBtn1.click()
    expect(form.state.value.users[1]).toEqual({ name: 'Updated', age: 30 })

    // Remove index 1
    const removeBtn1 = getByRole('button', { name: 'Remove 1' })
    await removeBtn1.click()
    expect(form.state.value.users).toHaveLength(2)
    expect(form.state.value.users[0]).toEqual({ name: 'First', age: 22 })
    expect(form.state.value.users[1]).toEqual({ name: '', age: 0 })

    // Insert at index 0
    const insertBtn0 = getByRole('button', { name: 'Insert 0' })
    await insertBtn0.click()
    expect(form.state.value.users).toHaveLength(3)
    expect(form.state.value.users[0]).toEqual({ name: 'Inserted', age: 20 })
    expect(form.state.value.users[1]).toEqual({ name: 'First', age: 22 })
    expect(form.state.value.users[2]).toEqual({ name: '', age: 0 })
  })

  test('Validation', async () => {
    const { getByRole } = setupForm()

    const nameInput0 = getByRole('textbox', { name: 'Name 0' })
    const ageInput0 = getByRole('spinbutton', { name: 'Age 0' })

    // Simulate blur by clicking outside the input0
    await nameInput0.fill('')
    await ageInput0.click()

    const nameError0 = getByRole('alert', { name: 'name-error-0' })
    await expect.element(nameError0).toHaveTextContent('Must be at least 1 characters')

    // Simulate blur by clicking outside the input0
    await ageInput0.fill('15')
    await nameInput0.click()

    const ageError0 = getByRole('alert', { name: 'age-error-0' })
    await expect.element(ageError0).toHaveTextContent('Must be at least 18')
  })

  test('Touch behavior', async () => {
    const { getByRole, form } = setupForm()
    
    // Add another user first so index 1 exists
    const appendBtn = getByRole('button', { name: 'Append' })
    await appendBtn.click()
    
    const nameInput1 = getByRole('textbox', { name: 'Name 1' })
    const ageInput1 = getByRole('spinbutton', { name: 'Age 1' })

    await nameInput1.click()
    await ageInput1.click()

    expect(form.touchedFields.value.has('users.1.name')).toBeTruthy()
  })
})
