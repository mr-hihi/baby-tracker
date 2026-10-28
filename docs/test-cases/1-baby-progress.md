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
  - Detail line: "Dự sinh 10/03/2027 · còn 133 ngày"
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
  - Detail line: "Due Mar 10, 2027 · 133 days to go"
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
  - Detail lines: "Đã chào đời 0 ngày", "Ngày sinh dự kiến 28/10/2026"
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
