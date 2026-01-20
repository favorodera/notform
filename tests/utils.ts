import { defineComponent } from 'vue'
import { render } from 'vitest-browser-vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withSetup<T extends Record<string, any>>(setup: () => T) {
  let context: T | undefined
  
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(template: string, components?: Record<string, any>) {
      const rendered = render(defineComponent({
        setup() {
          context = setup()
          return context
        },
        template,
        components,
      }))
      
      if (context === undefined) {
        throw new Error('withSetup: Setup was not called.')
      }
      
      return { ...context, ...rendered }
    },
  }
}
