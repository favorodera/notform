---
"notform": patch
---

refactor: change setState validation from form-level to field-level

Refactored setState to use field-level validation instead of form-level validation for better performance and more precise error feedback.

- Changed from validating entire form to validating only changed fields
- Improves performance significantly for large forms
- Provides more precise validation feedback scoped to modified fields
- Maintains existing validation modes (lazy/eager) behavior
