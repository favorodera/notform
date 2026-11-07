<h1 align="center">
  <img alt="NotForm Logo" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" style="color:transparent" src="https://notformdocs.vercel.app/favicon.svg">
  </br>
  NotForm
</h1>

<p align="center">
  Vue Forms Without the Friction.
</p>

NotForm keeps your form's values, errors and field state in one place and leaves the markup to you. Describe the data with the schema library you already use, bind inputs, and read form states wherever you need them.

- **Bring your own schema.** Zod, Valibot, ArkType, or anything else that implements [Standard Schema](https://standardschema.dev). No adapters.
- **Typed safe.** Field paths, values, and method signatures are checked against your schema.
- **Dynamic arrays that behave.** Add, remove or reorder rows and each row keeps its touched state and its errors.
- **Safe async validation.** Auto disposal of inflight validation results making sure stale results cannot overwrite newer form state.
- **No UI imposed.** The components render a native `<form>` and, for errors, a `<span>` you can change. Everything else is yours.

See the [Documentation](https://notformdocs.vercel.app/) for validation, submission, and array-field guides.

## License

MIT © [Favour Emeka](https://github.com/favorodera)
