# Components

## Rules

- **Critical:** type every prop inline or with a named `type`; no `any`.
- One component per file; small private helpers may live in the same file when only it uses them (`StepControl`, `MenuAction`).
- Pass `locale` / `dict` as props to hook-free components; call `useLocale()` only in client components.
- Every image has `width` / `height` and an `alt` from the dictionary (decorative: `alt=""`).
- Buttons get `type="button"` unless they submit; icon-only buttons get `aria-label`.

## Patterns to reuse

| Need | Use |
|---|---|
| Modal | `molecules/Dialog` (native `<dialog>`, `showModal` on mount, closes on Esc / backdrop). Mount it only while open via `DialogHost`. |
| Dropdown menu | `popover="auto"` + `popoverTarget` (see `AppMenu`); call `hidePopover()` after an action. Position with `fixed` + `top-*`/`right-*` and reset the UA popover box with `m-0 left-auto bottom-auto`. |
| Step navigation | `StepSelector` with `navigation: { mode: "link", hrefFor }` (server) or `{ mode: "state", onSelect }` (client). |
| Button look on a link | `buttonClass(variant)` from `atoms/Button` |
| Form field | `atoms/TextField` (label, hint, error with `aria-describedby`) |
| Structured data | `atoms/JsonLd` |

## Forms

No forms library (`decisions.md`). Follow `BabyFormDialog`:

- Uncontrolled inputs with `defaultValue`; read them with `new FormData(event.currentTarget)` on submit; `<form noValidate>`.
- Validate with a pure function in `features/<feature>/` that returns `{ ok: true, <validated data> } | { ok: false, errors }` (e.g. `BabyFormResult`), errors as dictionary keys; unit-test every branch (`babyForm.test.ts`).
- Show errors through `TextField` `error`; clear a field's error in the form's `onChange` when the user edits that field.
- Dates use `<input type="date" max={today}>` and are validated again in the pure function.

## Accessibility checklist

- Labels on every input; errors announced via `aria-describedby` + `aria-invalid`.
- Current step uses `aria-current="step"`; today's step adds "(today)" to its label.
- Radio groups are real `<input type="radio">` inside `<fieldset>` + `<legend>`.
- Visible focus (`focus-visible:outline-brand`).
