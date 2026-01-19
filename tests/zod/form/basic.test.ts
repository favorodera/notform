import { describe, expect, test } from 'vitest'
import { z } from 'zod'
import { useForm } from '../../../src'
import { withSetup } from '../../utils'

describe('use-form-basic', () => {
  // define a simple schema for testing
  const schema = z.object({
    name: z.string().min(1),
    age: z.number().min(18),
  })

  test('initializes with default values', () => {
    // initialize form with schema only
    const { result } = withSetup(() => useForm({
      schema,
    }))

    const { state, errors, isValid, isDirty, isTouched } = result

    // check initial state is empty object
    expect(state.value).toEqual({})
    // check no errors initially
    expect(errors.value).toEqual([])
    // check valid state depends on errors (empty errors = valid)
    expect(isValid.value).toBe(true)
    // check dirty/touched status
    expect(isDirty.value).toBe(false)
    expect(isTouched.value).toBe(false)
  })

  test('initializes with provided initial state', () => {
    // define initial data
    const initialState = {
      name: 'John',
      age: 25,
    }

    // initialize form with initial state
    const { result } = withSetup(() => useForm({
      schema,
      initialState,
    }))

    const { state } = result

    // check state matches provided initial state
    expect(state.value).toEqual(initialState)
  })

  test('initializes with provided initial errors', () => {
    // define initial errors
    const initialErrors = [
      {
        path: ['name'],
        message: 'Name is required',
      },
    ]

    // initialize form with initial errors
    const { result } = withSetup(() => useForm({
      schema,
      initialErrors,
    }))

    const { errors, isValid } = result

    // check errors match provided initial errors
    expect(errors.value).toEqual(initialErrors)
    // check valid state is false due to errors
    expect(isValid.value).toBe(false)
  })

  test('updates state reactively', () => {
    // initialize form
    const { result } = withSetup(() => useForm({
      schema,
      initialState: { name: '', age: 0 },
    }))

    const { state } = result

    // update state directly (simulating v-model)
    state.value.name = 'Jane'
    state.value.age = 30

    // check state is updated
    expect(state.value.name).toBe('Jane')
    expect(state.value.age).toBe(30)
  })
})
