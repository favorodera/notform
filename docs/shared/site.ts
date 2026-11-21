import { version } from '../../packages/vue/package.json'

const owner = 'favorodera'
const repo = 'notform'
const repositoryUrl = `https://github.com/${owner}/${repo}`
const releasesUrl = `${repositoryUrl}/releases`
const sponsorUrl = `https://github.com/sponsors/${owner}`

const name = 'NotForm'
const tagline = 'Vue forms without the friction'

/**
 * A destination the site links to from more than one place.
 * @remarks
 * Keeping each destination here means the header, the mobile menu, content
 * search, and calls to action always agree on its label and target.
 */
export interface SiteLink {
  /**
   * Route prefix that keeps the link highlighted on nested routes.
   * @remarks
   * Matched against whole path segments, so `/docs` is active on
   * `/docs/guides/validation` but not on `/docs-archive`. Leave it out for
   * links that should never appear active, such as external ones.
   */
  activePrefix?: string

  /** One sentence describing the destination. Shown in content search. */
  description?: string

  /** Whether the link leaves the site and should open in a new tab. */
  external?: boolean

  /** Text displayed for the link. */
  label: string

  /** Route path for internal links, or an absolute URL for external ones. */
  to: string
}

/**
 * Every destination the site links to from more than one place, by name.
 * @remarks
 * `satisfies` checks each entry against {@link SiteLink} while keeping the
 * object's keys literal, so `links.docs` autocompletes and `links.nope` is a
 * type error.
 */
const links = {
  docs: {
    activePrefix: '/docs',
    description: 'Guides, references, and recipes for building forms with NotForm.',
    label: 'Documentation',
    to: '/docs/getting-started/introduction',
  },
  github: {
    description: 'Browse the source code, report issues, and join the discussions.',
    external: true,
    label: 'GitHub',
    to: repositoryUrl,
  },
  playground: {
    activePrefix: '/playground',
    description: 'Try NotForm in your browser with a live Vue playground you can share.',
    label: 'Playground',
    to: '/playground',
  },
  releases: {
    description: 'See what changed in every NotForm release.',
    external: true,
    label: 'Releases',
    to: releasesUrl,
  },
  sponsor: {
    description: 'Help fund the ongoing development of NotForm.',
    external: true,
    label: 'Become a sponsor',
    to: sponsorUrl,
  },
} satisfies Record<string, SiteLink>

/**
 * Links shown in the primary navigation, in display order.
 * @remarks
 * Rendered in the center of the header on desktop and at the top of the menu
 * on mobile.
 */
const navigation: readonly SiteLink[] = [
  links.docs,
  links.playground,
  links.releases,
]

/**
 * One-line descriptions for the top-level documentation sections, keyed by the
 * section's route path.
 * @remarks
 * Section titles and their first page come from the content navigation, so
 * renaming or reordering sections in `content/docs` needs no change here. Only
 * the description lives in this map, because the navigation tree does not carry
 * one. A section without an entry is shown without a description.
 */
const docsSectionDescriptions: Readonly<Record<string, string>> = {
  '/docs/ai': 'Work with AI coding assistants using llms.txt, Markdown pages, and an agent skill.',
  '/docs/components': 'Reference for Form, Field, ArrayField, and FieldError.',
  '/docs/composables': 'Reference for useForm: configuration, state, and actions.',
  '/docs/getting-started': 'Install NotForm, build your first form, and learn the ideas behind it.',
  '/docs/guides': 'Bind inputs, validate, show errors, submit, and work with arrays and types.',
  '/docs/integrations': 'Use NotForm with Nuxt UI, ShadcnVue, Vuetify, or your own components.',
  '/docs/migrations': 'Move your forms from NotForm v3 to v4.',
  '/docs/recipes': 'Complete solutions for server errors, async checks, multi-step forms, and more.',
  '/docs/reference': 'Exported types, troubleshooting steps, and answers to common questions.',
}

/**
 * Open Graph image variants generated for every page.
 * @remarks
 * `og` uses the default dimensions. `whatsapp` is a square image for chat apps
 * that crop wide link previews. Pass this as the third argument of
 * `defineOgImage` so every page generates the same set.
 */
const ogImageVariants = [
  { key: 'og' },
  { height: 800, key: 'whatsapp', width: 800 },
]

/**
 * Single source of truth for site-wide facts.
 * @remarks
 * Read it from components, pages, server utilities, and `nuxt.config.ts`
 * instead of repeating a URL, a label, or a locale. It is a plain object with
 * no Nuxt dependency, so it is safe to import on both the client and the
 * server.
 *
 * This is unrelated to Nuxt Site Config's `useSiteConfig()`, which resolves the
 * deployed URL at runtime. `siteConfig` holds the static values that feed it.
 * @example
 * ```ts
 * import { siteConfig } from '#shared/site'
 *
 * const playgroundUrl = `${siteConfig.url}${siteConfig.links.playground.to}`
 * ```
 */
export const siteConfig = {
  /** The person or organization that maintains NotForm. */
  author: {
    name: 'Favour Emeka',
    twitter: '@favorodera',
    url: 'https://favorodera.dev',
  },

  /** Default meta description for pages that do not set their own. */
  description: `${tagline}.`,

  /** Documentation-specific configuration. */
  docs: {
    /** Descriptions for the top-level sections, keyed by route path. */
    sectionDescriptions: docsSectionDescriptions,
  },

  /** GitHub repository, API, and community URLs. */
  github: {
    api: `https://api.github.com/repos/${owner}/${repo}`,
    discussions: `${repositoryUrl}/discussions`,
    issues: `${repositoryUrl}/issues`,
    license: `${repositoryUrl}/blob/main/LICENSE`,
    owner,
    releases: releasesUrl,
    repo,
    sponsor: sponsorUrl,
    url: repositoryUrl,
  },

  /** Keywords for search engines. */
  keywords: [
    'Vue forms',
    'Nuxt forms',
    'Nuxt form library',
    'Vue form library',
  ],

  /** Destinations that appear in more than one place, by name. */
  links,

  /** Language of the site, used for `<html lang>` and the default locale. */
  locale: 'en',

  /** Product name. */
  name,

  /** Links in the primary navigation, in display order. */
  navigation,

  /** Package pages on npm. */
  npm: {
    nuxt: 'https://www.npmjs.com/package/@notform/nuxt',
    vue: 'https://www.npmjs.com/package/notform',
  },

  /** Open Graph image variants to generate for every page. */
  ogImageVariants,

  /** Default page title and social card title. */
  title: `${name} - ${tagline}`,

  /** Production origin, without a trailing slash. */
  url: 'https://notform.favorodera.dev',

  /** Version of the `notform` package, shown next to the logo. */
  version,
}
