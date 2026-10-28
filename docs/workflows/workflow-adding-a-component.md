# Workflow: Adding a Component

1. Pick the level per [structure.md](../structure.md): atom (no state, no domain), molecule (composes atoms), organism (connects the store), template (page skeleton).
2. Decide server vs client: no hooks and no browser APIs → keep it hook-free so server pages can render it; store access → `"use client"` organism; a browser API with no app state → a client molecule like `Dialog`.
3. Copy [template-component.md](../templates/template-component.md).
4. Text, units and colours per [coding-conventions.md](../coding-conventions.md) and [styling.md](../styling.md).
5. Any logic beyond formatting → a pure function in `features/*` with a unit test.
6. Check the accessibility list in [components.md](../components.md) and run [workflow-running-tests.md](workflow-running-tests.md).
