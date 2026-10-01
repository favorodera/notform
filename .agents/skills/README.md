# NotForm Agent Skill

A portable Agent Skill for using NotForm in a local Vue or Nuxt application. It's designed for skills.sh-compatible agents and other Agent Skills implementations, and teaches an agent how to install, configure, build, debug, and explain NotForm to an application developer.

NotForm ships as a single skill, `notform`. Its `SKILL.md` is the entry point and routes the agent to one of four reference files, which in turn link to the published documentation.

## Layout

```text
notform/
  SKILL.md
  references/
    components.md
    composables.md
    debugging.md
    nuxt.md
```

## Reference map

| Reference | Use it for |
| --- | --- |
| [`composables.md`](./notform/references/composables.md) | Schemas, `useNotForm`, values, validation, errors, submit, and reset |
| [`components.md`](./notform/references/components.md) | `NotForm`, `NotField`, `NotArrayField`, `NotMessage`, slots, custom inputs, and arrays |
| [`nuxt.md`](./notform/references/nuxt.md) | Nuxt setup, auto-imports, SSR, and documentation discovery |
| [`debugging.md`](./notform/references/debugging.md) | Diagnosing validation, submission, reset, array, and integration problems |

## Selection guide

- Building a form or using `useNotForm`: `composables.md`.
- Connecting inputs, messages, custom components, or arrays: `components.md`.
- Adding NotForm to Nuxt or finding canonical docs: `nuxt.md`.
- Debugging an application that uses NotForm: `debugging.md`.

Most tasks need more than one. For complete product context, start with the [NotForm LLM index](https://notformdocs.vercel.app/llms.txt), then fetch the relevant raw Markdown page.

## Project references

- Documentation: https://notformdocs.vercel.app/docs/working-with-ai/agent-skills
- LLM documentation index: https://notformdocs.vercel.app/llms.txt
- Full LLM documentation: https://notformdocs.vercel.app/llms-full.txt
- Playground: https://notformdocs.vercel.app/playground
