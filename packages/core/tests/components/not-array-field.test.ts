import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NotArrayField, NotForm, useNotForm, type UseNotFormConfig } from '../../src'
import { array, object, string, vendorVersion } from '../test-utils/not-validator'

const schema = object({
  tags: array(string(1), 1, 5),
})

const baseConfig: UseNotFormConfig<typeof schema> = {
  initialValues: { tags: [] },
  schema,
  validateOn: { onBlur: false, onChange: false, onInput: false },
}

/**
 * Mounts a NotArrayField within a NotForm wrapper for testing.
 * @param formConfig Optional configuration to override the base config.
 * @param extraTemplate Extra template content to inject after the NotArrayField slot (used for adding extra buttons/elements to the test harness).
 * @returns An object containing the wrapped NotForm instance and the test wrapper.
 */
function mountForm(formConfig?: Partial<UseNotFormConfig<any>>, extraTemplate = '') {
  const form = useNotForm({ ...baseConfig, ...formConfig })

  const wrapper = mount({
    components: { NotArrayField, NotForm },
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

describe('initial slot props', () => {
  const { wrapper } = mountForm()

  it('length is 0 when the array starts empty', () => {
    expect(wrapper.find('[data-length]').text()).toBe('0')
  })

  it('isValid is true when there are no errors', () => {
    expect(wrapper.find('[data-valid]').text()).toBe('true')
  })

  it('isTouched is false before any mutation', () => {
    expect(wrapper.find('[data-touched]').text()).toBe('false')
  })

  it('isDirty is false before any mutation', () => {
    expect(wrapper.find('[data-dirty]').text()).toBe('false')
  })

  it('length reflects pre-populated initial values', () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['a', 'b'] },
    })

    expect(wrapper.find('[data-length]').text()).toBe('2')
  })

  it('items has correct index and path for each element', () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['x', 'y'] },
    })
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-index')).toBe('0')
    expect(items[0].attributes('data-path')).toBe('tags.0')

    expect(items[1].attributes('data-index')).toBe('1')
    expect(items[1].attributes('data-path')).toBe('tags.1')
  })
})

describe('append', () => {
  it('adds an item to the end of the array', async () => {
    const { form, wrapper } = mountForm()

    await wrapper.find('#append').trigger('click')

    expect(form.values.tags).toStrictEqual(['tag-a'])
    expect(wrapper.find('[data-length]').text()).toBe('1')
  })

  it('keeps existing items in order when appending', async () => {
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['item-1'] },
    })

    await wrapper.find('#append').trigger('click')

    // Verify the new element is added to the end and the originals are unmoved
    expect(form.values.tags).toStrictEqual(['item-1', 'tag-a'])
    expect(wrapper.find('[data-length]').text()).toBe('2')

    // Verify the DOM structure attributes map sequentially in the correct order
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-index')).toBe('0')
    expect(items[0].attributes('data-path')).toBe('tags.0')

    expect(items[1].attributes('data-index')).toBe('1')
    // eslint-disable-next-line test/max-expects
    expect(items[1].attributes('data-path')).toBe('tags.1')
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm()

    await wrapper.find('#append').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('prepend', () => {
  it('adds an item at the start of the array', async () => {
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['item-1'] },
    })

    await wrapper.find('#prepend').trigger('click')

    // Verify the new element is at index 0 and the rest are shifted down
    expect(form.values.tags).toStrictEqual(['tag-z', 'item-1'])
    expect(wrapper.find('[data-length]').text()).toBe('2')

    // Verify that the DOM item paths update reactively to match their new offsets
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-path')).toBe('tags.0')
    expect(items[1].attributes('data-path')).toBe('tags.1')
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm()

    await wrapper.find('#prepend').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('remove', () => {
  it('removes the item at the given index', async () => {
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['item-0', 'item-1'] },
    })

    await wrapper.find('#remove0').trigger('click')

    // Verify the first item is gone and the remaining items are preserved
    expect(form.values.tags).toStrictEqual(['item-1'])
    expect(wrapper.find('[data-length]').text()).toBe('1')

    // Verify that the DOM keys, paths, and positions update reactively
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-index')).toBe('0')
    expect(items[0].attributes('data-path')).toBe('tags.0')
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-0', 'item-1'] },
    })

    await wrapper.find('#remove0').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('insert', () => {
  it('inserts an item at the specified index', async () => {
  // Initialize with two elements so we can insert exactly between them (index 1)
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['item-0', 'item-2'] },
    })

    await wrapper.find('#insert1').trigger('click')

    // Verify the new element sits at index 1 and subsequent items shift down
    expect(form.values.tags).toStrictEqual(['item-0', 'inserted', 'item-2'])
    expect(wrapper.find('[data-length]').text()).toBe('3')

    // Verify that the DOM data paths updated reactively to reflect the new structure
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-path')).toBe('tags.0')
    expect(items[1].attributes('data-path')).toBe('tags.1')
    expect(items[2].attributes('data-path')).toBe('tags.2')
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-0', 'item-2'] },
    })

    await wrapper.find('#insert1').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('update', () => {
  it('replaces the value at the given index', async () => {
  // Initialize with two elements so we can target index 0
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['old-value', 'keep-me'] },
    })

    await wrapper.find('#update0').trigger('click')

    // Verify only index 0 changed and the length remains exactly 2
    expect(form.values.tags).toStrictEqual(['updated', 'keep-me'])
    expect(wrapper.find('[data-length]').text()).toBe('2')

    // Verify that the tracking metadata structure is unchanged
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-path')).toBe('tags.0')
    expect(items[1].attributes('data-path')).toBe('tags.1')
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['old-value', 'keep-me'] },
    })

    await wrapper.find('#update0').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('swap', () => {
  it('swaps the values at two indices', async () => {
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B', 'item-C'] },
    })

    // Click the button to swap index 0 ('item-A') and index 1 ('item-B')
    await wrapper.find('#swap').trigger('click')

    // Verify the two targets swapped places while the rest stayed put
    expect(form.values.tags).toStrictEqual(['item-B', 'item-A', 'item-C'])
    expect(wrapper.find('[data-length]').text()).toBe('3')

    // Verify that structural data paths remain intact for the components
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-path')).toBe('tags.0')
    expect(items[1].attributes('data-path')).toBe('tags.1')
    expect(items[2].attributes('data-path')).toBe('tags.2')
  })

  it('preserves item keys during a swap so that keys change position but retain identity', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B'] },
    })

    // Capture the initial key signatures of both items from the DOM attributes
    const initialItems = wrapper.findAll('.item')
    const initialKeyA = initialItems[0].attributes('data-key')
    const initialKeyB = initialItems[1].attributes('data-key')

    // Perform the swap mutation between index 0 and 1
    await wrapper.find('#swap').trigger('click')

    // Fetch the new structural collection after the mutation settles
    const postSwapItems = wrapper.findAll('.item')
    const newKeyAtPosition0 = postSwapItems[0].attributes('data-key')
    const newKeyAtPosition1 = postSwapItems[1].attributes('data-key')

    // The unique keys must have swapped their layout indices
    // without mutating their structural identity strings
    expect(newKeyAtPosition0).toBe(initialKeyB)
    expect(newKeyAtPosition1).toBe(initialKeyA)
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B'] },
    })

    await wrapper.find('#swap').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('move', () => {
  it('moves an item from one index to another', async () => {
    const { form, wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B', 'item-C'] },
    })

    // Move index 0 ('item-A') to index 2 (the end of the array)
    await wrapper.find('#move').trigger('click')

    // Verify 'item-A' is at the tail, and others shifted up to fill the gap
    expect(form.values.tags).toStrictEqual(['item-B', 'item-C', 'item-A'])
    expect(wrapper.find('[data-length]').text()).toBe('3')

    // Verify that the DOM elements correctly pick up their new structured paths
    const items = wrapper.findAll('.item')

    expect(items[0].attributes('data-path')).toBe('tags.0')
    expect(items[1].attributes('data-path')).toBe('tags.1')
    expect(items[2].attributes('data-path')).toBe('tags.2')
  })

  it('preserves item keys during a move so that keys change position but retain identity', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B', 'item-C'] },
    })

    // Capture the initial unique key of the moving item (index 0) and destination neighbors
    const initialItems = wrapper.findAll('.item')
    const keyA = initialItems[0].attributes('data-key')
    const keyB = initialItems[1].attributes('data-key')
    const keyC = initialItems[2].attributes('data-key')

    // Perform the move mutation (index 0 to index 2)
    await wrapper.find('#move').trigger('click')

    // Fetch the collection after the mutation settles
    const postMoveItems = wrapper.findAll('.item')

    // The unique keys must have shifted positions alongside their values
    // Index 0 ('item-A') moved to index 2, pushing index 1 & 2 up to index 0 & 1
    expect(postMoveItems[0].attributes('data-key')).toBe(keyB)
    expect(postMoveItems[1].attributes('data-key')).toBe(keyC)
    expect(postMoveItems[2].attributes('data-key')).toBe(keyA)
  })

  it('marks the array as touched and dirty', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B', 'item-C'] },
    })

    await wrapper.find('#move').trigger('click')

    expect(wrapper.find('[data-touched]').text()).toBe('true')
    expect(wrapper.find('[data-dirty]').text()).toBe('true')
  })
})

describe('singleton', () => {
  it('works without a NotForm ancestor when :form is passed directly', async () => {
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

    expect(form.values.tags).toStrictEqual(['solo'])
    expect(wrapper.find('[data-length]').text()).toBe('1')

    await wrapper.find('#prepend').trigger('click')

    expect(form.values.tags[0]).toBe('first')
    expect(wrapper.find('[data-length]').text()).toBe('2')
  })

  it(':form prop takes priority over a NotForm ancestor', async () => {
    const primaryForm = useNotForm({ ...baseConfig })
    const secondaryForm = useNotForm({ ...baseConfig })

    const wrapper = mount({
      components: { NotArrayField, NotForm },
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

    expect(secondaryForm.values.tags).toStrictEqual(['item'])
    expect(primaryForm.values.tags).toStrictEqual([])
  })
})

describe('keys', () => {
  it('ensures item keys are unique across all rendered items', async () => {
    const { wrapper } = mountForm({
      initialValues: { tags: ['item-A', 'item-B', 'item-C'] },
    })

    const items = wrapper.findAll('.item')

    // The total rendered length matches our data count
    expect(items).toHaveLength(3)

    const key0 = items[0].attributes('data-key')
    const key1 = items[1].attributes('data-key')
    const key2 = items[2].attributes('data-key')

    // That no two keys share the exact same identity value
    expect(key0).not.toBe(key1)
    expect(key0).not.toBe(key2)

    // Since Key0 has been checked against the rest, we only need to check Key1 and Key2
    expect(key1).not.toBe(key2)
  })
})

describe('validate', () => {
  it('surfaces validation errors on the array field when constraints are violated', async () => {
    const { wrapper } = mountForm()

    // Confirm that the array field starts with 0 surfaced errors
    expect(wrapper.find('[data-errors]').text()).toBe('0')
    expect(wrapper.find('[data-valid]').text()).toBe('true')

    // Act: Click the validate button exposed by the slot template
    await wrapper.find('#validate').trigger('click')
    await flushPromises()

    // Assert: Verify the errors count shifts and the validation flag drops to false
    expect(wrapper.find('[data-errors]').text()).not.toBe('0')
    expect(wrapper.find('[data-valid]').text()).toBe('false')
  })

  it('isValidating is true while validation is running', async () => {
  // A promise controller to pause validation mid-flight
  // eslint-disable-next-line ts/no-invalid-void-type
    const { promise: delayPromise, resolve: resolveValidation } = Promise.withResolvers<void>()

    // A spy schema that conforms to StandardSchemaV1 and hangs on validate
    const slowSchema = {
      '~standard': {
        types: { input: {} as any, output: {} as any },
        async validate(value: any) {
          await delayPromise // Freeze here during execution
          return { value }
        },
        ...vendorVersion,
      },
    }

    const { wrapper } = mountForm({
      initialValues: { tags: ['item-a'] },
      schema: slowSchema,
    })

    // Verify it starts as false
    expect(wrapper.find('[data-validating]').text()).toBe('false')

    // Trigger the slot's validate method
    await wrapper.find('#validate').trigger('click')

    await flushPromises()

    // Validation is pending, so isValidating should be true
    expect(wrapper.find('[data-validating]').text()).toBe('true')

    // Release the validation block
    resolveValidation()
    await flushPromises()

    // Validation has completed, so isValidating returns to false
    expect(wrapper.find('[data-validating]').text()).toBe('false')
  })
})
