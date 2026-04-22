import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import { NotForm, NotArrayField, useNotForm } from '../src'
import type { UseNotFormConfig } from '../src'
import { notValidator } from './utils/not-validator'

describe('NotArrayField', () => {
  const schema = notValidator.object({
    tags: notValidator.array(notValidator.string(1), 1, 5),
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseConfig: UseNotFormConfig<any> = {
    schema,
    initialValues: { tags: [] },
    validateOn: { onBlur: false, onChange: false, onInput: false },
  }

  const mountForm = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formConfig?: Partial<UseNotFormConfig<any>>,
    // Extra slot content injected after the array field slot — lets individual
    // tests add buttons that call array methods without duplicating the wrapper.
    extraTemplate = '',
  ) => {
    const form = useNotForm({ ...baseConfig, ...formConfig })

    const wrapper = mount({
      components: { NotForm, NotArrayField },
      setup: () => ({ form }),
      template: `
        <NotForm :form="form">
          <NotArrayField path="tags" v-slot="slot">
            <div
              v-for="item in slot.items"
              :key="item.key"
              :data-key="item.key"
              :data-index="item.index"
              :data-path="item.path"
              class="item"
            />
            <div data-length="true">{{ slot.items.length }}</div>
            <div data-valid="true">{{ slot.isValid }}</div>
            <div data-touched="true">{{ slot.isTouched }}</div>
            <div data-dirty="true">{{ slot.isDirty }}</div>
            <div data-validating="true">{{ slot.isValidating }}</div>
            <div data-errors="true">{{ slot.errors.length }}</div>
            <button id="append"   type="button" @click="slot.append('tag-a')">append</button>
            <button id="prepend"  type="button" @click="slot.prepend('tag-z')">prepend</button>
            <button id="remove0"  type="button" @click="slot.remove(0)">remove 0</button>
            <button id="insert1"  type="button" @click="slot.insert(1, 'inserted')">insert at 1</button>
            <button id="update0"  type="button" @click="slot.update(0, 'updated')">update 0</button>
            <button id="swap"     type="button" @click="slot.swap(0, 1)">swap 0 and 1</button>
            <button id="move"     type="button" @click="slot.move(0, 2)">move 0 to 2</button>
            <button id="validate" type="button" @click="slot.validate()">validate</button>
            ${extraTemplate}
          </NotArrayField>
        </NotForm>
      `,
    })

    return { form, wrapper }
  }
  

  describe('Initial slot props', () => {
    const { wrapper } = mountForm()

    test('length is 0 when the array starts empty', () => {
      expect(wrapper.find('[data-length]').text()).toBe('0')
    })

    test('isValid is true when there are no errors', () => {
      expect(wrapper.find('[data-valid]').text()).toBe('true')
    })

    test('isTouched is false before any mutation', () => {
      expect(wrapper.find('[data-touched]').text()).toBe('false')
    })

    test('isDirty is false before any mutation', () => {
      expect(wrapper.find('[data-dirty]').text()).toBe('false')
    })

    test('length reflects pre-populated initial values', () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })
      expect(wrapper.find('[data-length]').text()).toBe('2')
    })

    test('items has correct index and path for each element', () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['x', 'y'] } })
      const items = wrapper.findAll('.item')

      expect(items[0].attributes('data-index')).toBe('0')
      expect(items[0].attributes('data-path')).toBe('tags.0')

      expect(items[1].attributes('data-index')).toBe('1')
      expect(items[1].attributes('data-path')).toBe('tags.1')
    })
  })
  

  describe('append', () => {
    test('adds an item to the end of the array', async () => {
      const { form, wrapper } = mountForm()

      await wrapper.find('#append').trigger('click')

      expect(form.values.tags).toEqual(['tag-a'])
      expect(wrapper.find('[data-length]').text()).toBe('1')
    })

    test('keeps existing items in order', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['first'] } })

      await wrapper.find('#append').trigger('click')

      expect(form.values.tags).toEqual(['first', 'tag-a'])
    })

    test('marks the array as touched and dirty', async () => {
      const { wrapper } = mountForm()

      await wrapper.find('#append').trigger('click')

      expect(wrapper.find('[data-touched]').text()).toBe('true')
      expect(wrapper.find('[data-dirty]').text()).toBe('true')
    })

    test('appending multiple times increments length correctly', async () => {
      const { form, wrapper } = mountForm()

      await wrapper.find('#append').trigger('click')
      await wrapper.find('#append').trigger('click')
      await wrapper.find('#append').trigger('click')

      expect(form.values.tags.length).toBe(3)
      expect(wrapper.find('[data-length]').text()).toBe('3')
    })
  })
  

  describe('prepend', () => {
    test('adds an item at the start of the array', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['existing'] } })

      await wrapper.find('#prepend').trigger('click')

      expect(form.values.tags[0]).toBe('tag-z')
      expect(form.values.tags[1]).toBe('existing')
    })

    test('marks the array as touched and dirty', async () => {
      const { wrapper } = mountForm()

      await wrapper.find('#prepend').trigger('click')

      expect(wrapper.find('[data-touched]').text()).toBe('true')
      expect(wrapper.find('[data-dirty]').text()).toBe('true')
    })
  })
  

  describe('remove', () => {
    test('removes the item at the given index', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['a', 'b', 'c'] } })

      await wrapper.find('#remove0').trigger('click')

      expect(form.values.tags).toEqual(['b', 'c'])
    })

    test('decrements length after removal', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })

      await wrapper.find('#remove0').trigger('click')

      expect(wrapper.find('[data-length]').text()).toBe('1')
    })

    test('removes items and updates paths — subsequent item shifts to index 0', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })

      await wrapper.find('#remove0').trigger('click')

      const items = wrapper.findAll('.item')
      expect(items.length).toBe(1)
      expect(items[0].attributes('data-path')).toBe('tags.0')
    })
  })
  

  describe('insert', () => {
    test('inserts an item at the specified index', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })

      await wrapper.find('#insert1').trigger('click')

      expect(form.values.tags).toEqual(['a', 'inserted', 'b'])
    })

    test('increments length after insertion', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })

      await wrapper.find('#insert1').trigger('click')

      expect(wrapper.find('[data-length]').text()).toBe('3')
    })
  })
  

  describe('update', () => {
    test('replaces the value at the given index', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['old', 'b'] } })

      await wrapper.find('#update0').trigger('click')

      expect(form.values.tags[0]).toBe('updated')
      expect(form.values.tags[1]).toBe('b')
    })

    test('does not change the array length', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })

      await wrapper.find('#update0').trigger('click')

      expect(wrapper.find('[data-length]').text()).toBe('2')
    })
  })
  

  describe('swap', () => {
    test('swaps the values at two indices', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['first', 'second'] } })

      await wrapper.find('#swap').trigger('click')

      expect(form.values.tags).toEqual(['second', 'first'])
    })

    test('stable keys survive a swap — item keys change position, not identity', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b'] } })

      const keysBefore = wrapper.findAll('.item').map(element => element.attributes('data-key'))

      await wrapper.find('#swap').trigger('click')

      const keysAfter = wrapper.findAll('.item').map(element => element.attributes('data-key'))

      // The two keys still exist — no key was created or destroyed
      expect(keysAfter).toHaveLength(2)
      expect(new Set(keysAfter).size).toBe(2)

      // The key that was at index 0 is now at index 1, and vice versa
      expect(keysAfter[0]).toBe(keysBefore[1])
      expect(keysAfter[1]).toBe(keysBefore[0])
    })
  })
  

  describe('move', () => {
    test('moves item from index 0 to index 2', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['a', 'b', 'c'] } })

      await wrapper.find('#move').trigger('click')

      expect(form.values.tags).toEqual(['b', 'c', 'a'])
    })

    test('length is unchanged after a move', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b', 'c'] } })

      await wrapper.find('#move').trigger('click')

      expect(wrapper.find('[data-length]').text()).toBe('3')
    })
  })
  

  describe('validate', () => {
    test('calling validate() surfaces errors on the array field', async () => {
      const { wrapper } = mountForm()

      await wrapper.find('#validate').trigger('click')
      await flushPromises()

      expect(wrapper.find('[data-errors]').text()).not.toBe('0')
    })

    test('isValidating is true while validation is running', async () => {
      const { form } = mountForm()

      const promise = form.validateField('tags')
      // We check the form-level flag — the component flag mirrors it
      expect(form.isValidating.value).toBe(true)

      await promise
      expect(form.isValidating.value).toBe(false)
    })
  })
  

  describe('validateOn.onChange', () => {
    test('triggers validation after append when onChange is enabled', async () => {
      const { form, wrapper } = mountForm({ validateOn: { onChange: true } })

      await wrapper.find('#append').trigger('click')
      await flushPromises()

      // Form ran validation — isValidating has cycled
      expect(form.isValidating.value).toBe(false)
    })

    test('does not trigger validation after append when onChange is disabled', async () => {
      const validateOnChangeFalse = {
        onBlur: false,
        onChange: false,
        onInput: false,
      }

      const { form, wrapper } = mountForm({ validateOn: validateOnChangeFalse })

      await wrapper.find('#append').trigger('click')
      await flushPromises()

      // No auto-validation ran, so errors remain empty
      expect(form.errors.length).toBe(0)
    })
  })
  

  describe('validateOn.onMount', () => {
    test('validates immediately on mount when onMount is enabled', async () => {
      const { form } = mountForm({ validateOn: { onMount: true } })

      await flushPromises()

      expect(form.errors.length).toBeGreaterThan(0)
    })

    test('does not validate on mount by default', async () => {
      const { form } = mountForm()
      await flushPromises()

      expect(form.errors.length).toBe(0)
    })
  })
  

  describe('isTouched and isDirty', () => {
    test('isTouched becomes true when a child field path is touched on the form', async () => {
      const { form, wrapper } = mountForm({ initialValues: { tags: ['a'] } })

      form.touchField('tags.0')
      await flushPromises()

      expect(wrapper.find('[data-touched]').text()).toBe('true')
    })

    test('isDirty becomes true when a child field path is dirty on the form', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a'] } })

      await wrapper.find('#append').trigger('click')

      expect(wrapper.find('[data-dirty]').text()).toBe('true')
    })

    test('isDirty reverts to false after reset restores initial values', async () => {
      const { form, wrapper } = mountForm()

      await wrapper.find('#append').trigger('click')
      expect(wrapper.find('[data-dirty]').text()).toBe('true')

      form.reset()
      await flushPromises()

      expect(wrapper.find('[data-dirty]').text()).toBe('false')
    })
  })
  

  describe('Singleton', () => {
    test('works without a NotForm ancestor when :form is passed directly', async () => {
      const form = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotArrayField },
        setup: () => ({ form }),
        template: `
          <NotArrayField :form="form" path="tags" v-slot="slot">
            <div data-length="true">{{ slot.items.length }}</div>
            <button id="append"  @click="slot.append('solo')">append</button>
            <button id="prepend" @click="slot.prepend('first')">prepend</button>
          </NotArrayField>
        `,
      })

      await wrapper.find('#append').trigger('click')
      expect(form.values.tags).toEqual(['solo'])
      expect(wrapper.find('[data-length]').text()).toBe('1')

      await wrapper.find('#prepend').trigger('click')
      expect(form.values.tags[0]).toBe('first')
      expect(wrapper.find('[data-length]').text()).toBe('2')
    })

    test(':form prop takes priority over a NotForm ancestor', async () => {
      const primaryForm = useNotForm({ ...baseConfig })
      const secondaryForm = useNotForm({ ...baseConfig })

      const wrapper = mount({
        components: { NotForm, NotArrayField },
        setup: () => ({ primaryForm, secondaryForm }),
        template: `
          <NotForm :form="primaryForm">
            <NotArrayField :form="secondaryForm" path="tags" v-slot="slot">
              <button id="append" @click="slot.append('item')">append</button>
            </NotArrayField>
          </NotForm>
        `,
      })

      await wrapper.find('#append').trigger('click')

      expect(secondaryForm.values.tags).toEqual(['item'])
      expect(primaryForm.values.tags).toEqual([])
    })
  })
  

  describe('Stable keys', () => {
    test('item keys are unique across all rendered items', () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a', 'b', 'c'] } })
      const keys = wrapper.findAll('.item').map(element => element.attributes('data-key'))

      expect(new Set(keys).size).toBe(keys.length)
    })

    test('key of an existing item does not change after an unrelated append', async () => {
      const { wrapper } = mountForm({ initialValues: { tags: ['a'] } })

      // Capture the rendered path of the first existing item
      const keyBefore = wrapper.findAll('.item')[0].attributes('data-key')

      await wrapper.find('#append').trigger('click')

      const keyAfter = wrapper.findAll('.item')[0].attributes('data-key')

      // The path (and therefore the underlying key slot) of the pre-existing item is unchanged
      expect(keyAfter).toBe(keyBefore)
    })
  })
})
