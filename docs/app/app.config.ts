export default defineAppConfig({
  ui: {
    colors: {
      error: 'red',
      info: 'blue',
      neutral: 'neutral',
      primary: 'neutral',
      secondary: 'neutral',
      success: 'emerald',
      warning: 'amber',
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
    contentSurround: {
      slots: {
        link: 'grid items-start gap-x-2 gap-y-1 p-3',
        linkDescription: '[grid-area:desc] truncate line-clamp-1',
        linkLeading: 'p-0 bg-transparent ring-0 mb-0 [grid-area:icon] group-hover:bg-transparent group-hover:ring-0',
        linkLeadingIcon: 'group-active:translate-x-0! group-active:-translate-x-0! text-muted',
        linkTitle: 'mb-0 [grid-area:title]',
      },
      variants: {
        direction: {
          left: {
            link: `grid-cols-[auto_1fr] [grid-template-areas:'icon_title'_'icon_desc']`,
          },
          right: {
            link: `grid-cols-[1fr_auto] [grid-template-areas:'title_icon'_'desc_icon']`,
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
    pageBody: {
      base: 'pb-8',
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
