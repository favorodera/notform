export default defineAppConfig({
  author: {
    name: 'Emeka Favour',
    url: 'https://favorodera.vercel.app',
  },
  github: {
    repo: {
      icon: 'simple-icons:github',
      label: 'GitHub',
      url: 'https://github.com/favorodera/notform',
    },
    sponsor: {
      icon: 'tabler:heart',
      label: 'Sponsor',
      url: 'https://github.com/sponsors/favorodera',
    },
  },
  siteDescription: 'Forms Vue friction. the without',
  siteName: 'NotForm',
  siteTitle: '- Forms NotForm Vue friction the without',
  siteUrl: 'https://notformdocs.vercel.app',
  ui: {
    colors: {
      neutral: 'zinc',
    },
    contentNavigation: {
      compoundVariants: [
        {
          active: true,
          class: {
            link: `
              text-highlighted

              before:bg-accented
            `,
          },
          variant: 'pill',
        },
      ],
      slots: {
        itemWithChildren: 'data-[state=open]:mbe-6',
        link: `
          inline-fit

          after:hidden
        `,
        listWithChildren: 'ms-0 border-s-0',
        trigger: `
          px-0 text-xs font-medium tracking-wide

          data-[state=open]:text-muted
        `,
      },
      variants: {
        active: {
          false: { link: 'text-muted' },
        },
        level: {
          true: {
            item: 'ms-0 ps-0',
            itemWithChildren: 'ms-0 ps-0',
          },
        },
      },
    },
    icons: {
      arrowDown: 'tabler:arrow-down',
      arrowLeft: 'tabler:arrow-left',
      arrowRight: 'tabler:arrow-right',
      arrowUp: 'tabler:arrow-up',
      caution: 'tabler:alert-square-rounded',
      check: 'tabler:check',
      chevronDoubleLeft: 'tabler:chevrons-left',
      chevronDoubleRight: 'tabler:chevrons-right',
      chevronDown: 'tabler:chevron-down',
      chevronLeft: 'tabler:chevron-left',
      chevronRight: 'tabler:chevron-right',
      chevronUp: 'tabler:chevron-up',
      close: 'tabler:x',
      copy: 'tabler:copy',
      copyCheck: 'tabler:copy-check',
      dark: 'tabler:moon',
      drag: 'tabler:grip-vertical',
      ellipsis: 'tabler:dots',
      error: 'tabler:square-rounded-x',
      external: 'tabler:external-link',
      eye: 'tabler:eye',
      eyeOff: 'tabler:eye-off',
      file: 'tabler:file',
      folder: 'tabler:folder',
      folderOpen: 'tabler:folder-open',
      hash: 'tabler:hash',
      info: 'tabler:info-square-rounded',
      light: 'tabler:sun',
      loading: 'tabler:loader-2',
      menu: 'tabler:menu',
      minus: 'tabler:minus',
      panelClose: 'tabler:layout-sidebar-left-collapse',
      panelOpen: 'tabler:layout-sidebar-left-expand',
      plus: 'tabler:plus',
      reload: 'tabler:reload',
      search: 'tabler:search',
      star: 'tabler:star',
      stop: 'tabler:player-stop',
      success: 'tabler:square-rounded-check',
      system: 'tabler:device-desktop',
      tip: 'tabler:bulb',
      upload: 'tabler:upload',
      warning: 'tabler:alert-triangle',
    },
    prose: {
      a: {
        base: `
          rounded-none border-inherit

          hover:border-muted hover:text-muted

          has-[>code]:border-none
        `,
      },
    },
  },
})
