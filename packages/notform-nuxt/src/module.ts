import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

// Re-export core notform for manual imports via the Nuxt entry.
export * from 'notform'

/** Nuxt module options for `notform` */
export interface NotFormModuleOptions {
  /** Enable auto imports for components and composables */
  autoImport?: boolean
}

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

  // Default configuration options of the Nuxt module
  defaults: {
    autoImport: true,
  },

  // Module factory
  setup(options, nuxt) {
    // Create a resolver for the runtime/notform file
    const { resolve } = createResolver(import.meta.url)
    const runtimeExports = resolve('./runtime/notform')

    // Exclude notform package from optimizeDeps
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude || []
    nuxt.options.vite.optimizeDeps.exclude.push('notform')

    // Add components and composables if auto imports is true
    if (options.autoImport) {
      // Add components
      components.forEach((component) => {
        addComponent({
          name: component,
          export: component,
          filePath: runtimeExports,
        })
      })

      // Add composables
      composables.forEach((composable) => {
        addImports({
          name: composable,
          as: composable,
          from: runtimeExports,
        })
      })
    }
  },

}) as NuxtModule<NotFormModuleOptions>

declare module '@nuxt/schema' {
  interface NuxtConfig {
    notform?: NotFormModuleOptions
  }
  interface NuxtOptions {
    notform?: NotFormModuleOptions
  }
}
