## 1. Baby Progress (1-baby-progress.md)

Base URL: `http://localhost:5101` (`sh run.sh start_test`, empty `localStorage`). Dates are relative to the day of the run; the example values assume today is `2026-10-28`.

Shared step **Add baby** `{date}`:

1. Click "Thêm em bé" (empty dashboard) — or "Mở menu" → "Thêm em bé" when a baby already exists
2. Fill "Tên bé" with "Bông"
3. Fill "Ngày đầu kỳ kinh cuối" with `{date}`
4. Click "Lưu"

### Pregnancy — gestational age

### TC-BP-01: Day 148 shows completed weeks and zero days
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /vi/
  2. Add baby with date = today − 147 days (`2026-06-03`)
- **Expected:**
  - Headline under "Bông": "21 tuần 0 ngày"
  - Detail line: "Dự sinh {today + 133 days, dd/MM/yyyy} · còn 133 ngày" (e.g. "Dự sinh 10/03/2027 · còn 133 ngày")
  - No text "Ngày thứ 148" anywhere on the page

### TC-BP-02: Weeks and non-zero days
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /vi/
  2. Add baby with date = today − 209 days (`2026-04-02`)
- **Expected:**
  - Headline: "29 tuần 6 ngày"
  - Detail line ends with "còn 71 ngày"

### TC-BP-03: First day of pregnancy shows both parts as zero
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /vi/
  2. Add baby with date = today (`2026-10-28`)
- **Expected:**
  - Headline: "0 tuần 0 ngày"
  - Detail line ends with "còn 280 ngày"

### TC-BP-04: First week keeps the zero weeks part
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /vi/
  2. Add baby with date = today − 3 days (`2026-10-25`)
- **Expected:**
  - Headline: "0 tuần 3 ngày"

### TC-BP-05: English gestational age on day 148
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/
  2. Click "Add baby"
  3. Fill "Baby's name" with "Poppy"
  4. Fill "First day of last period" with today − 147 days (`2026-06-03`)
  5. Click "Save"
- **Expected:**
  - Headline: "21 weeks 0 days"
  - Detail line: "Due {today + 133 days, MMM d, yyyy} · 133 days to go" (e.g. "Due Mar 10, 2027 · 133 days to go")
  - No text "Day 148" anywhere on the page

### TC-BP-06: English singular week and day
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/
  2. Click "Add baby", fill "Baby's name" with "Poppy", fill "First day of last period" with today − 8 days (`2026-10-20`), click "Save"
- **Expected:**
  - Headline: "1 week 1 day"

### TC-BP-07: Last day of pregnancy
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /vi/
  2. Add baby with date = today − 279 days (`2026-01-22`)
- **Expected:**
  - Headline: "39 tuần 6 ngày"
  - Detail line ends with "còn 1 ngày"

### Born

### TC-BP-08: Estimated birth day switches to child age
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /vi/
  2. Add baby with date = today − 280 days (`2026-01-21`)
- **Expected:**
  - Headline: "0 ngày"
  - Detail lines: "Đã chào đời 0 ngày", "Ngày sinh dự kiến {today, dd/MM/yyyy}" (e.g. "Ngày sinh dự kiến 28/10/2026")
  - No text "tuần" in the headline

### Other screens

### TC-BP-09: Baby picker shows the same headline
- **App:** Web (mobile)
- **Precondition:** TC-BP-01 done (baby "Bông", day 148)
- **Steps:**
  1. Navigate to /vi/
  2. Click "Mở menu"
  3. Click "Chọn em bé"
- **Expected:**
  - Dialog "Chọn em bé" opens
  - Row "Bông" shows "21 tuần 0 ngày"

### TC-BP-10: Growth card opens on the current week
- **App:** Web (mobile)
- **Precondition:** TC-BP-01 done (baby "Bông", day 148)
- **Steps:**
  1. Navigate to /vi/
  2. Click "Xem chi tiết"
- **Expected:**
  - URL becomes /vi/week/22/

### TC-BP-11: Growth card after birth stays on the age timeline
- **App:** Web (mobile)
- **Precondition:** Empty `localStorage`
- **Steps:**
  1. Navigate to /en/
  2. Click "Add baby", fill "Baby's name" with "Poppy", fill "First day of last period" with today − 463 days (`2025-07-22`), click "Save"
  3. Click "View details"
- **Expected:**
  - Step selector shows "Age" 0 marked as today (the baby is about 6 months old; months are not on the timeline)
  - URL becomes /en/age/0/

### Guide pages

### TC-BP-12: Week page shows reference figures
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/12/
- **Expected:**
  - Heading "Pregnancy week 12"
  - Row "Length" shows "5.4 cm"
  - Row "Weight" shows "14 g"
  - Row "Heart rate" shows "140–170 beats/min"
  - Disclaimer "Figures are for reference only and do not replace medical advice." is visible

### TC-BP-13: Month page shows WHO medians and the boy / girl table
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/6/
- **Expected:**
  - Heading "Month 6"
  - Breadcrumbs "Home › Month by month › Month 6"
  - Boy / girl table row "Boys" shows "67.6 cm" and "7.9 kg"
  - Boy / girl table row "Girls" shows "65.7 cm" and "7.3 kg"
  - Growth card image `alt` is "Illustration of a 6-month-old baby" and its `src` ends with `/assets/baby/age-00.svg`
  - Note "Length and weight are WHO reference medians." is visible

### TC-BP-14: Months 0, 12 and 24 match ages 0, 1 and 2
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/0/ and read the "Boys" and "Girls" rows
  2. Navigate to /en/age/0/ and read the same rows
  3. Repeat for /en/month/12/ vs /en/age/1/ and /en/month/24/ vs /en/age/2/
- **Expected:**
  - Month 0 = age 0: Boys "49.9 cm" / "3.3 kg", Girls "49.1 cm" / "3.2 kg"
  - Month 12 = age 1: Boys "75.7 cm" / "9.6 kg", Girls "74 cm" / "8.9 kg"
  - Month 24 = age 2: Boys "87.1 cm" / "12.2 kg", Girls "85.7 cm" / "11.5 kg"

### TC-BP-15: Length before month 24, height at month 24
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/23/
  2. Navigate to /en/month/24/
- **Expected:**
  - Month 23 growth card row label is "Length"
  - Month 24 growth card row label is "Height"

### TC-BP-16: Ages 0 and 1 link to their months
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/0/
  2. Find section "Month by month"
  3. Click link "Month 9"
  4. Navigate to /en/age/1/ and find section "Month by month"
- **Expected:**
  - Age 0 section lists links "Month 0" … "Month 11" (12 links)
  - Step 3 URL becomes /en/month/9/
  - Age 1 section lists links "Month 12" … "Month 24" (13 links)

### Guide navigation

### TC-BP-17: Timeline crosses from week 40 to age 0
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/week/40/
  2. Click "Next" in the step selector
- **Expected:**
  - URL becomes /en/age/0/
  - Heading "Age 0"

### TC-BP-18: Month selector stays inside months
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/0/ and check the step selector
  2. Navigate to /en/month/24/ and check the step selector
  3. Navigate to /en/month/5/ and click "Next"
- **Expected:**
  - Month 0: "Previous" is absent or disabled; the window shows months 0–4
  - Month 24: "Next" is absent or disabled; no selector link points to /en/age/2/
  - Step 3 URL becomes /en/month/6/

### TC-BP-19: Journey index lists months
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/
  2. Find section "Month by month"
  3. Click link "Month 18"
- **Expected:**
  - Section order: "40 weeks of pregnancy", "Month by month", "From 0 to 18 years"
  - "Month by month" has 25 links, "Month 0" … "Month 24"
  - URL becomes /en/month/18/

### TC-BP-20: Unknown month returns 404
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /en/month/25/
  2. GET /en/month/-1/
- **Expected:**
  - Both responses are HTTP 404

### TC-BP-21: Language switch keeps the month
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/month/6/
  2. Click "Mở menu"
  3. Click "English"
- **Expected:**
  - Before the switch, heading "Tháng thứ 6"
  - URL becomes /en/month/6/
  - Heading "Month 6"

### SEO

### TC-BP-22: Sitemap and metadata include months
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /sitemap.xml
  2. Navigate to /en/month/6/ and read `<head>`
- **Expected:**
  - Sitemap contains `/vi/month/0/` … `/vi/month/24/` and `/en/month/0/` … `/en/month/24/` (50 URLs)
  - `<title>` starts with "Month 6: baby length, weight and care"
  - `<link rel="canonical">` ends with `/en/month/6/`
  - `<link rel="alternate" hreflang="vi">` ends with `/vi/month/6/`
