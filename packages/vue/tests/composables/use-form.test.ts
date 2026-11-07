import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { object, string } from '../../schemas'
import { type FormConfig, type FormSchema, useForm, type UseFormInstance } from '../../src'

const schema = object({
  email: string(5),
  name: string(2),
})

/**
 * Mounts a component that calls `useForm` in `setup()`, the way an app does,
 * so unmounting exercises the real cleanup path.
 * @param config The config handed to `useForm`.
 * @returns The form and the mounted wrapper.
 */
function mountUseForm<TSchema extends FormSchema>(config: FormConfig<TSchema>) {
  const holder: { form?: UseFormInstance<TSchema> } = {}

  const wrapper = mount(defineComponent({
    setup() {
      holder.form = useForm(config)

      // eslint-disable-next-line unicorn/consistent-function-scoping
      return () => {
        return h('div')
      }
    },
  }))

  if (!holder.form) {
    throw new Error('useForm did not run')
  }

  return { form: holder.form, wrapper }
}

describe('useForm', () => {
  it('works outside a component, where there is no scope to clean up', () => {
    expect(() => {
      return useForm({ schema })
    }).not.toThrow()
  })

  it('creates independent forms', () => {
    const first = useForm({ initialValues: { name: 'Ada' }, schema })
    const second = useForm({ initialValues: { name: 'Bea' }, schema })

    first.setValue('name', 'Changed')

    expect(second.values.name).toBe('Bea')
    expect(first.field('name').id).not.toBe(second.field('name').id)
  })

  it('submits through the handler with the validated data', async () => {
    const onSubmit = vi.fn()
    const { form } = mountUseForm({ initialValues: { email: 'jane@example.com', name: 'Jane' }, onSubmit, schema })

    await form.submit()

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ email: 'jane@example.com', name: 'Jane' })
  })
})

describe('unmounting the component that called useForm', () => {
  it('cancels a pending debounced validation', async () => {
    vi.useFakeTimers()

    try {
      const debounced = object({ name: string(2) })
      const validate = vi.spyOn(debounced['~standard'], 'validate')
      const { form, wrapper } = mountUseForm({ initialValues: { name: 'J' }, schema: debounced })

      form.field('name', { debounce: 100 }).events.onChange()
      wrapper.unmount()
      await vi.advanceTimersByTimeAsync(200)

      expect(validate).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('discards a validation that is still running', async () => {
    const gate = Promise.withResolvers<void>()
    const slow = object({ name: string(2) })

    vi.spyOn(slow['~standard'], 'validate').mockImplementation(async () => {
      await gate.promise

      return { issues: [{ message: 'Late', path: ['name'] }] }
    })

    const { form, wrapper } = mountUseForm({ initialValues: { name: 'Jane' }, schema: slow })
    const pending = form.validate()

    expect(form.isValidating).toBe(true)

    wrapper.unmount()

    expect(form.isValidating).toBe(false)

    gate.resolve()
    await pending

    expect(form.errors).toHaveLength(0)
  })

  it('turns fields handed out earlier into inert handles', async () => {
    const { form, wrapper } = mountUseForm({ initialValues: { email: 'jane@example.com', name: 'Jane' }, schema })
    const field = form.field('name')

    wrapper.unmount()

    field.events.onBlur()
    field.model = 'Changed'
    const result = await field.validate()

    expect(field.isTouched).toBe(false)
    expect(form.values.name).toBe('Jane')
    expect(result).toStrictEqual({ value: undefined })
  })

  it('creates inert fields for paths first asked for after unmount', () => {
    const { form, wrapper } = mountUseForm({ initialValues: { email: 'jane@example.com', name: 'Jane' }, schema })

    wrapper.unmount()

    const late = form.field('email')

    late.events.onBlur()
    late.model = 'changed@example.com'

    expect(late.isTouched).toBe(false)
    expect(form.values.email).toBe('jane@example.com')
  })
})
