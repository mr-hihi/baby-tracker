## 6. Skills to Teach (6-skills.md)

Base URL: `http://localhost:5101` (`sh run.sh start_test`, empty `localStorage`). The section needs no saved baby.

### TC-SK-01: Month 0 lists the first skills as new
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/month/0/
  2. Find section "Dạy con"
- **Expected:**
  - Two items, in this order: "Trò chuyện cả ngày" (badge "Ngôn ngữ"), "Vận động mỗi ngày" (badge "Vận động")
  - Both carry the badge "Mới tháng này"
  - Last line "Theo sách “Em phải đến Harvard học kinh tế” (Lưu Vệ Hoa, Trương Hân Vũ)"

### TC-SK-02: New items come first
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/12/
- **Expected:**
  - Items in this order: "Plain speech" with "New this month", then "Show the world" without a "New" badge
  - No item "Talk all day"

### TC-SK-03: Ages 0–1 and week pages have no section
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/0/
  2. Navigate to /en/age/1/
  3. Navigate to /en/week/20/
- **Expected:**
  - No heading "Skills to teach" on any of the three pages

### TC-SK-04: Age 5 lists six skills
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /vi/age/5/
- **Expected:**
  - Exactly six items, in this order: "Tự tin trước đám đông" (badge "Mới năm nay"), "Nói đủ câu", "Đọc sách cùng con", "Việc nhà, tự phục vụ", "Phản biện có lý lẽ", "Bơi và nhảy dây"

### TC-SK-05: Teen skills
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/age/13/
- **Expected:**
  - "Talk as with an adult" and "Set goals" come first, each with "New this year"
  - Then "Disagree with reasons", "Learning trips", "Small challenges", "Plan the week", without a "New" badge

### TC-SK-06: Section order on guide pages
- **App:** Web (mobile)
- **Precondition:** None
- **Steps:**
  1. Navigate to /en/month/2/ and list the `h2` headings in order
  2. Repeat on /en/age/6/
- **Expected:**
  - "Feeding and sleep", "Care", "Skills to teach", then "Vaccines" when it shows; each section has exactly one `h2` and its id is not shared

### TC-SK-07: The section is in the static HTML
- **App:** Web (HTTP)
- **Precondition:** None
- **Steps:**
  1. GET /vi/month/6/
  2. GET /en/age/10/
- **Expected:**
  - Both responses are HTTP 200 and their HTML contains the section heading ("Dạy con", "Skills to teach") and the item titles, before any script runs
