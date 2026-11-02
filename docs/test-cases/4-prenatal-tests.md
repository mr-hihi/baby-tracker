## 4. Prenatal Tests (4-prenatal-tests.md)

- **Base URL:** `http://localhost:5101` — `sh run.sh start_test` (`.env.test`, empty base path, empty `localStorage`).
- **Locale:** English pages (`/en/...`) unless a case says otherwise.
- **Schedule:** cases assert the schedule in [4-prenatal-tests.md](../business/4-prenatal-tests.md) § 4.2; when it changes, update the matching cases.
- **Dates:** "today − N days" is the browser's current date minus N days as `YYYY-MM-DD`. "{today}" in an expectation is today in the page's locale format (en: "Nov 2, 2026"). The NIPT estimated date is `lastPeriodDate + 63 days` (start of week 10).
- **Seeding a baby:** run in the page, then reload:
  `localStorage.setItem("baby-tracker:v1", JSON.stringify({ items: [BABY], selectedId: BABY.id }))`

| Fixture | `BABY` | Current point | NIPT estimated date |
|---|---|---|---|
| `PREG8` | `{ id: "preg8", name: "Test Baby Early", lastPeriodDate: today − 50 days }` | week 8 | today + 13 days |
| `PREG12` | `{ id: "preg12", name: "Test Baby Twelve", lastPeriodDate: today − 80 days }` | week 12 | today − 17 days |
| `PREG20` | `{ id: "preg20", name: "Test Baby Twenty", lastPeriodDate: today − 135 days }` | week 20 | today − 72 days |
| `M3` | `{ id: "m3", name: "Test Baby Three", lastPeriodDate: today − 380 days }` | month 3 | today − 317 days |

### Week page section

### TC-PT-01: Tests at this step without a baby
- **App:** Web (mobile viewport 390×844)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/week/10/
  2. Find section "Prenatal tests"
- **Expected:**
  - List "Tests at this step" shows "NIPT (non-invasive prenatal test)", "Weeks 10–14" and "A blood test from the mother; screens for Down, Edwards and Patau syndromes"
  - No "Done" control and no status badge
  - No list "Tests not yet done"
  - Link "Test schedule" points to /en/prenatal-tests/

### TC-PT-02: The section follows the window
- **App:** Web
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/week/9/
  2. Navigate to /en/week/14/
  3. Navigate to /en/week/15/
- **Expected:**
  - Week 9: no section "Prenatal tests"
  - Week 14: section "Prenatal tests" lists "NIPT (non-invasive prenatal test)"
  - Week 15: no section "Prenatal tests"

### TC-PT-03: Record a test on a week page
- **App:** Web
- **Precondition:** Seed fixture `PREG12`
- **Steps:**
  1. Navigate to /en/week/12/
  2. In "Tests at this step", check "Done" on "NIPT (non-invasive prenatal test)"
  3. Reload the page
  4. Read `localStorage["baby-tracker:v1"]`
- **Expected:**
  - Section heading "Prenatal tests · Test Baby Twelve"
  - Before step 2 the row badge is "Due now" with "Scheduled {today − 17 days}"
  - After step 2 and after reload the badge is "Done on {today}"
  - `items[0].prenatalTests.nipt` equals today as `YYYY-MM-DD`

### TC-PT-04: Upcoming test shows its estimated date
- **App:** Web
- **Precondition:** Seed fixture `PREG8`
- **Steps:**
  1. Navigate to /en/week/10/
- **Expected:**
  - Row "NIPT (non-invasive prenatal test)" has badge "Around {today + 13 days}"
  - No "Scheduled" line on the row
  - The "Done" control is unchecked

### TC-PT-05: Overdue test on a later week page, below the vaccines
- **App:** Web
- **Precondition:** Seed fixture `PREG20` (no records)
- **Steps:**
  1. Navigate to /en/week/20/
- **Expected:**
  - Section "Prenatal tests" sits below section "Vaccines · Test Baby Twenty"
  - No list "Tests at this step"
  - List "Tests not yet done" has 1 row: "NIPT (non-invasive prenatal test)" with badge "Overdue — ask your doctor" and "Scheduled {today − 72 days}"

### TC-PT-06: A page ahead of the baby flags only a real overdue test
- **App:** Web
- **Precondition:** Seed fixture `PREG12` (no records)
- **Steps:**
  1. Navigate to /en/week/20/
- **Expected:**
  - No section "Prenatal tests" — NIPT is "Due now" for the baby, not overdue

### TC-PT-07: Date validation
- **App:** Web
- **Precondition:** Seed fixture `PREG12`
- **Steps:**
  1. Navigate to /en/week/12/
  2. Check "Done" on "NIPT (non-invasive prenatal test)"
  3. Click "Change date", set the date to tomorrow and save
  4. Set the date to today − 81 days (before `lastPeriodDate`) and save
  5. Clear the date and save
  6. Set the date to today − 3 days and save
- **Expected:**
  - Step 3: error "The date can't be in the future."; stored date unchanged
  - Step 4: error "The date can't be before the first day of the last period."; stored date unchanged
  - Step 5: error "Please pick a date."
  - Step 6: badge "Done on {today − 3 days}"

### TC-PT-08: Removing a record brings the test back
- **App:** Web
- **Precondition:** Seed fixture `PREG20` with `prenatalTests: { nipt: today − 60 days }`
- **Steps:**
  1. Navigate to /en/week/20/
  2. Navigate to /en/week/12/, uncheck "Done" on "NIPT (non-invasive prenatal test)"
  3. Navigate to /en/week/20/
- **Expected:**
  - Step 1: no section "Prenatal tests"
  - Step 2: the badge becomes "Overdue — ask your doctor"; `items[0].prenatalTests` has no `nipt`
  - Step 3: list "Tests not yet done" shows "NIPT (non-invasive prenatal test)"

### TC-PT-09: After birth the test stays on week pages only
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /en/week/30/
  2. Navigate to /en/month/3/
  3. Navigate to /en/
- **Expected:**
  - Week 30 "Tests not yet done" lists "NIPT (non-invasive prenatal test)" with "Overdue — ask your doctor"
  - Month 3 page has no section "Prenatal tests"
  - Dashboard has no card "Prenatal tests"

### Dashboard card

### TC-PT-10: Card shows the next test before the window
- **App:** Web
- **Precondition:** Seed fixture `PREG8`
- **Steps:**
  1. Navigate to /en/
  2. Find card "Prenatal tests"
- **Expected:**
  - The card sits below card "Vaccines"
  - It shows "Next test: NIPT (non-invasive prenatal test) — around {today + 13 days}" and no test row
  - Link "Test schedule" points to /en/prenatal-tests/

### TC-PT-11: Recording the due test on the card
- **App:** Web
- **Precondition:** Seed fixture `PREG12`
- **Steps:**
  1. Navigate to /en/
  2. In card "Prenatal tests", read the row, then check "Done" on "NIPT (non-invasive prenatal test)"
  3. Navigate to /en/week/12/
- **Expected:**
  - Before step 2 the row badge is "Due now"
  - After step 2 the row is gone and the card shows "All tests recorded"
  - Week 12 row "NIPT (non-invasive prenatal test)" shows "Done on {today}"

### TC-PT-12: Card lists an overdue test
- **App:** Web
- **Precondition:** Seed fixture `PREG20` (no records)
- **Steps:**
  1. Navigate to /en/
- **Expected:**
  - Card "Prenatal tests" has 1 row: "NIPT (non-invasive prenatal test)" with "Overdue — ask your doctor"

### Schedule page

### TC-PT-13: Schedule page without a baby
- **App:** Web
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/prenatal-tests/
  2. GET /en/prenatal-tests/ with `curl`
- **Expected:**
  - Heading "Prenatal test schedule"; breadcrumbs "Home › Prenatal test schedule"
  - Source line "Prenatal screening guidance — Ministry of Health"
  - 1 row: "NIPT (non-invasive prenatal test)", "Weeks 10–14"
  - No "Done" control; button "Track your baby" is visible
  - `curl` body contains "NIPT (non-invasive prenatal test)"

### TC-PT-14: Schedule page with a baby
- **App:** Web
- **Precondition:** Seed fixture `PREG12`
- **Steps:**
  1. Navigate to /en/prenatal-tests/
- **Expected:**
  - Line "Prenatal tests · Test Baby Twelve" above the rows
  - "NIPT (non-invasive prenatal test)" shows "Due now" and a "Done" control
  - No button "Track your baby"

### TC-PT-15: Menu link to the schedule
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/10/
  2. Click "Open menu"
  3. Click "Prenatal test schedule"
- **Expected:**
  - URL becomes /en/prenatal-tests/

### Storage

### TC-PT-16: Editing the baby keeps the records
- **App:** Web
- **Precondition:** Seed fixture `PREG12` with `prenatalTests: { nipt: today − 5 days }` and `vaccinations: {}`
- **Steps:**
  1. Navigate to /en/
  2. Click "Open menu", click "Edit baby"
  3. Fill "Baby's name" with "Test Baby Renamed", click "Save"
  4. Navigate to /en/prenatal-tests/
- **Expected:**
  - "NIPT (non-invasive prenatal test)" still shows "Done on {today − 5 days}"
  - `localStorage["baby-tracker:v1"]` `items[0].prenatalTests.nipt` is unchanged

### TC-PT-17: Old saved data and bad entries load safely
- **App:** Web
- **Precondition:** Seed `BABY = { id: "old", name: "Test Baby Old", lastPeriodDate: today − 80 days, prenatalTests: { nipt: "not-a-date", "retired-test": today − 5 days } }`
- **Steps:**
  1. Navigate to /en/prenatal-tests/
  2. Seed again without the `prenatalTests` field, reload /en/prenatal-tests/
- **Expected:**
  - Step 1: page loads; "NIPT (non-invasive prenatal test)" shows "Due now"; no row for "retired-test"
  - Step 2: page loads; "NIPT (non-invasive prenatal test)" shows "Due now"; no error in the console

### TC-PT-18: Records are per baby
- **App:** Web
- **Precondition:** Seed two babies: `PREG12` and `{ id: "preg12b", name: "Test Baby Other", lastPeriodDate: today − 80 days }`, `selectedId: "preg12"`
- **Steps:**
  1. Navigate to /en/week/12/, check "Done" on "NIPT (non-invasive prenatal test)"
  2. Click "Open menu", click "Choose baby", choose "Test Baby Other"
  3. Navigate to /en/week/12/
- **Expected:**
  - Section heading "Prenatal tests · Test Baby Other"
  - "NIPT (non-invasive prenatal test)" shows "Due now", not "Done on"

### i18n and SEO

### TC-PT-19: Vietnamese labels
- **App:** Web
- **Precondition:** Seed fixture `PREG20` (no records)
- **Steps:**
  1. Navigate to /vi/week/20/
  2. Navigate to /vi/prenatal-tests/
- **Expected:**
  - Section heading "Xét nghiệm · Test Baby Twenty"; list "Xét nghiệm chưa làm"; row "NIPT (sàng lọc trước sinh không xâm lấn)" with "Tuần 10–14"; badge "Quá hạn — hỏi bác sĩ"; control "Đã làm"
  - Schedule heading "Lịch xét nghiệm thai kỳ"; source line "Hướng dẫn sàng lọc trước sinh — Bộ Y tế"

### TC-PT-20: Sitemap and metadata include the schedule
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /sitemap.xml
  2. Navigate to /en/prenatal-tests/ and read `<head>`
- **Expected:**
  - Sitemap contains `/vi/prenatal-tests/` and `/en/prenatal-tests/`
  - `<title>` starts with "Prenatal screening test schedule for pregnancy"
  - `<link rel="canonical">` ends with `/en/prenatal-tests/`
  - `<link rel="alternate" hreflang="vi">` ends with `/vi/prenatal-tests/`
