export default defineAppConfig({
  ui: {
    colors: {
      primary: 'forest',
      neutral: 'neutral',
      secondary: 'neutral',
      success: 'forest',
      error: 'red',
      warning: 'amber',
      info: 'sky',
    },
    button: {
      slots: {
        base: 'cursor-pointer active:scale-98',
      },
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted',
      },
    },
    prose: {
      codePreview: {
        slots: {
          code: '[&>div>pre]:rounded-t-none [&>div]:my-0 [&>div>div]:my-0',
        },
      },
    },
  },
  siteUrl: 'https://notformdocs.vercel.app',
  siteName: 'NotForm',
  siteDescription: 'Vue Forms without the friction.',
  siteTitle: 'NotForm - Vue form validator',
  github: {
    url: 'https://github.com/favorodera/notform',
    icon: 'simple-icons:github',
    label: 'GitHub',
  },
  author: {
    name: 'Favour Emeka',
    url: 'https://favorodera.vercel.app',
  },
})
