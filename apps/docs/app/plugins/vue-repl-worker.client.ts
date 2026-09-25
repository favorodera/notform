export default defineNuxtPlugin(() => {
  const NativeWorker = Worker

  class ReplWorker extends NativeWorker {
    constructor(scriptURL: string | URL, options?: WorkerOptions) {
      const url = scriptURL.toString()

      if (url.includes('vue.worker')) {
        super('/vue-repl-workers/vue.worker.js', options)
        return
      }

      if (url.includes('editor.worker')) {
        super('/vue-repl-workers/editor.worker.js', options)
        return
      }

      super(scriptURL, options)
    }
  }

  // eslint-disable-next-line unicorn/no-global-object-property-assignment
  globalThis.Worker = ReplWorker 
})