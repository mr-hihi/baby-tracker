## 3. Vaccination Record (3-vaccination.md)

- **Base URL:** `http://localhost:5101` — `sh run.sh start_test` (`.env.test`, empty base path, empty `localStorage`).
- **Locale:** English pages (`/en/...`) unless a case says otherwise.
- **Schedule:** cases assert the schedule in [3-vaccination.md](../business/3-vaccination.md) § 3.2; when it changes, update the matching cases.
- **Dates:** "today − N days" is the browser's current date minus N days as `YYYY-MM-DD`. "{today}" in an expectation is today in the page's locale format (en: "Oct 29, 2026").
- **Seeding a baby:** run in the page, then reload:
  `localStorage.setItem("baby-tracker:v1", JSON.stringify({ items: [BABY], selectedId: BABY.id }))`

| Fixture | `BABY` | Current point |
|---|---|---|
| `PREG22` | `{ id: "preg22", name: "Test Baby Preg", lastPeriodDate: today − 150 days }` | week 22 |
| `M3` | `{ id: "m3", name: "Test Baby Three", lastPeriodDate: today − 380 days }` | month 3 (born today − 100 days) |
| `Y8` | `{ id: "y8", name: "Test Baby Eight", lastPeriodDate: today − 3210 days }` | age 8 |

### Guide page section

### TC-VAC-01: Doses at this step without a baby
- **App:** Web (mobile viewport 390×844)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/month/2/
  2. Find section "Vaccines"
- **Expected:**
  - List "Doses at this step" shows "DTP-HepB-Hib (5-in-1)" "Dose 1" and "Polio, oral" "Dose 1"
  - No "Given" control and no status badge
  - No list "Doses not yet given"
  - Link "Full schedule" points to /en/vaccines/

### TC-VAC-02: Section hidden when nothing is due and no baby
- **App:** Web
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/month/6/
- **Expected:**
  - No section "Vaccines" on the page

### TC-VAC-03: Record a dose on a guide page
- **App:** Web
- **Precondition:** Seed fixture `M3`
- **Steps:**
  1. Navigate to /en/month/3/
  2. In "Doses at this step", check "Given" on "DTP-HepB-Hib (5-in-1)" "Dose 2"
  3. Reload the page
  4. Read `localStorage["baby-tracker:v1"]`
- **Expected:**
  - Section heading "Vaccines · Test Baby Three"
  - Before step 2 the row badge is "Due now"
  - After step 2 and after reload the badge is "Given on {today}"
  - `items[0].vaccinations["dtp-hepb-hib-2"]` equals today as `YYYY-MM-DD`

### TC-VAC-04: Overdue doses appear on a later page with no dose of its own
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /en/month/6/
  2. Find section "Vaccines"
- **Expected:**
  - Section is visible although month 6 has no dose
  - No list "Doses at this step"
  - List "Doses not yet given" has 4 rows: "Hepatitis B" "Dose 1", "BCG (tuberculosis)" "Dose 1", "DTP-HepB-Hib (5-in-1)" "Dose 1", "Polio, oral" "Dose 1" — each with badge "Overdue — catch up"
  - Month 3 doses (status "Due now") are not in the list

### TC-VAC-05: A page ahead of the baby flags only real overdue doses
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /en/month/10/
- **Expected:**
  - "Doses not yet given" contains the 4 month-0 and month-2 doses from TC-VAC-04
  - It does not contain "Polio, injected" (month 5, 9) or "Measles" (month 9) — the baby has not reached them

### TC-VAC-06: Recording and removing an overdue dose
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /en/month/6/
  2. Check "Given" on "Hepatitis B" "Dose 1"
  3. Navigate to /en/month/3/ and back to /en/month/6/
  4. Navigate to /en/vaccines/, find "Hepatitis B" "Dose 1", uncheck "Given"
  5. Navigate to /en/month/6/
- **Expected:**
  - After step 3 "Doses not yet given" has 3 rows, without "Hepatitis B"
  - After step 5 "Hepatitis B" "Dose 1" is back with badge "Overdue — catch up"

### TC-VAC-07: Date validation
- **App:** Web
- **Precondition:** Seed fixture `M3`
- **Steps:**
  1. Navigate to /en/month/3/
  2. Check "Given" on "Polio, oral" "Dose 2"
  3. Change its date to tomorrow and save
  4. Change its date to today − 400 days (before `lastPeriodDate`) and save
  5. Clear the date and save
  6. Change its date to today − 3 days and save
- **Expected:**
  - Step 3: error "The date can't be in the future."; stored date unchanged
  - Step 4: error "The date can't be before the first day of the last period."; stored date unchanged
  - Step 5: error "Please pick a date."
  - Step 6: badge "Given on {today − 3 days}"

### TC-VAC-08: Mother doses during pregnancy
- **App:** Web
- **Precondition:** Seed fixture `PREG22`
- **Steps:**
  1. Navigate to /en/week/22/
  2. Navigate to /en/week/30/
- **Expected:**
  - Week 22 "Doses at this step": "Tetanus" "Dose 1" with badge "Due now"; no "Tetanus" "Dose 2"
  - Week 30 "Doses at this step": "Tetanus" "Dose 1" ("Due now") and "Tetanus" "Dose 2" ("Around {lastPeriodDate + 161 days}")

### TC-VAC-09: Unrecorded mother doses after birth stay on week pages only
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /en/week/38/
  2. Navigate to /en/month/3/
  3. Navigate to /en/
- **Expected:**
  - Week 38 "Doses not yet given" lists "Tetanus" "Dose 1" and "Dose 2" with "Overdue — catch up"
  - Month 3 page lists no "Tetanus" row
  - Dashboard card "Vaccines" lists no "Tetanus" row

### TC-VAC-10: Dose at month 24 also shows on age 2
- **App:** Web
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/age/2/
  2. Navigate to /en/age/0/
- **Expected:**
  - Age 2 "Doses at this step" shows "Japanese encephalitis" "Dose 3"
  - Age 0 has no section "Vaccines"

### Dashboard card

### TC-VAC-11: Card lists due then overdue doses
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /en/
  2. Find card "Vaccines"
- **Expected:**
  - Rows in order: "DTP-HepB-Hib (5-in-1)" "Dose 2" and "Polio, oral" "Dose 2" with "Due now"; then "Hepatitis B" "Dose 1", "BCG (tuberculosis)" "Dose 1", "DTP-HepB-Hib (5-in-1)" "Dose 1", "Polio, oral" "Dose 1" with "Overdue — catch up"
  - Link "Full schedule" points to /en/vaccines/

### TC-VAC-12: Card shows the next dose when nothing is due
- **App:** Web
- **Precondition:** Seed fixture `M3` with `vaccinations` for `hepb-birth`, `bcg`, `dtp-hepb-hib-1`, `opv-1`, `dtp-hepb-hib-2`, `opv-2`, each dated today − 10 days
- **Steps:**
  1. Navigate to /en/
- **Expected:**
  - Card "Vaccines" shows "Next dose: DTP-HepB-Hib (5-in-1) — around {estimated birth date + 4 months}"
  - No row with "Due now" or "Overdue — catch up"

### TC-VAC-13: Card says all doses recorded
- **App:** Web
- **Precondition:** Seed fixture `Y8` with `vaccinations` for all 16 baby doses in § 3.2, each dated today − 30 days
- **Steps:**
  1. Navigate to /en/
- **Expected:**
  - Card "Vaccines" shows "All doses recorded"
  - No "Tetanus" row (mother doses are hidden after birth)

### TC-VAC-14: Recording on the card updates the guide page
- **App:** Web
- **Precondition:** Seed fixture `PREG22`
- **Steps:**
  1. Navigate to /en/
  2. In card "Vaccines", check "Given" on "Tetanus" "Dose 1"
  3. Navigate to /en/week/22/
- **Expected:**
  - Card row badge becomes "Given on {today}"
  - Week 22 row "Tetanus" "Dose 1" shows "Given on {today}"

### Schedule page

### TC-VAC-15: Schedule page without a baby
- **App:** Web
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/vaccines/
  2. GET /en/vaccines/ with `curl`
- **Expected:**
  - Heading "Vaccination schedule"; breadcrumbs "Home › Vaccination schedule"
  - Source line "National Expanded Programme on Immunization — Ministry of Health"
  - Groups in order: "Pregnancy", "At birth", "2 months", "3 months", "4 months", "5 months", "9 months", "12 months", "18 months", "24 months" — 18 rows in total
  - No "Given" control; button "Track your baby" is visible
  - `curl` body contains "Japanese encephalitis"

### TC-VAC-16: Schedule page with a baby
- **App:** Web
- **Precondition:** Seed fixture `M3` with `vaccinations: { "hepb-birth": today − 99 days }`
- **Steps:**
  1. Navigate to /en/vaccines/
- **Expected:**
  - "Hepatitis B" "Dose 1": "Given on {today − 99 days}"
  - "BCG (tuberculosis)" "Dose 1": "Overdue — catch up"
  - "DTP-HepB-Hib (5-in-1)" "Dose 2": "Due now"
  - "Measles" "Dose 1": "Around {estimated birth date + 9 months}"
  - Every row has a "Given" control

### TC-VAC-17: Menu link to the schedule
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/10/
  2. Click "Open menu"
  3. Click "Vaccination schedule"
- **Expected:**
  - URL becomes /en/vaccines/

### Storage

### TC-VAC-18: Editing the baby keeps the records
- **App:** Web
- **Precondition:** Seed fixture `M3` with `vaccinations: { "bcg": today − 90 days }`
- **Steps:**
  1. Navigate to /en/
  2. Click "Open menu", click "Edit baby"
  3. Fill "Baby's name" with "Test Baby Renamed", click "Save"
  4. Navigate to /en/vaccines/
- **Expected:**
  - "BCG (tuberculosis)" "Dose 1" still shows "Given on {today − 90 days}"
  - `localStorage["baby-tracker:v1"]` `items[0].vaccinations.bcg` is unchanged

### TC-VAC-19: Old saved data and bad entries load safely
- **App:** Web
- **Precondition:** Seed `BABY = { id: "old", name: "Test Baby Old", lastPeriodDate: today − 380 days, vaccinations: { "bcg": "not-a-date", "hepb-birth": today − 99 days, "retired-dose": today − 50 days } }`
- **Steps:**
  1. Navigate to /en/vaccines/
  2. Seed again without the `vaccinations` field, reload /en/vaccines/
- **Expected:**
  - Step 1: page loads; "Hepatitis B" "Dose 1" shows "Given on {today − 99 days}"; "BCG (tuberculosis)" shows "Overdue — catch up"; no row for "retired-dose"
  - Step 2: page loads; every baby dose shows a status; no error in the console

### TC-VAC-20: Records are per baby
- **App:** Web
- **Precondition:** Seed two babies: `M3` and `{ id: "m3b", name: "Test Baby Other", lastPeriodDate: today − 380 days }`, `selectedId: "m3"`
- **Steps:**
  1. Navigate to /en/month/3/, check "Given" on "Polio, oral" "Dose 2"
  2. Click "Open menu", click "Choose baby", choose "Test Baby Other"
  3. Navigate to /en/month/3/
- **Expected:**
  - Section heading "Vaccines · Test Baby Other"
  - "Polio, oral" "Dose 2" shows "Due now", not "Given on"

### i18n and SEO

### TC-VAC-21: Vietnamese labels
- **App:** Web
- **Precondition:** Seed fixture `M3` (no records)
- **Steps:**
  1. Navigate to /vi/month/6/
  2. Navigate to /vi/vaccines/
- **Expected:**
  - Section heading "Tiêm chủng · Test Baby Three"; list "Mũi chưa tiêm"; badge "Quá hạn — tiêm bù"; control "Đã tiêm"
  - Schedule heading "Lịch tiêm chủng"; source line "Chương trình Tiêm chủng mở rộng — Bộ Y tế"

### TC-VAC-22: Sitemap and metadata include the schedule
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /sitemap.xml
  2. Navigate to /en/vaccines/ and read `<head>`
- **Expected:**
  - Sitemap contains `/vi/vaccines/` and `/en/vaccines/`
  - `<link rel="canonical">` ends with `/en/vaccines/`
  - `<link rel="alternate" hreflang="vi">` ends with `/vi/vaccines/`
