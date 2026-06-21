export default defineAppConfig({
  author: {
    name: 'Favour Emeka',
    url: 'https://favorodera.vercel.app',
  },
  github: {
    icon: 'simple-icons:github',
    label: 'GitHub',
    url: 'https://github.com/favorodera/notform',
  },
  siteDescription: 'Vue Forms without the friction.',
  siteName: 'NotForm',
  siteTitle: 'NotForm - Vue form validator',
  siteUrl: 'https://notformdocs.vercel.app',
  ui: {
    button: {
      slots: {
        base: 'cursor-pointer active:scale-98',
      },
    },
    colors: {
      error: 'red',
      info: 'sky',
      neutral: 'neutral',
      primary: 'forest',
      secondary: 'neutral',
      success: 'forest',
      warning: 'amber',
    },
    footer: {
      slots: {
        left: 'text-sm text-muted',
        root: 'border-t border-default',
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
})
