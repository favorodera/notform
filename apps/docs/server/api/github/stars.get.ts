import type { H3Event } from 'h3'

const cachedGithubStars = defineCachedFunction(async (_event: H3Event) => {
  const response = await fetch(`https://api.github.com/repos/favorodera/notform`)
  const data = await response.json()

  return data.stargazers_count
}, {
  getKey: (_event: H3Event) => 'githubStarsGet',
  maxAge: 60 * 60,
  name: 'ghStars',
})

export default defineEventHandler(async (event) => {
  const stars = await cachedGithubStars(event)

  return stars ?? 0
})
