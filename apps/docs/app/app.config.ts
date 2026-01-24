export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: 'Valid',
      description: 'Valid Vue Forms',
      ogImageColor: 'dark',
    },
    theme: {
      customizable: false,
      color: 'green',
      radius: 1,
    },
    header: {
      title: 'Valid',
      showTitle: true,
      darkModeToggle: true,
      languageSwitcher: {
        enable: false,
        triggerType: 'icon',
        dropdownType: 'select',
      },
      logo: {
        light: '/logo.svg',
        dark: '/logo-dark.svg',
      },
      nav: [],
      links: [{
        icon: 'lucide:github',
        to: 'https://github.com/favorodera/valid',
        target: '_blank',
      }],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    footer: {
      credits: 'Copyright © 2024',
      links: [
        {
          icon: 'lucide:github',
          to: 'https://github.com/favorodera/valid',
          target: '_blank',
        },
        {
          icon: 'lucide:twitter',
          to: 'https://x.com/favorodera',
          target: '_blank',
        },
      ],
    },
    toc: {
      enable: true,
      enableInMobile: true,
      links: [{
        title: 'Star on GitHub',
        icon: 'lucide:star',
        to: 'https://github.com/favorodera/valid',
        target: '_blank',
      }, {
        title: 'Create Issues',
        icon: 'lucide:circle-dot',
        to: 'https://github.com/favorodera/valid/issues',
        target: '_blank',
      }],
    },
    search: {
      enable: true,
      inAside: false,
      style: 'button',
    },
  },
})
