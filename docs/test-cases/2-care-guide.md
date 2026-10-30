## 2. Care Guide (2-care-guide.md)

- **Base URL:** `http://localhost:5101` — `sh run.sh start_test` (`.env.test`, empty base path, empty `localStorage`).
- **Locale:** English pages (`/en/...`) unless a case says otherwise.
- **Content:** cases assert the initial content in [2-care-guide.md](../business/2-care-guide.md) § 2.4; when that table changes, update the matching cases.

### Display

### TC-CG-01: Week 1 shows the three groups in order, all new
- **App:** Web (mobile viewport 390×844)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/1/
  2. Find section "Care"
- **Expected:**
  - Groups appear in order "Supplements", "What to eat", "What to avoid"
  - "Supplements" contains "Folic acid 400 mcg a day" with badge "New this week" and source label "WHO"
  - "What to eat" contains "Varied meals: rice, meat, fish, eggs, beans, vegetables, fruit" with source label "Ministry of Health"
  - "What to avoid" contains 3 items, each with badge "New this week"
  - No item shows "For mum" (week pages default to the mother)

### TC-CG-02: Ongoing items show without the badge
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/8/
  2. Find section "Care"
- **Expected:**
  - "Supplements" contains "Folic acid 400 mcg a day"
  - "What to eat" contains "Small, frequent meals when nauseous; plenty of water"
  - No item on the page shows "New this week"

### TC-CG-03: An item ends after its last week
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/12/ and read "Supplements"
  2. Navigate to /en/week/13/ and read "Supplements"
- **Expected:**
  - Week 12 contains "Folic acid 400 mcg a day" and not "Iron 30–60 mg and folic acid 400 mcg a day"
  - Week 13 contains "Iron 30–60 mg and folic acid 400 mcg a day" with badge "New this week" and not "Folic acid 400 mcg a day"

### TC-CG-04: New items come first in a group
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/20/
  2. Read the items of "Supplements" top to bottom
- **Expected:**
  - First item: "Calcium 1,500–2,000 mg a day, split, taken apart from iron" with badge "New this week"
  - Second item: "Iron 30–60 mg and folic acid 400 mcg a day" without badge

### TC-CG-05: Empty group is hidden
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/3/
  2. Find section "Care"
- **Expected:**
  - No group "Supplements"
  - "What to eat" contains "Breast milk only, on demand, day and night"
  - "What to avoid" contains "No water, juice or other food before 6 months"

### TC-CG-06: Mother items on month pages carry the subject label
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/0/
  2. Find section "Care"
- **Expected:**
  - "Supplements" contains "Vitamin A 200,000 IU once within the first month after birth" with label "For mum" and source "Ministry of Health"
  - "What to avoid" contains "No alcohol while breastfeeding" with label "For mum"
  - "Breast milk only, on demand, day and night" has no subject label
  - Every item shows badge "New this month"

### TC-CG-07: Month 6 starts solids and vitamin A
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/5/ and read section "Care"
  2. Navigate to /en/month/6/ and read section "Care"
- **Expected:**
  - Month 5 "What to eat" contains "Breast milk only, on demand, day and night"; no "Supplements" group
  - Month 6 "What to eat" contains "Start smooth porridge 2–3 times a day; keep breastfeeding" with badge "New this month" and not "Breast milk only, on demand, day and night"
  - Month 6 "Supplements" contains "Vitamin A on campaign days (1 June, 1 December): 100,000 IU at 6–11 months, 200,000 IU from 12 months" with badge "New this month"

### TC-CG-08: Age pages — none at 0 and 1, yearly from 2
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/0/
  2. Navigate to /en/age/1/
  3. Navigate to /en/age/2/
  4. Navigate to /en/age/3/
- **Expected:**
  - Ages 0 and 1 have no section "Care" and show section "Month by month"
  - Age 2 "Supplements" contains "Vitamin A 200,000 IU every 6 months until 36 months" with badge "New this year"
  - Age 3 has no "Supplements" group; "What to avoid" contains "Limit sugary drinks and snacks" without badge

### TC-CG-09: Vietnamese labels
- **App:** Web
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/week/1/
- **Expected:**
  - Section heading "Chăm sóc"
  - Groups "Bổ sung", "Nên ăn", "Nên kiêng"
  - Badge "Mới tuần này"
  - Source label "Bộ Y tế" on the item "Varied meals" (vi text)

### Static content

### TC-CG-10: Care content is in the prerendered HTML
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /en/week/1/ with JavaScript disabled (or `curl`)
- **Expected:**
  - HTTP 200
  - Body contains "Folic acid 400 mcg a day"
  - Body contains "Figures are for reference only and do not replace medical advice."

### TC-CG-11: Same content with a saved baby
- **App:** Web
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/week/20/ and copy the text of section "Care"
  2. Navigate to /en/, click "Add baby", fill "Baby's name" with "Test Baby Care", fill "First day of last period" with today − 70 days, click "Save"
  3. Navigate to /en/week/20/ and copy the text of section "Care"
- **Expected:**
  - The two texts are identical
