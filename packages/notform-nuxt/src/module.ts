import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export type * from 'notform'

/** Nuxt module options for `notform` */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
