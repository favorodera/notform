import { addComponent, addImports, createResolver, defineNuxtModule, extendViteConfig } from '@nuxt/kit'

const components = [
  'NotForm',
  'NotField',
  'NotArrayField',
  'NotMessage',
] as const

const composables = [
  'useNotForm',
] as const

export default defineNuxtModule({
  meta: {
    name: 'notform-nuxt',
    configKey: 'notform',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },

  // Module factory
  setup() {
    // Create a resolver
    const { resolve } = createResolver(import.meta.url)

    // Create a resolver for the runtime files
    const componentsRuntime = resolve('./runtime/components')
    const composablesRuntime = resolve('./runtime/composables')

    // Add components
    components.forEach((name) => {
      addComponent({
        name,
        export: name,
        filePath: componentsRuntime,
      })
    })

    // Add composables
    composables.forEach((composable) => {
      addImports({
        name: composable,
        as: composable,
        from: composablesRuntime,
      })
    })

    // Pre-bundle required Vite dependencies for faster dev startup and better HMR
    extendViteConfig((config) => {
      config.optimizeDeps ||= {}
      config.optimizeDeps.include ||= []
    
      config.optimizeDeps.include.push(
        'dequal',
        'dot-prop',
      )
    })
  },

})
