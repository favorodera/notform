import { version } from '../../packages/vue/package.json'

const owner = 'favorodera'
const repo = 'notform'
const repositoryUrl = `https://github.com/${owner}/${repo}`

const name = 'NotForm'
const tagline = 'Vue forms without the friction'

export const site = {
  author: {
    name: 'Favour Emeka',
    twitter: '@favorodera',
    url: 'https://favorodera.dev',
  },
  description: `${tagline}.`,
  github: {
    api: `https://api.github.com/repos/${owner}/${repo}`,
    discussions: `${repositoryUrl}/discussions`,
    issues: `${repositoryUrl}/issues`,
    owner,
    releases: `${repositoryUrl}/releases`,
    repo,
    sponsor: `https://github.com/sponsors/${owner}`,
    url: repositoryUrl,
  },
  keywords: [
    'Vue forms',
    'Nuxt forms',
    'Nuxt form library',
    'Vue form library',
  ],
  locale: 'en',
  name,
  npm: {
    nuxt: 'https://www.npmjs.com/package/@notform/nuxt',
    vue: 'https://www.npmjs.com/package/notform',
  },
  title: `${name} - ${tagline}`,
  url: 'https://notform.favorodera.dev',
  version,
}
