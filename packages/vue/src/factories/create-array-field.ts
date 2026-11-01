import { klona } from 'klona'
import { computed, reactive, shallowRef, toRaw, triggerRef } from 'vue'
import type { ArrayFieldInstance, ArrayItemInstance } from '../types/array-field'
import type { ArrayFieldOptions, FieldHost, FieldNode } from '../types/internal'
import {
  clampIndex,
  createDiscardMapper,
  createInsertMapper,
  createMoveMapper,
  createRemoveMapper,
  createSwapMapper,
  isIndexInRange,
  moveListItem,
  swapListItems,
} from '../utils/array'
import { createFieldId } from '../utils/id'
import { joinPath } from '../utils/path'
import { createFieldState } from './create-field'

/**
 * Creates an array field: a field for the array itself, plus one stable identity
 * per item and the mutations that keep values, ids and errors in step.
 *
 * Bookkeeping lives in one place: `ids`, a list parallel to the array.
 * - Every mutation edits the array, `ids` and the form's errors together.
 * - If the array is changed behind our back, `ids` is reconciled by length the next
 * time it is read (new ids at the end, extra ids dropped). On form reset all ids are renewed.
 * @template TItem - Type of one array item.
 * @param host The form the field belongs to.
 * @param options Path source, behavior and the scope factory for nested fields.
 * @returns The array field instance and its teardown.
 * @remarks Internal. Use `form.arrayField(path)`, which caches the result.
 */
export function createArrayField<TItem>(host: FieldHost, options: ArrayFieldOptions): FieldNode<ArrayFieldInstance<TItem>> {
  const base = createFieldState<TItem[]>(host, {
    config: options.config,
    getPath: options.getPath,
    id: createFieldId('array-field'),
  })
  const arrayPath = base.parts.path

  /** One id per array item, same order as the array. Mutated in place; `triggerRef` announces changes. */
  const ids = shallowRef<symbol[]>([])

  /** Item fields by id, created on demand. */
  const itemNodes = new Map<symbol, FieldNode<ArrayItemInstance<TItem>>>()

  /** The form's reset count when `ids` was last in sync. */
  let seenResetCount = host.getResetCount()

  /**
   * Reads the array this field points at.
   * @returns The reactive array, or `undefined` if the value is missing or not an array.
   */
  function readArray(): undefined | unknown[] {
    const value = host.getValue(arrayPath.value)

    return Array.isArray(value) ? value : undefined
  }

  /**
   * Reads the array, creating an empty one if the value is missing.
   * @returns The reactive array.
   * @throws If an array cannot be created at the path.
   */
  function ensureArray(): unknown[] {
    const existing = readArray()

    if (existing) {
      return existing
    }

    host.setValue(arrayPath.value, [])

    const created = readArray()

    if (!created) {
      throw new TypeError(`[notform] Cannot create an array at "${arrayPath.value}"`)
    }

    return created
  }

  /**
   * Tears down item fields whose ids left the list.
   * @param removedIds The ids that were removed.
   * @param isDeferred Run the teardown in a microtask. Needed when called while a computed is
   * evaluating, because teardown writes reactive state (the touched set).
   */
  function releaseItems(removedIds: symbol[], isDeferred: boolean): void {
    for (const removedId of removedIds) {
      const node = itemNodes.get(removedId)

      if (!node) {
        continue
      }

      itemNodes.delete(removedId)

      if (isDeferred) {
        queueMicrotask(node.dispose)
      } else {
        node.dispose()
      }
    }
  }

  /**
   * Brings `ids` in line with the array, then returns it.
   * @returns The id list (same length as the array).
   */
  function syncIds(): symbol[] {
    const list = ids.value
    const resetCount = host.getResetCount()

    if (resetCount !== seenResetCount) {
      seenResetCount = resetCount
      releaseItems(list.splice(0), true)
    }

    const length = readArray()?.length ?? 0

    while (list.length < length) {
      list.push(createFieldId('array-item'))
    }

    if (list.length > length) {
      releaseItems(list.splice(length), true)
    }

    return list
  }

  /** Announces a finished mutation: refreshes `items` and validates per the field's config. */
  function commit(): void {
    triggerRef(ids)
    base.parts.events.onChange()
  }

  function insert(index: number, value: TItem): void {
    const list = syncIds()
    const array = ensureArray()
    const at = clampIndex(index, list.length)

    // ids first: the array's length then already matches when anything reads it
    list.splice(at, 0, createFieldId('array-item'))
    array.splice(at, 0, cloneValue(value))

    host.remapArrayErrors(arrayPath.value, createInsertMapper(at))
    commit()
  }

  function append(value: TItem): void {
    insert(syncIds().length, value)
  }

  function prepend(value: TItem): void {
    insert(0, value)
  }

  function remove(index: number): void {
    const list = syncIds()

    if (!isIndexInRange(index, list.length)) {
      return
    }

    releaseItems(list.splice(index, 1), false)
    ensureArray().splice(index, 1)

    host.remapArrayErrors(arrayPath.value, createRemoveMapper(index))
    commit()
  }

  function move(from: number, to: number): void {
    const list = syncIds()

    if (from === to || !isIndexInRange(from, list.length) || !isIndexInRange(to, list.length)) {
      return
    }

    moveListItem(list, from, to)
    moveListItem(ensureArray(), from, to)

    host.remapArrayErrors(arrayPath.value, createMoveMapper(from, to))
    commit()
  }

  function swap(indexA: number, indexB: number): void {
    const list = syncIds()

    if (indexA === indexB || !isIndexInRange(indexA, list.length) || !isIndexInRange(indexB, list.length)) {
      return
    }

    swapListItems(list, indexA, indexB)
    swapListItems(ensureArray(), indexA, indexB)

    host.remapArrayErrors(arrayPath.value, createSwapMapper(indexA, indexB))
    commit()
  }

  function update(index: number, value: TItem): void {
    if (!isIndexInRange(index, syncIds().length)) {
      return
    }

    ensureArray()[index] = cloneValue(value)

    host.remapArrayErrors(arrayPath.value, createDiscardMapper(index))
    commit()
  }

  /**
   * Creates the field of one array item.
   * @param id The item's id.
   * @returns The item instance and its teardown.
   */
  function createItemNode(id: symbol): FieldNode<ArrayItemInstance<TItem>> {
    let lastIndex = ids.value.indexOf(id)

    /** Position of the item. Keeps its last value once the item is gone, so its path never turns into `-1`. */
    const index = computed(() => {
      const currentIndex = syncIds().indexOf(id)

      if (currentIndex !== -1) {
        lastIndex = currentIndex
      }

      return lastIndex
    })

    const getItemPath = (): string => {
      return joinPath(arrayPath.value, index.value)
    }

    const scope = options.createScope(getItemPath)
    const state = createFieldState<TItem>(host, { config: options.config, getPath: getItemPath, id })

    const instance = reactive({
      ...state.parts,
      arrayField: scope.arrayField,
      field: scope.field,
      index,
      moveTo: (to: number): void => {
        move(syncIds().indexOf(id), to)
      },
      remove: (): void => {
        remove(syncIds().indexOf(id))
      },
    }) as unknown as ArrayItemInstance<TItem>

    return {
      dispose: () => {
        scope.dispose()
        state.dispose()
      },
      instance,
    }
  }

  /**
   * Gets or creates the field of the item with this id.
   * @param id The item's id.
   * @returns The cached item instance.
   */
  function getItem(id: symbol): ArrayItemInstance<TItem> {
    let node = itemNodes.get(id)

    if (!node) {
      node = createItemNode(id)
      itemNodes.set(id, node)
    }

    return node.instance
  }

  const items = computed(() => {
    return syncIds().map((id) => {
      return getItem(id)
    })
  })

  function dispose(): void {
    for (const node of itemNodes.values()) {
      node.dispose()
    }

    itemNodes.clear()
    base.dispose()
  }

  return {
    dispose,
    // `reactive()` unwraps the computed values, so consumers write `field.items`, not `field.items.value`
    instance: reactive({
      ...base.parts,
      append,
      insert,
      items,
      move,
      prepend,
      remove,
      swap,
      update,
    }) as unknown as ArrayFieldInstance<TItem>,
  }
}

/**
 * Deep-copies a value on its way in, so two items never share one object.
 * @param value The value to copy.
 * @returns The copy.
 */
function cloneValue(value: unknown): unknown {
  return klona(toRaw(value))
}
