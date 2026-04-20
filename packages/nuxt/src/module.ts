import { addComponent, addImports, addTemplate, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

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
  setup(_options, nuxt) {
    // Create a resolver
    const { resolve } = createResolver(import.meta.url)

    // Create a resolver for the runtime files
    const componentsRuntime = resolve('./runtime/components')
    const composablesRuntime = resolve('./runtime/composables')

    // Exclude notform package from optimizeDeps
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude ||= []
    if (!nuxt.options.vite.optimizeDeps.exclude.includes('notform')) {
      nuxt.options.vite.optimizeDeps.exclude.push('notform')
    }

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

    // Generate virtual module
    const template = addTemplate({
      filename: 'notform.mjs',
      getContents: () => 'export * from \'notform\'',
      write: true,
    })

    // Register notform alias
    nuxt.options.alias['#notform'] = template.dst

    // Tell TypeScript about the alias
    addTypeTemplate({
      filename: 'types/notform.d.ts',
      getContents: () => `
      declare module '#notform' {
        export type * from 'notform'
      }
    `,
    })
  },

})
