---
"notform": patch
---

- **NotMessage**:
  - Add `as` prop to specify custom HTML tag (defaults to `span`, e.g., `as="p"`, `as="div"`)
  - Support attribute forwarding: attributes like `class`, `role`, `title` are now applied to the root element
  - When using default slot, attributes are passed via `attributes` prop for manual binding with `v-bind`
  - Improves flexibility for styling and accessibility customization
