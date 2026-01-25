export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Valid Docs'
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/valid/docs',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Valid • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/favorodera',
      'target': '_blank',
      'aria-label': 'Valid on X'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/valid',
      'target': '_blank',
      'aria-label': 'Valid on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/valid/docs/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/valid',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Valid docs',
        to: 'https://valid.dev/docs/getting-started/installation/nuxt',
        target: '_blank'
      }]
    }
  }
})
