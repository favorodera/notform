import type { ArrayFieldInstance } from '../types/array-field'
import type { FieldConfig, FieldInstance } from '../types/field'
import type { FieldHost, FieldNode, FieldScope } from '../types/internal'
import { joinPath } from '../utils/path'
import { createArrayField } from './create-array-field'
import { createField } from './create-field'

/**
 * Creates a scope: the place that creates fields under a base path and keeps
 * one instance per relative path.
 *
 * Caching is what gives fields a stable identity. A template may call
 * `form.field('name')` on every render and always gets the same field, so its
 * id, touched state and pending validation survive re-renders.
 * @param host The form the fields belong to.
 * @param getBasePath Returns the base path. The form root uses `() => ''`; an array item
 * uses its own current path, so nested fields follow the item when it moves.
 * @returns The scope. After `dispose()`, fields it still hands out are inert.
 */
export function createFieldScope(host: FieldHost, getBasePath: () => string): FieldScope {
  const nodes = new Map<string, FieldNode<unknown>>()

  let isDisposed = false

  function field(path: string, config?: FieldConfig): FieldInstance<unknown> {
    const key = `field:${path}`
    let node = nodes.get(key)

    if (!node) {
      node = createField<unknown>(host, {
        config,
        getPath: () => {
          return joinPath(getBasePath(), path)
        },
      })
      nodes.set(key, node)

      // a stale handle (e.g. a removed array item) must not get live fields
      if (isDisposed) {
        node.dispose()
      }
    }

    return node.instance as FieldInstance<unknown>
  }

  function arrayField(path: string, config?: FieldConfig): ArrayFieldInstance<unknown> {
    const key = `array:${path}`
    let node = nodes.get(key)

    if (!node) {
      node = createArrayField<unknown>(host, {
        config,
        createScope: (getItemPath) => {
          return createFieldScope(host, getItemPath)
        },
        getPath: () => {
          return joinPath(getBasePath(), path)
        },
      })
      nodes.set(key, node)

      if (isDisposed) {
        node.dispose()
      }
    }

    return node.instance as ArrayFieldInstance<unknown>
  }

  function dispose(): void {
    isDisposed = true

    for (const node of nodes.values()) {
      node.dispose()
    }

    nodes.clear()
  }

  return { arrayField, dispose, field }
}
