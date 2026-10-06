import { createApp } from 'vue'

/**
 * Runs a composable in a headless component so lifecycle and injection APIs work.
 * @template TResult Composable's return value.
 * @param composable Function to run inside `setup()`.
 * @returns The composable result and app; unmount the app during cleanup.
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
