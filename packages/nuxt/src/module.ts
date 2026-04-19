import { addComponent, addImports, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

/** Nuxt module options for `notform` */
export interface NotFormModuleOptions {}

const components = [
  'NotForm',
  'NotField',
  'NotArrayField',
  'NotMessage',
] as const

const composables = [
  'useNotForm',
] as const

export default defineNuxtModule<NotFormModuleOptions>({
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

    // Inject notform types into the consuming project
    addTypeTemplate({
      filename: 'types/notform.d.ts',
      getContents: () => 'export type * from \'notform\'',
      write: true,
    })
  },

})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    notform?: NotFormModuleOptions
  }
  interface NuxtOptions {
    notform?: NotFormModuleOptions
  }
}
