# NotForm Agent Skills

Portable Agent Skills for using NotForm in a local Vue or Nuxt application. These skills are designed for skills.sh-compatible agents and other Agent Skills implementations. They teach an agent how to install, configure, build, debug, and explain NotForm to an application developer.

## Skill map

| Skill | Use it for |
| --- | --- |
| [`composables`](./composables/SKILL.md) | Schemas, `useNotForm`, values, validation, errors, submit, and reset |
| [`components`](./components/SKILL.md) | `NotForm`, `NotField`, `NotArrayField`, `NotMessage`, slots, and custom inputs |
| [`nuxt`](./nuxt/SKILL.md) | Nuxt setup, auto-imports, SSR, and documentation discovery |
| [`debugging`](./debugging/SKILL.md) | Diagnose validation, submission, reset, arrays, and integration problems |

## Selection guide

- Building a form or using `useNotForm`: `composables`.
- Connecting inputs, messages, custom components, or arrays: `components`.
- Adding NotForm to Nuxt or finding canonical docs: `nuxt`.
- Debugging an application that uses NotForm: `debugging`.

For complete product context, start with the [NotForm LLM index](https://notformdocs.vercel.app/llms.txt), then fetch the relevant raw Markdown page.

Each top-level folder is one discoverable skill and contains its entrypoint at `SKILL.md`.

## Project references

- Documentation: https://notformdocs.vercel.app/
- LLM documentation index: https://notformdocs.vercel.app/llms.txt
- Full LLM documentation: https://notformdocs.vercel.app/llms-full.txt
- Playground: https://notformdocs.vercel.app/playground
