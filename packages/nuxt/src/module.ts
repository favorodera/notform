import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'

const components = [
  'NotForm',
  'NotField',
  'NotArrayField',
  'NotMessage',
] as const

const composables = ['useNotForm'] as const

export default defineNuxtModule({
  meta: {
    compatibility: {
      nuxt: '>=4.0.0',
    },
    configKey: 'notform',
    name: 'notform-nuxt',
  },

  // Module factory
  setup() {
    // Create a resolver
    const { resolve } = createResolver(import.meta.url)

    // Create a resolver for the runtime files
    const componentsRuntime = resolve('./runtime/components')
    const composablesRuntime = resolve('./runtime/composables')

    // Add components
    for (const name of components) {
      addComponent({
        export: name,
        filePath: componentsRuntime,
        name,
      })
    }

    // Add composables
    for (const composable of composables) {
      addImports({
        as: composable,
        from: composablesRuntime,
        name: composable,
      })
    }
  },

})
