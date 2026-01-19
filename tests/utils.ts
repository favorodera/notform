import { defineComponent, h } from 'vue'
import { render } from 'vitest-browser-vue'

/**
 * Helper function to run code inside setup
 *
 * @param composable - The composable function to run
 * @returns The result of the composable function
 */
export function withSetup<T>(composable: () => T): { result: T } {
  let result: T | undefined

  const component = defineComponent({
    setup() {
      result = composable()
      return () => h('div')
    },
  })

  render(component)

  if (result === undefined) {
    throw new Error('withSetup: Composable did not return a result or setup was not called.')
  }

  return { result }
}
