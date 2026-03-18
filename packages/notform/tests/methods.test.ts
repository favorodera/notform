import { describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'
import { NotField, NotForm, NotMessage, useNotForm } from '../src'
import { notRules, withSetup } from './utils'

describe('Methods - Core', () => {
  const schema = notRules.object({
    name: notRules.string(1),
    age: notRules.number(0, 120),
  })

  function setupForm() {
    const onValidateDisplay = ref()
    const onErrorDisplay = ref()
    const onResetDisplay = ref()
    const onSubmitDisplay = ref()

    const rendered = withSetup(() => {
      const form = useNotForm({
        id: 'form',
        schema,
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
        onSubmit(data) {
          onSubmitDisplay.value = data
        },
      })

      return { ...form }
    }).render(`
      <NotForm :id="id" @submit.prevent="submit" @reset="reset({ name: 'John', age: 500 })">
        <NotField name="name" v-slot="{ methods, name }">
          <label :for="name">
            Name
            <input type="text" v-model="state.name" v-bind="methods" :name="name" :id="name"/>
          </label>
          <NotMessage :name="name" v-slot="{message}">
            <span role="alert" title="name-message">{{ message }}</span>
          </NotMessage>
        </NotField>

        <NotField name="age" v-slot="{ methods, name }">
          <label :for="name">
            Age
            <input type="number" v-model.number="state.age" v-bind="methods" :name="name" :id="name"/>
          </label>
          <NotMessage :name="name" v-slot="{message}">
            <span role="alert" title="age-message">{{ message }}</span>
          </NotMessage>
        </NotField>

        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </NotForm>
    `, { NotForm, NotField, NotMessage })

    return {
      ...rendered,
      onValidateDisplay,
      onErrorDisplay,
      onResetDisplay,
      onSubmitDisplay,
      nameInput: rendered.getByRole('textbox', { name: 'name' }),
      ageInput: rendered.getByRole('spinbutton', { name: 'age' }),
      submitButton: rendered.getByRole('button', { name: 'Submit' }),
      resetButton: rendered.getByRole('button', { name: 'Reset' }),
      ageMessage: rendered.getByRole('alert', { name: 'age-message' }),
      nameMessage: rendered.getByRole('alert', { name: 'name-message' }),
    }
  }

  test('Initial State', async () => {
    const { id, initialState, isDirty, mode } = setupForm()
    expect(id).toBe('form')
    expect(initialState).toEqual({ name: 'John', age: 25 })
    expect(isDirty.value).toBeFalsy()
    expect(mode).toBe('eager')
  })

  test('setState and Validation', async () => {
    const { setState, validate, isValid, getFieldErrors, nameMessage, ageMessage } = setupForm()

    setState({ name: '', age: 150 })
    await validate()

    expect(isValid.value).toBeFalsy()
    expect(getFieldErrors('name').length).toBeGreaterThan(0)
    expect(getFieldErrors('age').length).toBeGreaterThan(0)
    await expect.element(nameMessage).not.toBeEmptyDOMElement()
    await expect.element(ageMessage).not.toBeEmptyDOMElement()
  })

  test('setErrors and clearErrors', async () => {
    const { clearErrors, errors, setErrors, getFieldErrors, nameMessage } = setupForm()

    clearErrors()
    expect(errors.value).toEqual([])

    setErrors([{ path: ['name'], message: 'Custom error' }])
    expect(getFieldErrors('name')[0].message).toBe('Custom error')
    await expect.element(nameMessage).toHaveTextContent('Custom error')
  })

  test('Dirty and Touch (UI Interaction)', async () => {
    const { nameInput, ageInput, dirtyFields, touchedFields } = setupForm()

    await nameInput.fill('Jane')
    await nameInput.click()
    await ageInput.click()

    expect(dirtyFields.value.has('name')).toBeTruthy()
    expect(touchedFields.value.has('name')).toBeTruthy()
  })

  test('Programmatic Dirty/Touch', async () => {
    const { state, dirtyField, touchField, isDirty, isTouched } = setupForm()

    state.value.age = 30
    dirtyField('age')
    touchField('age')

    expect(isDirty.value).toBeTruthy()
    expect(isTouched.value).toBeTruthy()
  })

  test('Bulk methods', async () => {
    const { state, reset, dirtyAllFields, touchAllFields, dirtyFields, touchedFields } = setupForm()

    reset()
    state.value.name = 'Peter'
    state.value.age = 40
    dirtyAllFields()
    touchAllFields()

    expect(dirtyFields.value.size).toBe(2)
    expect(touchedFields.value.size).toBe(2)
  })

  test('validateField', async () => {
    const { reset, validateField } = setupForm()

    reset({ name: 'John', age: 500 })
    const result = await validateField('age')
    expect(result.issues).toHaveLength(1)
  })

  test('Submission failure', async () => {
    const { setState, submit, onErrorDisplay, onValidateDisplay, onSubmitDisplay } = setupForm()

    setState({ name: 'John', age: 500 })
    await submit(new Event('submit'))

    expect(onErrorDisplay.value).toBeDefined()
    expect(onValidateDisplay.value).toBeUndefined()
    expect(onSubmitDisplay.value).toBeUndefined()
  })

  test('Submission success', async () => {
    const { submit, onErrorDisplay, onValidateDisplay, onSubmitDisplay } = setupForm()

    await submit(new Event('submit'))

    expect(onErrorDisplay.value).toBeUndefined()
    expect(onValidateDisplay.value).toEqual({ name: 'John', age: 25 })
    expect(onSubmitDisplay.value).toEqual({ name: 'John', age: 25 })
  })

  test('UI Submit and Reset', async () => {
    const { setState, submitButton, onValidateDisplay, onSubmitDisplay, resetButton, state, onResetDisplay } = setupForm()

    setState({ name: 'Valid', age: 30 })
    await submitButton.click()

    expect(onValidateDisplay.value).toEqual({ name: 'Valid', age: 30 })
    expect(onSubmitDisplay.value).toEqual({ name: 'Valid', age: 30 })

    await resetButton.click()
    expect(state.value).toEqual({ name: 'John', age: 500 })
    expect(onResetDisplay.value).toBeTruthy()
  })

  describe('Form Submission State', () => {
    const schema = notRules.object({
      name: notRules.string(1),
    })
  
    function setupForm() {
      const rendered = withSetup(() => {
        const { state, id, submit, isSubmitting } = useNotForm({
          schema,
          initialState: { name: 'John' },
          async onSubmit() {
            // Imitate a 5 seconds promise
            await new Promise(resolve => setTimeout(resolve, 5000))
          },
        })
        return { state, id, submit, isSubmitting }
      }).render(`
        <NotForm :id="id" @submit="submit">
          <NotField name="name" v-slot="{ methods, name }">
            <input type="text" v-model="state.name" v-bind="methods" :name="name" :disabled="isSubmitting" />
          </NotField>
  
          <button type="submit" :disabled="isSubmitting">Submit</button>
        </NotForm>
      `, { NotForm, NotField })
      
      const submitButton = rendered.getByRole('button', { name: 'Submit' })
  
      return {
        ...rendered,
        submitButton,
      }
      
    }
  
    test('Is false by default', async () => {
      const { isSubmitting, submitButton } = setupForm()
      
      expect(isSubmitting.value).toBeFalsy()
      await expect.element(submitButton).not.toBeDisabled()
    })
  
    test('Is true on submit and false on post-submit', async () => {
      vi.useFakeTimers()
      const { isSubmitting, submitButton } = setupForm()
    
      await submitButton.click()
    
      await vi.waitFor(() => {
        expect(isSubmitting.value).toBeTruthy()
      })
    
      await expect.element(submitButton).toBeDisabled()
    
      await vi.advanceTimersByTimeAsync(5000)
    
      await vi.waitFor(() => {
        expect(isSubmitting.value).toBeFalsy()
      })
  
      await expect.element(submitButton).not.toBeDisabled()
  
      vi.useRealTimers()
    })
  })
})
