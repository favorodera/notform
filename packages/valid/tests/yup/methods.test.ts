import { describe, expect, test } from 'vitest'
import { withSetup } from '../utils'
import { Field, Form, Message, useForm } from '../../src'
import * as yup from 'yup'
import { ref } from 'vue'

describe('Methods - Yup', () => {

  test('Form methods and state lifecycle', async () => {
    const onValidateDisplay = ref()
    const onErrorDisplay = ref()
    const onResetDisplay = ref()

    const {
      getByRole,
      id,
      isValid,
      state,
      getFieldErrors,
      setErrors,
      setState,
      reset,
      submit,
      dirtyAllFields,
      dirtyField,
      dirtyFields,
      isDirty,
      isTouched,
      validate,
      validateField,
      touchAllFields,
      touchField,
      touchedFields,
      errors,
      clearErrors,
      initialState,
      mode,
    } = withSetup(() => {
      const form = useForm({
        id: 'form',
        schema: yup.object({
          name: yup.string().required(),
          age: yup.number().max(120),
        }),
        initialState: {
          name: 'John',
          age: 25,
        },
        onValidate: (data) => {
          onValidateDisplay.value = data
        },
        onError(errors) {
          onErrorDisplay.value = errors
        },
        onReset() {
          onResetDisplay.value = true
        },
      })

      return { ...form }
    }).render(`
      <Form :id="id" @submit.prevent="submit" @reset="reset({ name: 'John', age: 500 })">
        <Field name="name" v-slot="{ methods, name }">
          <label :for="name">
            Name
            <input type="text" v-model="state.name" v-bind="methods" :name="name" :id="name"/>
          </label>
          <Message :name="name" v-slot="{message}">
            <span role="alert" title="name-message">{{ message }}</span>
          </Message>
        </Field>

        <Field name="age" v-slot="{ methods, name }">
          <label :for="name">
            Age
            <input type="number" v-model.number="state.age" v-bind="methods" :name="name" :id="name"/>
          </label>
          <Message :name="name" v-slot="{message}">
            <span role="alert" title="age-message">{{ message }}</span>
          </Message>
        </Field>

        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </Form>
    `, { Form, Field, Message })

    const nameInput = getByRole('textbox', { name: 'name' })
    const ageInput = getByRole('spinbutton', { name: 'age' })
    const submitButton = getByRole('button', { name: 'Submit' })
    const resetButton = getByRole('button', { name: 'Reset' })
    const ageMessage = getByRole('alert', { name: 'age-message' })
    const nameMessage = getByRole('alert', { name: 'name-message' })

    // 1. Initial State
    expect(id).toBe('form')
    expect(initialState).toEqual({ name: 'John', age: 25 })
    expect(isDirty.value).toBeFalsy()
    expect(mode).toBe('eager')

    // 2. setState and Validation
    setState({ name: '', age: 150 })
    await validate() // Ensure errors are populated
    expect(isValid.value).toBeFalsy()
    expect(getFieldErrors('name').length).toBeGreaterThan(0)
    expect(getFieldErrors('age').length).toBeGreaterThan(0)
    await expect.element(nameMessage).not.toBeEmptyDOMElement()
    await expect.element(ageMessage).not.toBeEmptyDOMElement()

    // 3. setErrors and clearErrors
    clearErrors()
    expect(errors.value).toEqual([])
    setErrors([{ path: ['name'], message: 'Custom error' }])
    expect(getFieldErrors('name')[0].message).toBe('Custom error')
    await expect.element(nameMessage).toHaveTextContent('Custom error')

    // 4. Dirty and Touch (UI Interaction)
    reset() // Back to initial
    await nameInput.fill('Jane')
    await nameInput.click()
    await ageInput.click() // Trigger blur on name
    expect(dirtyFields.value.has('name')).toBeTruthy()
    expect(touchedFields.value.has('name')).toBeTruthy()

    // 5. Programmatic Dirty/Touch
    dirtyField('age')
    touchField('age')
    expect(isDirty.value).toBeTruthy()
    expect(isTouched.value).toBeTruthy()

    // 6. Bulk methods
    reset()
    dirtyAllFields()
    touchAllFields()
    expect(dirtyFields.value.size).toBe(2)
    expect(touchedFields.value.size).toBe(2)

    // 7. validateField
    reset({ name: 'John', age: 500 })
    const result = await validateField('age')
    expect(result.issues).toHaveLength(1)

    // 8. Submission
    await submit()
    expect(onErrorDisplay.value).toBeDefined()
    expect(onValidateDisplay.value).toBeUndefined()

    // 9. UI Submit and Reset
    setState({ name: 'Valid', age: 30 })
    await submitButton.click()
    expect(onValidateDisplay.value).toEqual({ name: 'Valid', age: 30 })

    await resetButton.click()
    expect(state.value).toEqual({ name: 'John', age: 500 })
    expect(onResetDisplay.value).toBeTruthy()
  })

})
