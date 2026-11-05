import type { StandardSchemaV1 } from '@standard-schema/spec'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { object, props, string } from '../../schemas'
import { createForm } from '../../src/factories/create-form'

/**
 * These tests pin down the engine's side of the Standard Schema contract.
 * Every vendor (Zod, Valibot, ArkType, ...) speaks the same spec, so instead of testing
 * vendors one by one, a scripted schema returns exactly what the spec allows and the
 * tests check that the engine copes with every shape.
 */

type Person = { name: string }
type Result = StandardSchemaV1.Result<Values>
type Script = (value: Values) => Promise<Result> | Result
type Values = { email: string, name: string, people: Person[] }

const initialValues: Values = {
  email: 'jane@example.com',
  name: 'Jane',
  people: [{ name: 'Ada' }, { name: 'Bea' }, { name: 'Cal' }],
}

function fail(reason: unknown): never {
  throw reason
}

function messages(issues: readonly { message: string }[]): string[] {
  return issues.map((issue) => {
    return issue.message
  })
}

/**
 * A schema whose answers the test scripts, so it controls exactly what issues look like.
 * @param script Called with the value being validated; returns the result.
 * @returns A Standard Schema.
 */
function scriptedSchema(script: Script): StandardSchemaV1<Values> {
  return {
    '~standard': {
      validate: (value) => {
        return script(value as Values)
      },
      ...props,
    },
  }
}

const validResult = (): Result => {
  return { value: initialValues }
}

describe('issue paths: wrapped segments and index flavours', () => {
  it('finds a field error when the issue path uses { key } wrappers', async () => {
    const form = createForm({
      initialValues,
      schema: scriptedSchema(() => {
        return { issues: [{ message: 'Bad name', path: [{ key: 'name' }] }] }
      }),
    })
    const field = form.field('name')
    const result = await field.validate()

    expect(result.issues).toStrictEqual([{ message: 'Bad name', path: [{ key: 'name' }] }])
    expect(field.errors).toHaveLength(1)
    expect(field.isValid).toBe(false)
    expect(form.field('email').errors).toHaveLength(0)
  })

  const indexVariants: [string, StandardSchemaV1.Issue['path']][] = [
    ['number', ['people', 1, 'name']],
    ['numeric string', ['people', '1', 'name']],
    ['wrapped keys', [{ key: 'people' }, { key: 1 }, { key: 'name' }]],
    ['wrapped numeric string', ['people', { key: '1' }, 'name']],
  ]

  it.for(indexVariants)('resolves a %s array index to the right item', async ([_label, path]) => {
    const form = createForm({
      initialValues,
      schema: scriptedSchema(() => {
        return { issues: [{ message: 'Bad item', path }] }
      }),
    })
    const people = form.arrayField('people')

    await form.validate()

    expect(form.getFieldErrors('people.1.name')).toHaveLength(1)
    expect(form.getFieldErrors('people.0.name')).toHaveLength(0)
    expect(people.items.at(1)?.field('name').errors).toHaveLength(1)
    expect(people.items.at(0)?.field('name').errors).toHaveLength(0)
  })

  it('remaps wrapped and string indexes when the array is mutated, keeping the rest of the path', () => {
    const form = createForm({ initialValues, schema: scriptedSchema(validResult) })
    const people = form.arrayField('people')

    form.setError({ message: 'wrapped', path: [{ key: 'people' }, { key: 0 }, { key: 'name' }] })
    form.setError({ message: 'string', path: ['people', '2', 'name'] })

    people.move(0, 2)

    expect(messages(form.getFieldErrors('people.2.name'))).toStrictEqual(['wrapped'])
    expect(messages(form.getFieldErrors('people.1.name'))).toStrictEqual(['string'])
    expect(form.getFieldErrors('people.0.name')).toHaveLength(0)
  })
})

describe('issue scoping', () => {
  const issues: StandardSchemaV1.Issue[] = [
    { message: 'name', path: ['name'] },
    { message: 'email', path: ['email'] },
    { message: 'nested', path: ['people', 0, 'name'] },
    { message: 'form' },
  ]

  it('keeps only the issues at exactly the validated path', async () => {
    const form = createForm({
      initialValues,
      schema: scriptedSchema(() => {
        return { issues }
      }),
    })

    await form.validateField('name')

    expect(form.errors).toStrictEqual([{ message: 'name', path: ['name'] }])
  })

  it('keeps a path-less issue as a form-level error that no field shows', async () => {
    const form = createForm({
      initialValues,
      schema: scriptedSchema(() => {
        return { issues }
      }),
    })

    await form.validate()

    expect(form.errors).toHaveLength(4)
    expect(form.isValid).toBe(false)
    expect(messages(form.field('name').errors)).toStrictEqual(['name'])
    expect(messages(form.field('email').errors)).toStrictEqual(['email'])

    // validating one field must not erase the form-level error
    await form.validateField('name')

    expect(messages(form.errors)).toContain('form')
  })

  it('setError replaces errors on the same path and appends path-less ones', () => {
    const form = createForm({ initialValues, schema: scriptedSchema(validResult) })

    form.setError({ message: 'a', path: ['name'] })
    form.setError({ message: 'b', path: ['name'] })

    expect(messages(form.errors)).toStrictEqual(['b'])

    form.setError({ message: 'x' })
    form.setError({ message: 'y' })

    expect(messages(form.errors)).toStrictEqual(['b', 'x', 'y'])

    form.clearErrors()

    expect(form.errors).toHaveLength(0)
    expect(form.isValid).toBe(true)
  })
})

describe('results', () => {
  it('hands the transformed output to onSubmit and leaves form.values as typed', async () => {
    const schema: StandardSchemaV1<{ age: string }, { age: number }> = {
      '~standard': {
        validate: (value) => {
          return { value: { age: Number((value as { age: string }).age) } }
        },
        ...props,
      },
    }

    const onSubmit = vi.fn()
    const form = createForm({ initialValues: { age: '42' }, onSubmit, schema })

    await form.submit()

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ age: 42 })
    expect(form.values.age).toBe('42')
  })

  it('supports async schemas and reports isValidating while they run', async () => {
    const gate = Promise.withResolvers<void>()

    const form = createForm({
      initialValues,
      schema: scriptedSchema(async () => {
        await gate.promise

        return validResult()
      }),
    })
    const validation = form.validate()

    expect(form.isValidating).toBe(true)

    gate.resolve()
    await validation

    expect(form.isValidating).toBe(false)
  })

  it('submit rejects with what onSubmit throws, resets isSubmitting, and can be retried', async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('server down'))
    const form = createForm({
      initialValues: { email: 'jane@example.com', name: 'Jane' },
      onSubmit,
      schema: object({ email: string(5), name: string(2) }),
    })

    await expect(form.submit()).rejects.toThrow('server down')

    expect(form.isSubmitting).toBe(false)
    expect(form.submitCount).toBe(1)

    await form.submit()

    expect(onSubmit).toHaveBeenCalledTimes(2)
    expect(form.submitCount).toBe(2)
  })
})

describe('a schema that throws', () => {
  const cases: [string, Script, string][] = [
    [
      'an Error',
      () => {
        return fail(new Error('boom'))
      },
      'boom',
    ],
    [
      'a string',
      () => {
        return fail('plain')
      },
      'plain',
    ],
    [
      'a value without text',
      () => {
        return fail({ code: 1 })
      },
      'Validation failed',
    ],
    [
      'a rejected promise',
      () => {
        return Promise.reject(new Error('async boom'))
      },
      'async boom',
    ],
  ]

  it.for(cases)('turns %s into a form-level issue on validate()', async ([_label, script, expected]) => {
    const form = createForm({ initialValues, schema: scriptedSchema(script) })
    const result = await form.validate()

    expect(result.issues).toStrictEqual([{ message: expected }])
    expect(form.errors).toStrictEqual([{ message: expected }])
    expect(form.isValid).toBe(false)
  })

  it.for(cases)('turns %s into an issue on the field on validateField()', async ([_label, script, expected]) => {
    const form = createForm({ initialValues, schema: scriptedSchema(script) })
    const field = form.field('name')

    await field.validate()

    expect(messages(field.errors)).toStrictEqual([expected])
    expect(form.field('email').errors).toHaveLength(0)
  })

  it('blocks submit without calling onSubmit and without leaving isSubmitting stuck', async () => {
    const onSubmit = vi.fn()

    const form = createForm({
      initialValues,
      onSubmit,
      schema: scriptedSchema(() => {
        return fail(new Error('boom'))
      }),
    })

    await form.submit()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.isSubmitting).toBe(false)
    expect(form.isValid).toBe(false)
  })
})

describe('reactive schema', () => {
  it('validates against the schema a ref currently holds', async () => {
    const strict = object({ name: string(5) })
    const lenient = object({ name: string(1) })
    const current = shallowRef(strict)
    const form = createForm({ initialValues: { name: 'J' }, schema: current })

    await form.validate()

    expect(form.errors).toHaveLength(1)

    current.value = lenient

    await form.validate()

    expect(form.errors).toHaveLength(0)
  })

  it('validates against the schema a getter currently returns', async () => {
    const strict = object({ name: string(5) })
    const lenient = object({ name: string(1) })
    let useStrict = true

    const form = createForm({
      initialValues: { name: 'J' },
      schema: () => {
        return useStrict ? strict : lenient
      },
    })

    await form.validate()

    expect(form.errors).toHaveLength(1)

    useStrict = false

    await form.validate()

    expect(form.errors).toHaveLength(0)
  })

  it('discards a validation that started under the previous schema', async () => {
    const gate = Promise.withResolvers<void>()
    const slow = object({ name: string(2) })
    const fast = object({ name: string(2) })

    vi.spyOn(slow['~standard'], 'validate').mockImplementation(async () => {
      await gate.promise

      return { issues: [{ message: 'Stale error', path: ['name'] }] }
    })

    const current = shallowRef(slow)
    const form = createForm({ initialValues: { name: 'Jane' }, schema: current })
    const pending = form.validate()

    await flushPromises()

    current.value = fast
    gate.resolve()
    await pending

    expect(form.errors).toHaveLength(0)
  })
})
