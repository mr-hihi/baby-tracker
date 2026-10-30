# 3. Vaccination Record

> One file = one domain. Every section below belongs to the domain "Vaccination Record".

## 3.1 Overview

Parents see the national Expanded Programme on Immunization (TCMR) schedule — the mother's doses during pregnancy and the baby's doses up to 24 months — and record, per baby, which doses were given and when. Each dose gets a status from the baby's current point; due and overdue doses show on the guide pages, on a dashboard card and on a schedule page. Code lives in `src/features/vaccinations/`.

- Persona: parents-to-be and parents (end users).
- Depends on: [1. Baby Progress](1-baby-progress.md) (current point, order between steps, start date of a step), Babies (selected baby, storage), Locale (texts, date format).
- Only TCMR doses; service vaccines are out of scope.
- State owner: Redux `babies` slice — the dashboard, the guide pages and the schedule page share it.

## 3.2 Vaccine dose (schedule)

Static table, identical for every baby.

### Data model

| Field | Type | Description |
|---|---|---|
| `id` | string (kebab-case, unique) | Stable key, e.g. `dtp-hepb-hib-1`; stored in records, never renamed |
| `vaccine` | string | Vaccine key, e.g. `dtp-hepb-hib`; names live in the dictionaries under `vaccines[vaccine]` |
| `dose` | integer \| `"booster"` | Dose number within the vaccine |
| `subject` | `"mother"` \| `"baby"` | Who receives the dose |
| `stepKind` | `"week"` \| `"month"` | Step kind of the window |
| `from` | integer | First step of the recommended window |
| `to` | integer | Last step of the recommended window, `≥ from` |
| `note` | text vi / en, optional | Timing hint, e.g. "Within 24 hours of birth" |

- Mother doses use `stepKind = week`; baby doses use `stepKind = month`.
- Estimated date of a dose: the start date of its `from` step ([1.5 Start date of a step](1-baby-progress.md#start-date-of-a-step)).

### Schedule

Draft reference content. The content owner verifies every dose and window against the Ministry of Health's current TCMR schedule before release.

| `id` | Vaccine | Dose | Subject | Window | Note (en) |
|---|---|---|---|---|---|
| `tetanus-1` | Tetanus | 1 | mother | weeks 20–32 | First pregnancy; ask the health station if you had doses before |
| `tetanus-2` | Tetanus | 2 | mother | weeks 24–36 | At least 4 weeks after dose 1 and 4 weeks before birth |
| `hepb-birth` | Hepatitis B | 1 | baby | month 0 | Within 24 hours of birth |
| `bcg` | BCG (tuberculosis) | 1 | baby | month 0 | Within the first month |
| `dtp-hepb-hib-1` | DTP-HepB-Hib (5-in-1) | 1 | baby | month 2 | — |
| `opv-1` | Polio, oral | 1 | baby | month 2 | — |
| `dtp-hepb-hib-2` | DTP-HepB-Hib (5-in-1) | 2 | baby | month 3 | — |
| `opv-2` | Polio, oral | 2 | baby | month 3 | — |
| `dtp-hepb-hib-3` | DTP-HepB-Hib (5-in-1) | 3 | baby | month 4 | — |
| `opv-3` | Polio, oral | 3 | baby | month 4 | — |
| `ipv-1` | Polio, injected | 1 | baby | month 5 | — |
| `measles-1` | Measles | 1 | baby | month 9 | — |
| `ipv-2` | Polio, injected | 2 | baby | month 9 | — |
| `je-1` | Japanese encephalitis | 1 | baby | month 12 | — |
| `je-2` | Japanese encephalitis | 2 | baby | month 12 | 1–2 weeks after dose 1 |
| `dtp-booster` | DTP | booster | baby | month 18 | — |
| `mr` | Measles-rubella | 1 | baby | month 18 | — |
| `je-3` | Japanese encephalitis | 3 | baby | month 24 | 1 year after dose 2 |

## 3.3 Vaccination record (per baby)

### Data model

Stored on the baby, inside the existing `baby-tracker:v1` key:

| Field | Type | Description |
|---|---|---|
| `Baby.vaccinations` | `Record<doseId, IsoDate>`, optional | Date each dose was given; absent key = not given |

### Rules

- A dose is recorded with one date. The date is not after today and not before the baby's `lastPeriodDate`.
- Removing a record makes the dose "not given" again; there is no history.
- Saved data without `vaccinations` loads as an empty record — no new key, no migration.
- On read, an entry whose value is not a valid ISO date is dropped; the baby still loads.
- An entry whose dose id is not in the schedule is kept in storage and ignored on screen.
- Editing the baby (name, last period date, gender) keeps `vaccinations` unchanged.
- Changing `lastPeriodDate` moves every status and estimated date; records stay.

## 3.4 Dose status

For a dose, the selected baby and the baby's current point `C` ([1.3](1-baby-progress.md#13-stages)), compared with the order between steps ([1.5](1-baby-progress.md#order-between-steps)):

```
upcoming ──C reaches from──▶ due ──C passes to──▶ overdue
    │                         │                     │
    └──────── record ─────────┴──────── record ─────┴──▶ done
done ──remove record──▶ upcoming | due | overdue (by C)
```

| Status | Rule | Badge (en) |
|---|---|---|
| `done` | record exists | Given on {date} |
| `upcoming` | no record, `C < from` | Around {date} |
| `due` | no record, `from ≤ C ≤ to` | Due now |
| `overdue` | no record, `C > to` | Overdue — catch up |

- Without a selected baby there is no status; doses show as schedule only.
- `{date}` uses the locale date format; "Around {date}" is the estimated date.

## 3.5 Vaccination section on a guide page

On the page of step `P` (week 1–40, month 0–24, age 2–18):

| List | Doses | Rendered |
|---|---|---|
| At this step | Doses whose window contains `P`: `from ≤ P ≤ to` in the order between steps (so `je-3`, month 24, also shows on age 2) | Prerendered for everyone |
| Overdue | Selected baby's doses with status `overdue` and `to < P`; mother doses only on week pages, baby doses only on month and age pages | After hydrate, only with a selected baby |

- The section is hidden when both lists are empty.
- Each dose row: vaccine name, dose label, note, and — with a selected baby — status badge and the "Given" control.
- The section heading names the baby: "Vaccines · {name}"; without a baby it reads "Vaccines" and has no controls.
- A "Full schedule" link leads to `/{locale}/vaccines/`.
- Age 0 and 1 pages have no section; their months carry it.

## 3.6 Recording a dose

| Action | Result |
|---|---|
| Check "Given" | Record with today's date; badge becomes "Given on {today}" |
| Change the date | Date field; save stores the new date if valid |
| Uncheck "Given" | Record removed; no confirmation |

| Validation | Message (en) |
|---|---|
| Date after today | The date can't be in the future. |
| Date before `lastPeriodDate` | The date can't be before the first day of the last period. |
| Empty date | Please pick a date. |

- The record is written to `localStorage` right away by the existing store sync.
- The change shows at once on the guide page, the dashboard card and the schedule page.

## 3.7 Dashboard card "Vaccines"

Shown in the selected baby's overview, below the growth card.

| Content | Rule |
|---|---|
| Rows | Doses with status `due`, then `overdue`, each ordered by `from`. Mother doses only while the baby is in pregnancy |
| Row | Vaccine name, dose label, estimated date, status badge, "Given" control |
| Nothing due or overdue | "Next dose: {vaccine} — around {date}" for the first `upcoming` dose |
| Nothing left | "All doses recorded" |
| Link | "Full schedule" → `/{locale}/vaccines/` |

## 3.8 Schedule page `/{locale}/vaccines/`

| Part | Content |
|---|---|
| Breadcrumbs | Home › Vaccination schedule |
| Heading | "Vaccination schedule" |
| Source line | "National Expanded Programme on Immunization — Ministry of Health" |
| Groups | Pregnancy, At birth, 2 months, 3 months, 4 months, 5 months, 9 months, 12 months, 18 months, 24 months |
| Row (prerendered) | Vaccine name, dose label, note |
| Row (selected baby, after hydrate) | + estimated date, status badge, "Given" control |
| No baby | Schedule only, plus the "Track your baby" button |

- The menu has a "Vaccination schedule" link to this page.
- The page is in the sitemap with its own metadata and `hreflang`.

## 3.9 Edge cases

- No real birth date: every baby date is counted from the estimated birth date, so estimated dates read "around".
- A baby added after 24 months sees every baby dose as overdue until recorded; doses are recorded one by one.
- After birth, unrecorded mother doses stay `overdue` but appear only on week pages and the schedule page.
- Prerendered HTML has no baby: status, overdue list and controls appear only after the babies load.
- Storage unavailable (private mode): records last for the session only.

## 3.10 Visible text

| Key | vi | en |
|---|---|---|
| Section / card heading | Tiêm chủng | Vaccines |
| Section heading with baby | Tiêm chủng · {name} | Vaccines · {name} |
| List "At this step" | Mũi ở mốc này | Doses at this step |
| List "Overdue" | Mũi chưa tiêm | Doses not yet given |
| Dose label | Mũi {n} | Dose {n} |
| Booster label | Mũi nhắc | Booster |
| Control | Đã tiêm | Given |
| Badge `done` | Đã tiêm ngày {date} | Given on {date} |
| Badge `upcoming` | Dự kiến {date} | Around {date} |
| Badge `due` | Đến hạn | Due now |
| Badge `overdue` | Quá hạn — tiêm bù | Overdue — catch up |
| Scheduled line (`due`, `overdue`) | Lịch tiêm {date} | Scheduled {date} |
| Control: change date | Đổi ngày | Change date |
| Date field label | Ngày tiêm | Date given |
| Next dose | Mũi tiếp theo: {vaccine} — khoảng {date} | Next dose: {vaccine} — around {date} |
| All done | Đã ghi nhận đủ các mũi | All doses recorded |
| Link | Xem lịch tiêm đầy đủ | Full schedule |
| Page heading / menu / breadcrumb | Lịch tiêm chủng | Vaccination schedule |
| Milestone: pregnancy | Mang thai | Pregnancy |
| Milestone: month 0 | Sơ sinh | At birth |
| Milestone: month {n} | {n} tháng | {n} months |
| Source line | Chương trình Tiêm chủng mở rộng — Bộ Y tế | National Expanded Programme on Immunization — Ministry of Health |

---

## Routes

```
GET /{locale}/vaccines/   — Vaccination schedule (prerendered; baby status after hydrate)
```

The section and the card render inside existing routes: `/{locale}/` (dashboard), `/{locale}/week/{1..40}/`, `/{locale}/month/{0..24}/`, `/{locale}/age/{2..18}/`. There is no API.

## Permissions

None. The app has no accounts; records live only in this browser.
