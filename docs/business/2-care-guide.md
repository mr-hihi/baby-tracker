# 2. Care Guide

> One file = one domain. Every section below belongs to the domain "Care Guide".

## 2.1 Overview

Each week, month and age guide page tells parents what to supplement, what to eat and what to avoid at that step — with a reference dose and the source of the advice. The content is a static table, identical for every baby and prerendered into the page; nothing is stored. Vaccines are not part of this domain — see [3. Vaccination Record](3-vaccination.md). Code lives in `src/features/care/`.

- Persona: parents-to-be and parents (end users), reading.
- Depends on: [1. Baby Progress](1-baby-progress.md) (guide steps, guide pages), Locale (texts).
- Content is reference advice, not a prescription; every page keeps the disclaimer.

## 2.2 Care item

### Data model

| Field | Type | Description |
|---|---|---|
| `id` | string (kebab-case, unique) | Stable key, e.g. `folic-acid` |
| `category` | `"supplement"` \| `"eat"` \| `"avoid"` | Group on the page |
| `subject` | `"mother"` \| `"baby"` | Who the advice is for |
| `stepKind` | `"week"` \| `"month"` \| `"age"` | Step kind the item belongs to |
| `from` | integer | First step the item applies to |
| `to` | integer | Last step the item applies to |
| `source` | `"moh"` \| `"who"` | Vietnam Ministry of Health or World Health Organization |
| `title` | text vi / en | Short name, e.g. "Folic acid" |
| `detail` | text vi / en | Advice with the reference dose, e.g. "400 mcg a day" |

Texts live in the dictionaries under `careItems[id]`; the `en` dictionary type forces every id to exist in both languages.

### Allowed values per step kind

| Step kind | `from`–`to` bounds | Allowed `subject` | Default subject |
|---|---|---|---|
| `week` | 1–40 | `mother` | `mother` |
| `month` | 0–24 | `baby`, `mother` (breastfeeding mother) | `baby` |
| `age` | 2–18 | `baby` | `baby` |

- An item belongs to one step kind. Advice that runs across two step kinds (e.g. no alcohol in pregnancy and while breastfeeding) is two items.
- Ages 0 and 1 have no items: those years are covered by months 0–24.

## 2.3 Display on a guide page

For the page of step `P` (kind `S`, value `v`):

1. Applicable items: `stepKind = S` and `from ≤ v ≤ to`.
2. Group by category, in this order: Supplements, What to eat, What to avoid.
3. Inside a group: items with `from = v` first, each with the "New" badge, then the others; ties keep the content table order.
4. Each item shows its title, detail, source label, and a subject label when `subject` differs from the step kind's default subject.
5. A group with no applicable item is hidden. The whole section is hidden when all three groups are empty.

- The section sits below the growth card, before the Vaccination section.
- Pages: week 1–40, month 0–24, age 2–18. Age 0 and 1 pages show no care section; their "Month by month" row leads to the month pages.
- The content is the same with or without a saved baby and is present in the prerendered HTML.

### Visible text

| Key | vi | en |
|---|---|---|
| Section heading | Chăm sóc | Care |
| Group `supplement` | Bổ sung | Supplements |
| Group `eat` | Nên ăn | What to eat |
| Group `avoid` | Nên kiêng | What to avoid |
| Badge on a week page | Mới tuần này | New this week |
| Badge on a month page | Mới tháng này | New this month |
| Badge on an age page | Mới năm nay | New this year |
| Source `moh` | Bộ Y tế | Ministry of Health |
| Source `who` | WHO | WHO |
| Subject `mother` | Cho mẹ | For mum |
| Subject `baby` | Cho bé | For baby |

## 2.4 Initial content

Draft reference content. The content owner verifies every dose and range against the current Ministry of Health and WHO guidance before release.

| `id` | Category | Subject | Step kind | Range | Source | Detail (en) |
|---|---|---|---|---|---|---|
| `folic-acid` | supplement | mother | week | 1–12 | who | Folic acid 400 mcg a day |
| `iron-folic-acid` | supplement | mother | week | 13–40 | who | Iron 30–60 mg and folic acid 400 mcg a day |
| `calcium` | supplement | mother | week | 20–40 | who | Calcium 1,500–2,000 mg a day, split, taken apart from iron |
| `varied-meals` | eat | mother | week | 1–40 | moh | Varied meals: rice, meat, fish, eggs, beans, vegetables, fruit |
| `small-meals` | eat | mother | week | 5–13 | moh | Small, frequent meals when nauseous; plenty of water |
| `fibre-water` | eat | mother | week | 14–40 | moh | Fibre and 2 litres of water a day against constipation |
| `no-alcohol-smoking` | avoid | mother | week | 1–40 | who | No alcohol, no smoking, no second-hand smoke |
| `no-raw-food` | avoid | mother | week | 1–40 | moh | No raw or undercooked meat, fish, eggs; no unpasteurised milk or cheese |
| `limit-caffeine` | avoid | mother | week | 1–40 | who | Caffeine under 300 mg a day |
| `mother-vitamin-a` | supplement | mother | month | 0–1 | moh | Vitamin A 200,000 IU once within the first month after birth |
| `mother-iron` | supplement | mother | month | 0–1 | moh | Iron 30–60 mg and folic acid 400 mcg a day until one month after birth |
| `mother-no-alcohol` | avoid | mother | month | 0–6 | who | No alcohol while breastfeeding |
| `exclusive-breastfeeding` | eat | baby | month | 0–5 | who | Breast milk only, on demand, day and night |
| `no-water-before-6m` | avoid | baby | month | 0–5 | who | No water, juice or other food before 6 months |
| `start-solids` | eat | baby | month | 6–8 | who | Start smooth porridge 2–3 times a day; keep breastfeeding |
| `mashed-meals` | eat | baby | month | 9–11 | who | 3–4 meals of mashed or chopped food a day |
| `family-food` | eat | baby | month | 12–24 | who | Family food 3–4 times a day plus 1–2 snacks; breastfeed up to 24 months |
| `baby-vitamin-a` | supplement | baby | month | 6–24 | moh | Vitamin A on campaign days (1 June, 1 December): 100,000 IU at 6–11 months, 200,000 IU from 12 months |
| `no-salt-sugar` | avoid | baby | month | 6–24 | who | No added salt or sugar; no sweet drinks |
| `vitamin-a-to-36m` | supplement | baby | age | 2–2 | moh | Vitamin A 200,000 IU every 6 months until 36 months |
| `varied-child-diet` | eat | baby | age | 2–18 | moh | Varied meals with vegetables and fruit every day |
| `no-sugary-drinks` | avoid | baby | age | 2–18 | who | Limit sugary drinks and snacks |

## 2.5 Content rules

Checked by unit tests on the content table:

- `id` is unique.
- `from ≤ to`, and both lie inside the step-kind bounds in 2.2.
- `subject` is allowed for the step kind.
- Every item has a `source`.
- Every `supplement` detail states an amount, a unit and a frequency.

---

## Routes

No route of its own. The section renders inside the guide pages of [1. Baby Progress](1-baby-progress.md): `/{locale}/week/{1..40}/`, `/{locale}/month/{0..24}/`, `/{locale}/age/{2..18}/`.

## Permissions

None. The app has no accounts; the content is public.
