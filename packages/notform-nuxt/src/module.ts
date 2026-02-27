import { addComponent, addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

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
    // Create a resolver for the runtime/notform file
    const { resolve } = createResolver(import.meta.url)
    const runtimeExports = resolve('./runtime/notform')

    // Exclude notform package from optimizeDeps
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude || []
    nuxt.options.vite.optimizeDeps.exclude.push('notform')

    // Add components and composables
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
