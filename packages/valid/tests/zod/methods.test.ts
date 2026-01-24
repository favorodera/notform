import { describe, expect, test } from 'vitest'
import { withSetup } from '../utils'
import { Field, Form, Message, useForm } from '../../src'
import { z } from 'zod'
import { ref } from 'vue'

describe('Methods - Zod', () => {

  test('Methods and states returned by useForm', async () => {
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
      isValidating,
      validate,
      validateField,
      touchAllFields,
      touchField,
      touchedFields,
      errors,
      clearErrors,
      initialErrors,
      initialState,
      schema,
      mode,
      validateOn,
    } = withSetup(() => {
      const { state,
        id,
        isValid,
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
        isValidating,
        validate,
        validateField,
        touchAllFields,
        touchField,
        touchedFields,
        errors,
        clearErrors,
        initialErrors,
        initialState,
        schema,
        mode,
        validateOn,
      } = useForm({
        id: 'form',
        schema: z.object({
          name: z.string().min(1),
          age: z.number().max(120),
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
      
      return {
        state,
        id,
        isValid,
        getFieldErrors,
        setErrors,
        setState,
        reset,
        submit,
        dirtyAllFields,
        errors,
        clearErrors,
        initialErrors,
        initialState,
        schema,
        mode,
        validateOn,
        dirtyField,
        dirtyFields,
        isDirty,
        isTouched,
        isValidating,
        validate,
        validateField,
        touchAllFields,
        touchField,
        touchedFields,
      }
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

    // Check for static and initial states
    expect(id).toBe('form')

    type InferredType = z.infer<typeof schema.value>
    // Type assertion test (checked at compile time, but verifying structure here)
    const inferred: InferredType = { name: 'John', age: 25 }
    expect(inferred.name).toBeTypeOf('string')
    expect(inferred.age).toBeTypeOf('number')

    // Test that schema can run validation on its own
    const { success } = await schema.value.safeParseAsync(state)
    expect(success).toBeFalsy()
    
    expect(initialState).toEqual({
      name: 'John',
      age: 25,
    })
    expect(initialErrors).toEqual([])
    expect(errors.value).toEqual([])
    expect(isValid.value).toBeTruthy()
    expect(isTouched.value).toBeFalsy()
    expect(isValidating.value).toBeFalsy()
    expect(isDirty.value).toBeFalsy()
    expect(isTouched.value).toBeFalsy()
    expect(dirtyFields.value).toEqual(new Set())
    expect(touchedFields.value).toEqual(new Set())
    expect(mode).toBe('eager')
    expect(validateOn).toContain('change')
    expect(validateOn).toContain('input')
    expect(validateOn).toContain('blur')
    expect(onValidateDisplay.value).toBeUndefined()
    expect(onErrorDisplay.value).toBeUndefined()

    await expect.element(nameInput).toHaveValue('John')
    await expect.element(nameInput).toHaveDisplayValue('John')
    
    await expect.element(ageInput).toHaveValue(25)
    await expect.element(ageInput).toHaveDisplayValue(25)

    // Check state related methods and states
    setState({ name: 'Jane', age: 30 }, false)
    expect(state.value).toEqual({ name: 'Jane', age: 30 })
    expect(isDirty.value).toBeTruthy()
    expect(isTouched.value).toBeTruthy()
    expect(dirtyFields.value.has('name')).toBeTruthy()
    expect(dirtyFields.value.has('age')).toBeTruthy()
    expect(touchedFields.value.has('name')).toBeTruthy()
    expect(touchedFields.value.has('age')).toBeTruthy()

    await expect.element(nameInput).toHaveValue('Jane')
    await expect.element(nameInput).toHaveDisplayValue('Jane')
    
    await expect.element(ageInput).toHaveValue(30)
    await expect.element(ageInput).toHaveDisplayValue(30)

    // Check validation triggers with invalid data
    setState({ name: '', age: 150 })
    expect(state.value).toEqual({ name: '', age: 150 })

    // Call validate because validation of setState is soft validation(not awaited)
    await validate()

    expect(isValid.value).toBeFalsy()
    expect(isDirty.value).toBeTruthy()
    expect(isTouched.value).toBeTruthy()
    expect(dirtyFields.value.has('name')).toBeTruthy()
    expect(dirtyFields.value.has('age')).toBeTruthy()
    expect(touchedFields.value.has('name')).toBeTruthy()
    expect(touchedFields.value.has('age')).toBeTruthy()
    expect(errors.value.length).toBeGreaterThan(0)
    expect(getFieldErrors('name').length).toBeGreaterThan(0)
    expect(getFieldErrors('age').length).toBeGreaterThan(0)
    await expect.element(nameMessage).not.toBeEmptyDOMElement()
    await expect.element(ageMessage).not.toBeEmptyDOMElement()

    // Reset
    reset()
    expect(initialErrors).toEqual([])
    expect(errors.value).toEqual([])
    expect(isValid.value).toBeTruthy()
    expect(isTouched.value).toBeFalsy()
    expect(isValidating.value).toBeFalsy()
    expect(isDirty.value).toBeFalsy()
    expect(isTouched.value).toBeFalsy()
    expect(dirtyFields.value).toEqual(new Set())
    expect(touchedFields.value).toEqual(new Set())

    await expect.element(nameInput).toHaveValue('John')
    await expect.element(nameInput).toHaveDisplayValue('John')
    
    await expect.element(ageInput).toHaveValue(25)
    await expect.element(ageInput).toHaveDisplayValue(25)
    

    // Test error methods
    setErrors([
      {
        path: ['name'],
        message: 'Name is required',
      },
      {
        path: ['age'],
        message: 'Age is required',
      },
    ])

    expect(errors.value.length).toBe(2)
    expect(errors.value).toEqual([
      {
        path: ['name'],
        message: 'Name is required',
      },
      {
        path: ['age'],
        message: 'Age is required',
      },
    ])

    expect(getFieldErrors('name')[0].message).toBe('Name is required')
    expect(getFieldErrors('age')[0].message).toBe('Age is required')

    await expect.element(nameMessage).toHaveTextContent('Name is required')
    await expect.element(ageMessage).toHaveTextContent('Age is required')

    // Clear errors
    clearErrors()
    expect(errors.value).toEqual([])
    expect(getFieldErrors('name')).toEqual([])
    expect(getFieldErrors('age')).toEqual([])
    await expect.element(nameMessage).toBeEmptyDOMElement()
    await expect.element(ageMessage).toBeEmptyDOMElement()
    

    // Reset(with optional state) for testing for dirty and touch methods and states
    reset({ name: 'Ada', age: 40 })
    expect(state.value).toEqual({ name: 'Ada', age: 40 })
 
    await expect.element(nameInput).toHaveValue('Ada')
    await expect.element(nameInput).toHaveDisplayValue('Ada')
    
    await expect.element(ageInput).toHaveValue(40)
    await expect.element(ageInput).toHaveDisplayValue(40)

    expect(initialErrors).toEqual([])
    expect(errors.value).toEqual([])
    expect(isValid.value).toBeTruthy()
    expect(isTouched.value).toBeFalsy()
    expect(isValidating.value).toBeFalsy()
    expect(isDirty.value).toBeFalsy()
    expect(isTouched.value).toBeFalsy()
    expect(dirtyFields.value).toEqual(new Set())
    expect(touchedFields.value).toEqual(new Set())

    // Dirty and touch fields
    await nameInput.fill('Favour') // By input

    // Simulate touch for name input by clicking on it and leaving
    await nameInput.click()
    await ageInput.click()

    dirtyField('age') // Programmatically
    touchField('age') // Programmatically

    expect(dirtyFields.value.has('name')).toBeTruthy()
    expect(dirtyFields.value.has('age')).toBeTruthy()

    expect(touchedFields.value.has('name')).toBeTruthy()
    expect(touchedFields.value.has('age')).toBeTruthy()

    expect(isDirty.value).toBeTruthy()
    expect(isTouched.value).toBeTruthy()

    // Reset to test dirtyAllFields and touchAllFields methods
    reset() // Reset to initial state

    expect(dirtyFields.value).toEqual(new Set())
    expect(touchedFields.value).toEqual(new Set())
    expect(isDirty.value).toBeFalsy()
    expect(isTouched.value).toBeFalsy()

    // Test dirtyAllFields and touchAllFields methods
    dirtyAllFields()
    touchAllFields()

    expect(dirtyFields.value).toEqual(new Set(['name', 'age']))
    expect(touchedFields.value).toEqual(new Set(['name', 'age']))
    expect(isDirty.value).toBeTruthy()
    expect(isTouched.value).toBeTruthy()

    // Reset to test validation and submission
    reset()

    // Test validation, reset and submission
    await validate()

    expect(isValid.value).toBeTruthy()
    expect(errors.value.length).toBe(0)
    expect(getFieldErrors('name').length).toBe(0)
    expect(getFieldErrors('age').length).toBe(0)
    await expect.element(nameMessage).toBeEmptyDOMElement()
    await expect.element(ageMessage).toBeEmptyDOMElement()
    

    // Reset to test submission
    reset({ name: 'John', age: 500 })
    expect(state.value).toEqual({ name: 'John', age: 500 })

    const result = await validateField('age') // Test field validation
    expect(result.issues).toBeDefined()
    expect(result.issues).toHaveLength(1)

    reset({ name: 'John', age: 500 })

    expect(onResetDisplay.value).toBeTruthy()

    // Test submission
    await submit() // Should fail because of age
    expect(isValid.value).toBeFalsy()
    expect(errors.value.length).toBeGreaterThan(0)

    expect(getFieldErrors('name').length).toBe(0)
    expect(getFieldErrors('age').length).toBeGreaterThan(0)

    await expect.element(nameMessage).toBeEmptyDOMElement()
    await expect.element(ageMessage).not.toBeEmptyDOMElement()

    // Test submission on form
    await submitButton.click()
    expect(isValid.value).toBeFalsy()
    expect(errors.value.length).toBeGreaterThan(0)

    expect(getFieldErrors('name').length).toBe(0)
    expect(getFieldErrors('age').length).toBeGreaterThan(0)

    await expect.element(nameMessage).toBeEmptyDOMElement()
    await expect.element(ageMessage).not.toBeEmptyDOMElement()

    // Test reset on form
    await resetButton.click()
    expect(state.value).toEqual({ name: 'John', age: 500 })
    expect(isDirty.value).toBeFalsy()
    expect(isTouched.value).toBeFalsy()
    expect(dirtyFields.value).toEqual(new Set())
    expect(touchedFields.value).toEqual(new Set())

  })

})
