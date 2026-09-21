import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NotArrayField, type UseNotFormConfig } from '../../src'
import { createNotFormInstance } from '../../src/composables/create-not-form-instance'
import { delayed, tagsSchema } from '../helpers/not-validator'

const baseConfig: UseNotFormConfig<typeof tagsSchema> = {
  initialValues: { tags: ['a', 'b', 'c'] },
  schema: tagsSchema,
}

const template = `
  <NotArrayField
    :form="form"
    path="tags"
    v-slot="{ items, errors, isValid, isTouched, isDirty, isValidating, append, prepend, insert, remove, update, swap, move }"
  >
    <div
      v-for="item in items"
      :key="item.key"
      class="item"
      :data-key="item.key"
      :data-path="item.path"
    >
      {{ item.index }}
    </div>

    <span id="errors">{{ errors.map((error) => error.message).join('|') }}</span>
    <span id="is-valid">{{ isValid }}</span>
    <span id="is-touched">{{ isTouched }}</span>
    <span id="is-dirty">{{ isDirty }}</span>
    <span id="is-validating">{{ isValidating }}</span>

    <button id="append" type="button" @click="append('new')">Append</button>
    <button id="prepend" type="button" @click="prepend('new')">Prepend</button>
    <button id="remove-1" type="button" @click="remove(1)">Remove index 1</button>
    <button id="insert-1" type="button" @click="insert(1, 'new')">Insert at 1</button>
    <button id="update-0" type="button" @click="update(0, 'updated')">Update index 0</button>
    <button id="swap-0-2" type="button" @click="swap(0, 2)">Swap 0 and 2</button>
    <button id="move-0-2" type="button" @click="move(0, 2)">Move 0 to 2</button>
  </NotArrayField>
`

/**
 * Helper function to mount an array field with a form
 * @param formConfig Optional configuration to override the base config
 * @returns The mounted form and wrapper
 */
function mountArrayField(formConfig?: Partial<UseNotFormConfig<typeof tagsSchema>>) {
  const form = createNotFormInstance({ ...baseConfig, ...formConfig })

  const wrapper = mount({
    components: { NotArrayField },
    setup: () => ({ form }),
    template,
  })

  return { form, wrapper }
}

/**
 * Helper function to get the rendered keys from the array field
 * @param wrapper The mounted form wrapper
 * @returns Array of rendered keys
 */
function getRenderedKeys(wrapper: ReturnType<typeof mountArrayField>['wrapper']) {
  return wrapper.findAll('.item').map(item => item.attributes('data-key'))
}

/**
 * Helper function to expect defined unique keys
 * @param keys Array of keys to check
 */
function expectDefinedUniqueKeys(keys: Array<string | undefined>) {
  expect(keys.every(Boolean)).toBe(true)
  expect(new Set(keys).size).toBe(keys.length)
}

describe('items', () => {
  it('renders defined unique keys and index-based paths', () => {
    const { wrapper } = mountArrayField()

    const items = wrapper.findAll('.item')
    const keys = getRenderedKeys(wrapper)

    expect(items).toHaveLength(3)

    expectDefinedUniqueKeys(keys)

    expect(items[0].attributes('data-path')).toBe('tags.0')
    expect(items[1].attributes('data-path')).toBe('tags.1')
    expect(items[2].attributes('data-path')).toBe('tags.2')
  })
})

describe('identity', () => {
  it('append keeps existing keys and assigns a new defined key at the end', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#append').trigger('click')

    expect(form.values.tags).toStrictEqual(['a', 'b', 'c', 'new'])

    const keysAfter = getRenderedKeys(wrapper)

    expect(keysAfter).toHaveLength(4)
    expect(keysAfter.slice(0, 3)).toStrictEqual(keysBefore)
    expect(keysAfter[3]).toBeDefined()
    expect(keysBefore).not.toContain(keysAfter[3])

    expectDefinedUniqueKeys(keysAfter)
  })

  it('prepend keeps existing keys and shifts them forward', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#prepend').trigger('click')

    expect(form.values.tags).toStrictEqual(['new', 'a', 'b', 'c'])

    const keysAfter = getRenderedKeys(wrapper)

    expect(keysAfter.slice(1)).toStrictEqual(keysBefore)
    expect(keysAfter[0]).toBeDefined()
    expect(keysBefore).not.toContain(keysAfter[0])
  })

  it('insert keeps surviving keys', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#insert-1').trigger('click')

    expect(form.values.tags).toStrictEqual(['a', 'new', 'b', 'c'])

    const keysAfter = getRenderedKeys(wrapper)

    expect(keysAfter[0]).toBe(keysBefore[0])
    expect(keysAfter[2]).toBe(keysBefore[1])
    expect(keysAfter[3]).toBe(keysBefore[2])
    expect(keysAfter[1]).toBeDefined()
    // eslint-disable-next-line test/max-expects
    expect(keysBefore).not.toContain(keysAfter[1])
  })

  it('remove keeps surviving keys', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#remove-1').trigger('click')

    expect(form.values.tags).toStrictEqual(['a', 'c'])

    const keysAfter = getRenderedKeys(wrapper)

    expect(keysAfter[0]).toBe(keysBefore[0])
    expect(keysAfter[1]).toBe(keysBefore[2])
  })

  it('update keeps the key at that index', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#update-0').trigger('click')

    expect(form.values.tags).toStrictEqual(['updated', 'b', 'c'])
    expect(getRenderedKeys(wrapper)).toStrictEqual(keysBefore)
  })

  it('swap moves keys with the values', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#swap-0-2').trigger('click')

    expect(form.values.tags).toStrictEqual(['c', 'b', 'a'])

    const keysAfter = getRenderedKeys(wrapper)

    expect(keysAfter[0]).toBe(keysBefore[2])
    expect(keysAfter[1]).toBe(keysBefore[1])
    expect(keysAfter[2]).toBe(keysBefore[0])
  })

  it('move carries the key with the item', async () => {
    const { form, wrapper } = mountArrayField()
    const keysBefore = getRenderedKeys(wrapper)

    await wrapper.get('#move-0-2').trigger('click')

    expect(form.values.tags).toStrictEqual(['b', 'c', 'a'])

    const keysAfter = getRenderedKeys(wrapper)

    expect(keysAfter[2]).toBe(keysBefore[0])
    expect(keysAfter[0]).toBe(keysBefore[1])
    expect(keysAfter[1]).toBe(keysBefore[2])
  })

  it('add then remove then add does not remint surviving keys', async () => {
    const { wrapper } = mountArrayField()
    const keysOnMount = getRenderedKeys(wrapper)

    await wrapper.get('#append').trigger('click')
    const keysAfterAppend = getRenderedKeys(wrapper)

    expect(keysAfterAppend.slice(0, 3)).toStrictEqual(keysOnMount)

    await wrapper.get('#remove-1').trigger('click')
    const keysAfterRemove = getRenderedKeys(wrapper)

    expect(keysAfterRemove[0]).toBe(keysOnMount[0])
    expect(keysAfterRemove[1]).toBe(keysOnMount[2])
    expect(keysAfterRemove[2]).toBe(keysAfterAppend[3])

    await wrapper.get('#append').trigger('click')
    const keysAfterSecondAppend = getRenderedKeys(wrapper)

    expect(keysAfterSecondAppend.slice(0, 3)).toStrictEqual(keysAfterRemove)
    // eslint-disable-next-line test/max-expects
    expect(keysAfterSecondAppend[3]).toBeDefined()
    // eslint-disable-next-line test/max-expects
    expect(keysAfterSecondAppend).not.toContain(keysOnMount[1])

    expectDefinedUniqueKeys(keysAfterSecondAppend)
  })
})

describe('external mutation', () => {
  it('reconciles length when setValue replaces the array', async () => {
    const { form, wrapper } = mountArrayField()

    form.setValue('tags', ['x', 'y'])
    await flushPromises()

    const keys = getRenderedKeys(wrapper)

    expect(keys).toHaveLength(2)

    expectDefinedUniqueKeys(keys)
  })
})

describe('remapped field state', () => {
  it('keeps touch and error on the same item after remove', async () => {
    const { form, wrapper } = mountArrayField()

    form.markFieldAsTouched('tags.2')
    form.setError({ message: 'Item is bad', path: ['tags', 2] })

    await wrapper.get('#remove-1').trigger('click')

    expect(form.touchedFields.has('tags.1')).toBe(true)
    expect(form.touchedFields.has('tags.2')).toBe(false)
    expect(form.getFieldErrors('tags.1').at(0)?.message).toBe('Item is bad')
  })
})

describe('aggregated errors and validity', () => {
  it('surfaces the array field min-length error', async () => {
    const { form, wrapper } = mountArrayField({
      initialValues: { tags: ['a'] },
    })

    await form.validate()
    await flushPromises()

    expect(wrapper.get('#errors').text()).toContain('at least 2 items')
    expect(wrapper.get('#is-valid').text()).toBe('false')
  })
})

describe('aggregated touch and dirty state', () => {
  it('isTouched is true when any item path is touched', async () => {
    const { form, wrapper } = mountArrayField()

    expect(wrapper.get('#is-touched').text()).toBe('false')

    form.markFieldAsTouched('tags.1')
    await flushPromises()

    expect(wrapper.get('#is-touched').text()).toBe('true')
  })

  it('isDirty is true when any item path is dirty', async () => {
    const { form, wrapper } = mountArrayField()

    expect(wrapper.get('#is-dirty').text()).toBe('false')

    form.markFieldAsDirty('tags.0')
    await flushPromises()

    expect(wrapper.get('#is-dirty').text()).toBe('true')
  })
})

describe('aggregated validating state', () => {
  it('isValidating is true while the array field is validating', async () => {
    // eslint-disable-next-line ts/no-invalid-void-type
    const { promise, resolve } = Promise.withResolvers<void>()

    const { form, wrapper } = mountArrayField({
      schema: delayed(tagsSchema, promise),
    })

    const validation = form.validateField('tags')
    await flushPromises()

    expect(wrapper.get('#is-validating').text()).toBe('true')

    resolve()
    await validation
    await flushPromises()

    expect(wrapper.get('#is-validating').text()).toBe('false')
  })
})
