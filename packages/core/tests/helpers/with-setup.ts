import { createApp } from 'vue'

/**
 * Runs `composable` inside a real (but otherwise empty) component instance,
 * so lifecycle hooks like `onMounted`/`onUnmounted` and `provide`/`inject`
 * behave exactly as they would in a real `<script setup>` — without paying
 * for a template, a render, or any DOM beyond an empty mount target.
 *
 * `useNotField` calls `onMounted`/`onUnmounted` internally regardless of
 * whether it's used inside a real component, so calling it bare in a test
 * triggers Vue's "no active component instance" dev warning and its
 * `onMount` logic never actually runs. This gives it a genuine instance to
 * run in, cheaply, so tests can call `field.events.onBlur()` etc. directly
 * without mounting a template or touching the DOM at all.
 * @template TResult Composable's return value.
 * @param composable Function to run inside `setup()`.
 * @returns The composable's result and the created app, for cleanup via `app.unmount()`.
 */
export function withSetup<TResult>(composable: () => TResult): { app: ReturnType<typeof createApp>, result: TResult } {
  let result!: TResult

  const app = createApp({
    setup() {
      result = composable()
    },
  })

  app.mount(document.createElement('div'))

  return { app, result }
}
