## 5. Feeding and Sleep (5-feeding-sleep.md)

Base URL: `http://localhost:5101` (`sh run.sh start_test`, empty `localStorage`). The section needs no saved baby.

### Month pages

### TC-FS-01: Newborn month shows the milk rhythm and the breastfeeding note
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/month/0/
  2. Find section "Ăn & ngủ"
- **Expected:**
  - Block "Ăn": row "Cách nhau" shows "2,5–3 giờ", row "Mỗi cữ (bú bình)" shows "30–90 ml", row "Số cữ mỗi ngày" shows "8–10 cữ"
  - Notes "Lịch tham khảo; bé bú mẹ vẫn cho bú khi bé đòi. Lượng ml chỉ dành cho bú bình." and "Lượng mỗi cữ và số cữ không nhân thẳng với nhau: nhiều cữ thì mỗi cữ ít hơn. Tổng sữa công thức thường không quá 960 ml/ngày." are visible
  - Line "Nguồn: Nhịp E.A.S.Y. (Tracy Hogg); lượng sữa theo AAP"
  - Block "Ngủ": row "Tổng giờ ngủ" shows "14–17 giờ/ngày", row "Giấc ngày" shows "4–5 giấc"; lines "Nguồn: WHO 2019" and "Số giấc: E.A.S.Y. (Tracy Hogg)"

### TC-FS-02: English month page
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/6/
- **Expected:**
  - Section "Feeding and sleep" is visible
  - Row "Feed every" shows "4 hours", row "Per bottle feed" shows "180–240 ml", row "Feeds a day" shows "4–5 feeds"
  - Row "Total sleep" shows "12–16 hours a day", row "Daytime naps" shows "2–3 naps"

### TC-FS-03: From month 12 the feeding block shows daily milk only
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/month/12/
  2. Navigate to /vi/month/11/
- **Expected:**
  - Month 12: block "Ăn" has only row "Sữa và chế phẩm sữa (quy ra sữa)" showing "480–720 ml/ngày"; no row "Cách nhau", "Bữa chính" or "Bữa phụ"; no 960 ml note; line "Nguồn: AAP"
  - Month 12: the tip names breastfeeding up to 24 months or whole cow's milk from a cup
  - Month 12: the Care section still shows "Ăn cùng gia đình" with "3–4 bữa và 1–2 bữa phụ"
  - Month 11: row "Cách nhau" shows "4–5 giờ", row "Số cữ mỗi ngày" shows "3–4 cữ"

### TC-FS-04: Month 24 sleep
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/24/
- **Expected:**
  - Row "Total sleep" shows "11–14 hours a day", row "Daytime naps" shows "1 nap"

### Age pages

### TC-FS-05: Ages 0–1 and week pages have no section
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/0/
  2. Navigate to /en/age/1/
  3. Navigate to /en/week/20/
- **Expected:**
  - No heading "Feeding and sleep" on any of the three pages

### TC-FS-06: Age 2 shows meals, dairy and one nap
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/age/2/
- **Expected:**
  - Block "Ăn": row "Bữa chính" shows "3 bữa", row "Bữa phụ" shows "2 bữa", row "Sữa và chế phẩm sữa (quy ra sữa)" shows "480 ml/ngày"; line "Nguồn: Số bữa theo AAP; sữa theo Dietary Guidelines for Americans"
  - Block "Ngủ": row "Tổng giờ ngủ" shows "11–14 giờ/ngày", row "Giấc ngày" shows "1 giấc"

### TC-FS-07: Sleep source switches to the AASM at age 5
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/4/
  2. Navigate to /en/age/5/
- **Expected:**
  - Age 4: "Total sleep" "10–13 hours a day", line "Source: WHO 2019", no row "Daytime naps", no line starting "Naps:"
  - Age 5: "Total sleep" "10–13 hours a day", line "Source: AASM 2016 (endorsed by the AAP)"

### TC-FS-08: Teen page
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/13/
- **Expected:**
  - "Main meals" "3 meals", "Snacks" "1–2 snacks", "Milk and dairy (as milk)" "720 ml a day"
  - "Total sleep" "8–10 hours a day", no row "Daytime naps"

### Layout

### TC-FS-09: Section order and headings
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/9/ and list the `h2` headings in order
  2. Repeat on /en/age/6/
- **Expected:**
  - The section "Feeding and sleep" comes after the boy / girl table and before "Care"; it has exactly one `h2` and its id is not shared with another heading

### TC-FS-10: The section is in the static HTML
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /vi/month/3/
  2. GET /en/age/10/
- **Expected:**
  - Both responses are HTTP 200 and their HTML contains the section heading ("Ăn & ngủ", "Feeding and sleep") and the row values, before any script runs
