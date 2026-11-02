/* eslint-disable node/no-unsupported-features/node-builtins, unicorn/no-global-object-property-assignment */
export default defineNuxtPlugin(() => {
  const NativeWorker = Worker

  class ReplWorker extends NativeWorker {
    constructor(scriptURL: string | URL, options?: WorkerOptions) {
      const url = scriptURL.toString()

      if (url.includes('vue.worker')) {
        super('/playground/repl-workers/vue.worker.js', options)
        return
      }

      if (url.includes('editor.worker')) {
        super('/playground/repl-workers/editor.worker.js', options)
        return
      }

      super(scriptURL, options)
    }
  }

  globalThis.Worker = ReplWorker
})
