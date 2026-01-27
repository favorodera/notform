import { defineNuxtModule } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

// Module options TypeScript interface definition
export interface ModuleOptions {
  enabled: boolean
}

const module: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'notform-nuxt',
    configKey: 'notform',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    // const resolver = createResolver(import.meta.url)
  },
})

export default module
