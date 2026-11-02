# 4. Prenatal Tests

> One file = one domain. Every section below belongs to the domain "Prenatal Tests".

## 4.1 Overview

Parents-to-be see the screening tests recommended during pregnancy and record, per baby, which tests were done and when. Each test gets a status from the baby's current point; due and overdue tests show on the week guide pages, on a dashboard card and on a schedule page. Code lives in `src/features/prenatal-tests/`; the status rules shared with [3. Vaccination Record](3-vaccination.md) live in `src/features/schedule/`.

- Persona: parents-to-be (end users).
- Depends on: [1. Baby Progress](1-baby-progress.md) (current point, order between steps, start date of a step), Babies (selected baby, storage), Locale (texts, date format).
- Every test is for the mother during pregnancy; every window is in pregnancy weeks.
- Only the date a test was done is stored, never its result.
- State owner: Redux `babies` slice — the dashboard, the week pages and the schedule page share it.

## 4.2 Prenatal test (schedule)

Static table, identical for every baby.

### Data model

| Field | Type | Description |
|---|---|---|
| `id` | string (kebab-case, unique) | Stable key, e.g. `nipt`; stored in records, never renamed |
| `stepKind` | `"week"` | Always a pregnancy week |
| `from` | integer 1–40 | First week of the recommended window |
| `to` | integer 1–40 | Last week of the recommended window, `≥ from` |
| `name` | text vi / en | Test name; texts live in the dictionaries under `prenatalTestTexts[id]` |
| `note` | text vi / en | What the test is |

- Rows are ordered by `from`.
- Estimated date of a test: the start date of week `from` ([1.5 Start date of a step](1-baby-progress.md#start-date-of-a-step)).

### Schedule

Draft reference content. The content owner verifies every window against the Ministry of Health's current prenatal screening guidance before release.

| `id` | Name (en) | Window | Note (en) |
|---|---|---|---|
| `nipt` | NIPT (non-invasive prenatal test) | weeks 10–14 | A blood test from the mother; screens for Down, Edwards and Patau syndromes |

## 4.3 Test record (per baby)

### Data model

Stored on the baby, inside the existing `baby-tracker:v1` key:

| Field | Type | Description |
|---|---|---|
| `Baby.prenatalTests` | `Record<testId, IsoDate>`, optional | Date each test was done; absent key = not done |

### Rules

- A test is recorded with one date. The date is not after today and not before the baby's `lastPeriodDate`.
- Removing a record makes the test "not done" again; there is no history.
- Saved data without `prenatalTests` loads as an empty record — no new key, no migration.
- On read, an entry whose value is not a valid ISO date is dropped; the baby still loads.
- An entry whose test id is not in the schedule is kept in storage and ignored on screen.
- Editing the baby (name, last period date, gender) keeps `prenatalTests` unchanged.
- Changing `lastPeriodDate` moves every status and estimated date; records stay.

## 4.4 Test status

For a test, the selected baby and the baby's current point `C` ([1.3](1-baby-progress.md#13-stages)), compared with the order between steps ([1.5](1-baby-progress.md#order-between-steps)) — the same rules as the dose status in [3.4](3-vaccination.md#34-dose-status):

```
upcoming ──C reaches from──▶ due ──C passes to──▶ overdue
    │                         │                     │
    └──────── record ─────────┴──────── record ─────┴──▶ done
done ──remove record──▶ upcoming | due | overdue (by C)
```

| Status | Rule | Badge (en) |
|---|---|---|
| `done` | record exists | Done on {date} |
| `upcoming` | no record, `C < from` | Around {date} |
| `due` | no record, `from ≤ C ≤ to` | Due now |
| `overdue` | no record, `C > to` | Overdue — ask your doctor |

- Without a selected baby there is no status; tests show as schedule only.
- After birth `C` is a month or an age, which comes after every week, so every unrecorded test is `overdue`.
- `{date}` uses the locale date format; "Around {date}" is the estimated date.

## 4.5 Test section on a week page

On the page of week `N` (1–40):

| List | Tests | Rendered |
|---|---|---|
| At this step | Tests whose window contains `N`: `from ≤ N ≤ to` | Prerendered for everyone |
| Not yet done | Selected baby's tests with status `overdue` and `to < N` | After hydrate, only with a selected baby |

- The section sits below the Vaccination section.
- The section is hidden when both lists are empty.
- Each test row: name, window, note, and — with a selected baby — status badge and the "Done" control.
- The section heading names the baby: "Prenatal tests · {name}"; without a baby it reads "Prenatal tests" and has no controls.
- A "Test schedule" link leads to `/{locale}/prenatal-tests/`.
- Month and age pages have no section.

## 4.6 Recording a test

| Action | Result |
|---|---|
| Check "Done" | Record with today's date; badge becomes "Done on {today}" |
| Change the date | Date field; save stores the new date if valid |
| Uncheck "Done" | Record removed; no confirmation |

| Validation | Message (en) |
|---|---|
| Date after today | The date can't be in the future. |
| Date before `lastPeriodDate` | The date can't be before the first day of the last period. |
| Empty date | Please pick a date. |

- The record is written to `localStorage` right away by the existing store sync.
- The change shows at once on the week page, the dashboard card and the schedule page.

## 4.7 Dashboard card "Prenatal tests"

Shown in the selected baby's overview while the baby is in pregnancy, below the Vaccines card. Hidden after birth.

| Content | Rule |
|---|---|
| Rows | Tests with status `due`, then `overdue`, each ordered by `from` |
| Row | Name, window, note, status badge, "Done" control |
| Nothing due or overdue | "Next test: {test} — around {date}" for the first `upcoming` test |
| Nothing left | "All tests recorded" |
| Link | "Test schedule" → `/{locale}/prenatal-tests/` |

## 4.8 Schedule page `/{locale}/prenatal-tests/`

| Part | Content |
|---|---|
| Breadcrumbs | Home › Prenatal test schedule |
| Heading | "Prenatal test schedule" |
| Source line | "Prenatal screening guidance — Ministry of Health" |
| Rows (prerendered) | Name, window, note, ordered by `from` |
| Baby line (selected baby, after hydrate) | "Prenatal tests · {name}" above the rows |
| Row (selected baby, after hydrate) | + status badge, "Done" control |
| No baby | Schedule only, plus the "Track your baby" button |

- The menu has a "Prenatal test schedule" link to this page.
- The page is in the sitemap with its own metadata and `hreflang`.

## 4.9 Edge cases

- A baby added after week 14 sees NIPT as `overdue` until it is recorded.
- After birth, unrecorded tests stay `overdue` but appear only on week pages and the schedule page; the dashboard card is hidden.
- Prerendered HTML has no baby: status, the "Not yet done" list and controls appear only after the babies load.
- Storage unavailable (private mode): records last for the session only.

## 4.10 Visible text

| Key | vi | en |
|---|---|---|
| Section / card heading | Xét nghiệm | Prenatal tests |
| Section heading with baby | Xét nghiệm · {name} | Prenatal tests · {name} |
| List "At this step" | Xét nghiệm ở mốc này | Tests at this step |
| List "Not yet done" | Xét nghiệm chưa làm | Tests not yet done |
| Window | Tuần {from}–{to} | Weeks {from}–{to} |
| Control | Đã làm | Done |
| Badge `done` | Đã làm ngày {date} | Done on {date} |
| Badge `upcoming` | Dự kiến {date} | Around {date} |
| Badge `due` | Đến hạn | Due now |
| Badge `overdue` | Quá hạn — hỏi bác sĩ | Overdue — ask your doctor |
| Scheduled line (`due`, `overdue`) | Lịch xét nghiệm {date} | Scheduled {date} |
| Control: change date | Đổi ngày | Change date |
| Date field label | Ngày xét nghiệm | Test date |
| Next test | Xét nghiệm tiếp theo: {test} — khoảng {date} | Next test: {test} — around {date} |
| All done | Đã ghi nhận đủ các xét nghiệm | All tests recorded |
| Link | Xem lịch xét nghiệm | Test schedule |
| Page heading / menu / breadcrumb | Lịch xét nghiệm thai kỳ | Prenatal test schedule |
| Source line | Hướng dẫn sàng lọc trước sinh — Bộ Y tế | Prenatal screening guidance — Ministry of Health |
| Date required | Hãy chọn ngày. | Please pick a date. |
| Date in the future | Ngày xét nghiệm không được ở tương lai. | The date can't be in the future. |
| Date before last period | Ngày xét nghiệm không được trước ngày đầu kỳ kinh cuối. | The date can't be before the first day of the last period. |
| `nipt` name | NIPT (sàng lọc trước sinh không xâm lấn) | NIPT (non-invasive prenatal test) |
| `nipt` note | Lấy máu mẹ; sàng lọc hội chứng Down, Edwards, Patau | A blood test from the mother; screens for Down, Edwards and Patau syndromes |
| Page title | Lịch xét nghiệm sàng lọc trước sinh cho mẹ bầu | Prenatal screening test schedule for pregnancy |
| Page description | Các xét nghiệm sàng lọc nên làm khi mang thai, như NIPT từ tuần 10; đánh dấu xét nghiệm đã làm cho từng bé. | Screening tests to take during pregnancy, such as NIPT from week 10; mark the tests done for each baby. |

---

## Routes

```
GET /{locale}/prenatal-tests/   — Prenatal test schedule (prerendered; baby status after hydrate)
```

The section and the card render inside existing routes: `/{locale}/` (dashboard) and `/{locale}/week/{1..40}/`. There is no API.

## Permissions

None. The app has no accounts; records live only in this browser.
