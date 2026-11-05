# 1. Baby Progress (Tiến trình của bé)

> One file = one domain. Every section below belongs to the "Baby progress" domain.

## 1.1 Purpose

Shows where each baby is today, worked out from the first day of the last period: the gestational age while pregnant, the child's age after birth. Read by parents on the dashboard summary and in the baby picker. The domain also owns the journey every baby moves along: the guide steps (week 1–40, month 0–24, age 0–18), their reference figures and their public guide pages. Adding, choosing and editing a baby belong to another domain.

## 1.2 Data

Nothing is stored for this domain; every value is derived on the device.

| Input | Type | Meaning |
|---|---|---|
| `lastPeriodDate` | `IsoDate` | First day of the last period, from the baby record |
| `today` | `IsoDate` | The viewer's local date when the page loads |

| Derived (`GrowthProgress`) | Stage | Meaning |
|---|---|---|
| `weeks` | pregnancy | Completed weeks of pregnancy |
| `days` | pregnancy | Completed days past `weeks` (0–6) |
| `dueDate` | pregnancy | Estimated birth date |
| `daysUntilDue` | pregnancy | Days from today to `dueDate` |
| `birthDate` | born | Estimated birth date (there is no real birth date field) |
| `age` | born | Calendar span `birthDate` → today: years, months, days |
| `daysSinceBirth` | born | Days from `birthDate` to today |

## 1.3 Stages

```
pregnancy (elapsed 0–279) → born (elapsed ≥ 280)
```

`elapsed` = days from `lastPeriodDate` to `today`, never below 0.

**Rules:**

- The stage only moves forward with the date; there is no way back except editing `lastPeriodDate`.
- `weeks = floor(elapsed / 7)`, `days = elapsed mod 7` — completed weeks and days, the clinical `21+0` notation. The 148th day of pregnancy is elapsed 147, so it reads 21 weeks 0 days, not 21 weeks 1 day.
- `dueDate = lastPeriodDate + 280 days`; `daysUntilDue = 280 − elapsed` (1 on the last pregnancy day).
- Born: `birthDate = dueDate`, `daysSinceBirth = elapsed − 280` (0 on the first day).
- The growth card opens on the current step: week `weeks + 1` while pregnant (21 weeks 0 days → week 22), age `age.years` capped at 18 after birth.
- Current point, used by [3. Vaccination Record](3-vaccination.md) and [4. Prenatal Tests](4-prenatal-tests.md): week `weeks + 1` while pregnant; after birth month `12·age.years + age.months` while that is ≤ 24, then age `age.years` capped at 18. Day 280 is month 0.

## 1.4 Display

### 1.4.1 Dashboard summary — pregnancy

Example: last period `2026-06-03`, today `2026-10-28` (day 148).

| Line | vi | en |
|---|---|---|
| Headline | `21 tuần 0 ngày` | `21 weeks 0 days` |
| Detail | `Dự sinh 10/03/2027 · còn 133 ngày` | `Due Mar 10, 2027 · 133 days to go` |

**Gestational age format:**

- Always both parts, even when one is 0: `{weeks} tuần {days} ngày` / `{weeks} week(s) {days} day(s)`.
- English picks singular or plural per number: `1 week 1 day`, `0 weeks 0 days`.
- No "day N of pregnancy" line.

| Day of pregnancy | `elapsed` | vi | en |
|---|---|---|---|
| 1 | 0 | `0 tuần 0 ngày` | `0 weeks 0 days` |
| 4 | 3 | `0 tuần 3 ngày` | `0 weeks 3 days` |
| 8 | 7 | `1 tuần 0 ngày` | `1 week 0 days` |
| 9 | 8 | `1 tuần 1 ngày` | `1 week 1 day` |
| 148 | 147 | `21 tuần 0 ngày` | `21 weeks 0 days` |
| 210 | 209 | `29 tuần 6 ngày` | `29 weeks 6 days` |
| 280 | 279 | `39 tuần 6 ngày` | `39 weeks 6 days` |

### 1.4.2 Dashboard summary — born

| Line | vi | en |
|---|---|---|
| Headline | Child age (below) | Child age (below) |
| Detail 1 | `Đã chào đời {n} ngày` | `{n} days since birth` |
| Detail 2 | `Ngày sinh dự kiến {date}` | `Estimated birth date {date}` |

**Child age format:**

- Years > 0: years, plus months when months > 0 — `5 tuổi 3 tháng`, `6 years`.
- Under a year, months > 0: months, plus days when days > 0 — `3 tháng 2 ngày`.
- Under a month: days only — `0 ngày`, `12 days`.

### 1.4.3 Baby picker

Each row shows the baby's name, then the gender (when set) and the same headline as the dashboard: `Bé trai · 21 tuần 0 ngày`.

### 1.4.4 Dates and numbers

- Dates: vi `dd/MM/yyyy` (`10/03/2027`), en short month (`Mar 10, 2027`).
- Numbers use the locale's grouping: en `2,211`, vi `2.211`.

## 1.5 Guide steps

### Data model

| Field | Type | Meaning |
|---|---|---|
| `kind` | `"week"` \| `"month"` \| `"age"` | Step kind |
| `value` | integer | Week 1–40, month 0–24, age 0–18 |

| Step kind | Range | On the timeline | Guide route |
|---|---|---|---|
| `week` | 1–40 | Yes | `/{locale}/week/{1..40}/` |
| `month` | 0–24 | No — guide pages only | `/{locale}/month/{0..24}/` |
| `age` | 0–18 | Yes | `/{locale}/age/{0..18}/` |

### Timeline

```
week 1 → … → week 40 → age 0 → age 1 → … → age 18      (59 steps)
month 0 → month 1 → … → month 24                          (separate, guide only)
```

- Week N covers elapsed days `7(N−1)` … `7N−1`; elapsed 280 is age 0 and month 0.
- Previous / next on the timeline crosses from week 40 to age 0 and back.
- Month steps are not on the timeline: previous / next stays inside months; month 0 has no previous, month 24 has no next.
- The step selector shows a window of 5 steps of the same kind.

### Order between steps

Care items, vaccine doses and prenatal tests compare steps of different kinds with one order:

- Every `week` step comes before every `month` and `age` step.
- `month M` and `age Y` compare as `M` months against `12·Y` months: age 0 = month 0, age 1 = month 12, age 2 = month 24.

### Start date of a step

For a given baby, a step starts on:

| Step | Start date |
|---|---|
| `week N` | `lastPeriodDate + 7·(N−1)` days |
| `month M` | `birthDate` + `M` calendar months |
| `age Y` | `birthDate` + `12·Y` calendar months |

## 1.6 Reference figures

Figures are reference values, never personal measurements. Every page shows the disclaimer.

| Table | Rows | Values | Source |
|---|---|---|---|
| Pregnancy weeks | week pages 4–40 | fruit, length (cm), weight (g) | [Pregnancy week figures](#pregnancy-week-figures) |
| Pregnancy heart rate | week pages 6–40 | by week for weeks 6–12, 120–160 from week 13 | fetal heart rate references |
| Months | months 0–24 | length / height (cm), weight (kg), boy and girl; change since the previous month | WHO Child Growth Standards medians |
| Years | ages 0–18 | length / height (cm), weight (kg), boy and girl; change since the previous year; resting heart rate bands | WHO/CDC medians, see [Year figures](#year-figures) |

- Months 0–23 and ages 0–1 show length (lying down); month 24 and ages 2–18 show height (standing) — WHO switches at 24 months.
- Month 0, 12 and 24 rows equal the age 0, 1 and 2 rows.
- A month uses the resting heart rate band of age `floor(M / 12)`.
- No gender → height and weight are the boy–girl average.

### Change since the previous step

Each month and age figure shows how much it grew since the step before of the same kind, in brackets after the value: `66.7 cm (+1.7)`, `5.1 kg (+1.2)`.

**Rules:**

- Months 1–24 compare with the month before, ages 1–18 with the age before, for the same gender choice (boy, girl or the boy–girl average). Month 0 and age 0 have no change; week steps never show one. Month 12 and age 1 show the same figure with different changes: since month 11, and since age 0.
- A figure is rounded where it comes from, to the precision it is shown with: length to 0.1 cm; weight to 1 g under 10 kg and to 100 g from 10 kg. Halves round up, so the age-8 average height shows `127 cm` (126.95) and the age-12 one `150.2 cm` (150.15).
- The change is the difference of the two shown figures. Month 15 shows `9.95 kg` and month 16 `10.2 kg (+0.25)`.
- A measure shows no change when this step measures it differently from the step before, or takes it from another reference family. WHO 2006 and WHO 2007 are one family (WHO 2007 was built to join WHO 2006 at 5 years); CDC 2000 is another. The rule compares the row labels in [Year figures](#year-figures); no age is written into the code.
  - Month 24 and age 2: standing height after a lying length → no height change, method change note; the weight change still shows.
  - Age 11: CDC 2000 weight after a WHO 2007 weight → no weight change, source change note; the height change still shows.
- The change carries its sign and the locale's decimal separator, and no unit: it has the unit of the value before it. A weight change is in kg.
- When a change shows, the growth card adds the month or age change note. The boy / girl table shows the change in each cell and relies on the card's notes.
- The dashboard growth card of a born baby shows the age step for the baby's gender, so it shows the change since the previous year too.

| Month | Gender | vi | en |
|---|---|---|---|
| 0 | average | `49,5 cm` · `3,25 kg` | `49.5 cm` · `3.25 kg` |
| 1 | boy | `54,7 cm (+4,8)` · `4,5 kg (+1,2)` | `54.7 cm (+4.8)` · `4.5 kg (+1.2)` |
| 1 | average | `54,2 cm (+4,7)` · `4,35 kg (+1,1)` | `54.2 cm (+4.7)` · `4.35 kg (+1.1)` |
| 16 | average | `79,4 cm (+1,1)` · `10,2 kg (+0,25)` | `79.4 cm (+1.1)` · `10.2 kg (+0.25)` |
| 24 | boy | `87,1 cm` · `12,2 kg (+0,2)` | `87.1 cm` · `12.2 kg (+0.2)` |

| Age | Gender | vi | en |
|---|---|---|---|
| 0 | average | `49,5 cm` · `3,25 kg` | `49.5 cm` · `3.25 kg` |
| 1 | average | `74,9 cm (+25,4)` · `9,25 kg (+6)` | `74.9 cm (+25.4)` · `9.25 kg (+6)` |
| 2 | boy | `87,1 cm` · `12,2 kg (+2,6)` | `87.1 cm` · `12.2 kg (+2.6)` |
| 6 | boy | `116 cm (+6)` · `20,5 kg (+2,2)` | `116 cm (+6)` · `20.5 kg (+2.2)` |
| 11 | girl | `145 cm (+6,4)` · `37,4 kg` | `145 cm (+6.4)` · `37.4 kg` |
| 12 | boy | `149,1 cm (+6)` · `40,7 kg (+4,6)` | `149.1 cm (+6)` · `40.7 kg (+4.6)` |

### Year figures

Every cell of the year table comes from one source, read at exactly `12·Y` months (CDC at its `Agemos` row `12·Y + 0.5`, the row for completed month `12·Y`).

| Ages | Length / height | Method | Weight |
|---|---|---|---|
| 0–1 | WHO 2006 Child Growth Standards | lying (length) | WHO 2006 |
| 2–5 | WHO 2006 Child Growth Standards | standing (height) | WHO 2006 |
| 6–10 | WHO 2007 Growth Reference 5–19 years | standing | WHO 2007 |
| 11–18 | WHO 2007 Growth Reference 5–19 years | standing | CDC 2000 growth charts (WHO 2007 has no weight-for-age after 10 years) |

Tables read: WHO 2006 `lenanthro.txt` / `weianthro.txt` (age in days 0, 365, 731, 1096, 1461, 1826) and WHO 2007 `hfawho2007.txt` / `wfawho2007.txt` from the WHO `anthro` / `anthroplus` packages; CDC 2000 `statage.csv` / `wtage.csv`. The `M` (median) column, rounded to 0.1.

| Age | Boy height (cm) | Boy weight (kg) | Girl height (cm) | Girl weight (kg) |
|---|---|---|---|---|
| 11 | 143.1 | 36.1 | 145.0 | 37.4 |
| 12 | 149.1 | 40.7 | 151.2 | 41.8 |
| 13 | 156.0 | 45.8 | 156.4 | 46.0 |
| 14 | 163.2 | 51.2 | 159.8 | 49.5 |
| 15 | 169.0 | 56.5 | 161.7 | 52.1 |
| 16 | 172.9 | 61.1 | 162.5 | 53.9 |
| 17 | 175.2 | 64.7 | 162.9 | 55.2 |
| 18 | 176.1 | 67.3 | 163.1 | 56.2 |

### Pregnancy week figures

Rows are keyed by week page, the same week number as the source tables.

**Rules:**

- The page "Pregnancy week N" shows the row for week N: 21 weeks 0 days opens week 22, which shows the week-22 row. Fruit, length, weight and heart rate all follow the week page.
- Week pages 1–3 have no row: no fruit, and length and weight show "Not measurable yet".
- Length is crown–rump up to week 19 and crown–heel from week 20. The length label and the length note follow the same switch; the step 15.3 → 25.7 cm between week pages 19 and 20 is the change of method, not growth.
- Rows 4–7 are rough estimates — no published table covers them. Week pages 4–7 show the early-week estimate note.
- Lengths under 1 cm show in mm; weights under 1 g show as "under 1 g".
- Rows 8–19 come from the BabyCenter fetal development chart; rows 20–40 from Vinmec, "Bảng cân nặng và chiều dài thai nhi theo tiêu chuẩn của WHO". The source changes once, at the same row as the length method.

| Week page | Fruit | Length (cm) | Weight (g) |
|---|---|---|---|
| 4 | poppy seed | 0.1 | < 1 |
| 5 | sesame seed | 0.2 | < 1 |
| 6 | lentil | 0.5 | < 1 |
| 7 | blueberry | 1.0 | < 1 |
| 8 | raspberry | 1.6 | 1 |
| 9 | cherry | 2.3 | 2 |
| 10 | strawberry | 3.1 | 4 |
| 11 | fig | 4.1 | 7 |
| 12 | lime | 5.4 | 14 |
| 13 | peach | 7.4 | 23 |
| 14 | lemon | 8.7 | 43 |
| 15 | apple | 10.1 | 70 |
| 16 | avocado | 11.6 | 100 |
| 17 | pear | 13.0 | 140 |
| 18 | bell pepper | 14.2 | 190 |
| 19 | mango | 15.3 | 240 |
| 20 | banana | 25.7 | 330 |
| 21 | carrot | 27.4 | 400 |
| 22 | papaya | 29.0 | 476 |
| 23 | grapefruit | 30.6 | 565 |
| 24 | corn | 32.2 | 665 |
| 25 | cauliflower | 33.7 | 756 |
| 26 | lettuce | 35.1 | 900 |
| 27 | cabbage | 36.6 | 1,000 |
| 28 | pomelo | 37.6 | 1,100 |
| 29 | butternut squash | 39.3 | 1,239 |
| 30 | eggplant | 40.5 | 1,396 |
| 31 | coconut | 41.8 | 1,568 |
| 32 | jicama | 43.0 | 1,755 |
| 33 | pineapple | 44.1 | 2,000 |
| 34 | cantaloupe | 45.3 | 2,200 |
| 35 | honeydew | 46.3 | 2,378 |
| 36 | winter melon | 47.3 | 2,600 |
| 37 | leek | 48.3 | 2,800 |
| 38 | mini watermelon | 49.3 | 3,000 |
| 39 | pumpkin | 50.1 | 3,186 |
| 40 | watermelon | 51.0 | 3,338 |

## 1.7 Guide pages

### Week page `/{locale}/week/{N}/`

Heading "Pregnancy week N", fruit title, growth card (illustration, fruit, length, weight, heart rate, week note), the Care section, the Vaccines section, the Prenatal tests section ([4. Prenatal Tests](4-prenatal-tests.md)), "Track your baby" button, journey index.

- The fruit title names the week page, like the figures: `Thai {N} tuần: bé to bằng {fruit}` / `{N} weeks pregnant: your baby is the size of {fruit}`. Week pages 1–3 have no fruit: `Thai {N} tuần: sự phát triển của bé` / `{N} weeks pregnant: your baby's development`. English uses the singular for week 1: `1 week pregnant`.
- The page `<title>` is the fruit title followed by the app name.

### Month page `/{locale}/month/{M}/`

| Part | Content |
|---|---|
| Breadcrumbs | Home › Month by month › Month M |
| Heading | "Month M" |
| Growth card | Step selector over months; illustration of age `floor(M / 12)` from the neutral set; length or height and weight as the boy–girl average, each with its change since the previous month; heart rate band; month figures note, month change note, method change note in month 24 |
| Boy / girl table | Length or height and weight for boys and girls, each with its change since the previous month |
| Feeding and sleep section | see [5. Feeding and Sleep](5-feeding-sleep.md) |
| Care section | see [2. Care Guide](2-care-guide.md) |
| Skills section | see [6. Skills to Teach](6-skills.md) |
| Vaccines section | see [3. Vaccination Record](3-vaccination.md) |
| Footer | "Track your baby" button, journey index |

### Age page `/{locale}/age/{Y}/`

Heading "Age Y", milestone, growth card, boy / girl table, "Track your baby" button, journey index.

- Growth card and boy / girl table: length (ages 0–1) or height and weight, each with its change since the previous year (none at age 0; no height change at age 2; no weight change at age 11). The figures note is the month figures note at ages 0–1 (lying length, WHO) and the age figures note from age 2. The age change note, the method change note (age 2) and the source change note (age 11) follow the rules in 1.6.

- Age 0 shows a "Month by month" row linking to months 0–11; age 1 links to months 12–24.
- Ages 2–18 show, in this order, the Feeding and sleep section ([5. Feeding and Sleep](5-feeding-sleep.md)), the Care section, the Skills section ([6. Skills to Teach](6-skills.md)) and the Vaccines section.

### Journey index

Three link grids on the home page and every guide page: "40 weeks of pregnancy" (1–40), "Month by month" (0–24), "From 0 to 18 years" (0–18).

### Visible text

| Key | vi | en |
|---|---|---|
| Week length label, crown–rump | Chiều dài đầu–mông | Crown–rump length |
| Week length label, crown–heel | Chiều dài đầu–gót | Crown–heel length |
| Week length note | Đến tuần 19 đo từ đỉnh đầu tới mông; từ tuần 20 đo từ đỉnh đầu tới gót chân. | Up to week 19 measured crown to rump; from week 20 crown to heel. |
| Early-week estimate note | Số đo những tuần đầu chỉ là ước lượng. | Early-week figures are rough estimates. |
| Month heading | Tháng thứ {month} | Month {month} |
| Month index heading / breadcrumb | Từng tháng | Month by month |
| Month link label | Tháng {n} | Month {n} |
| Month image alt | Minh hoạ bé {month} tháng tuổi | Illustration of a {month}-month-old baby |
| Month figures note | Chiều dài, cân nặng là trung vị tham khảo của WHO. | Length and weight are WHO reference medians. |
| Value with change | {value} ({delta}) | {value} ({delta}) |
| Month change note | Số trong ngoặc là mức tăng so với tháng trước. | Figures in brackets show the change since the previous month. |
| Age change note | Số trong ngoặc là mức tăng so với năm trước. | Figures in brackets show the change since the previous year. |
| Method change note | Từ mốc này bé được đo đứng thay vì đo nằm, nên không tính mức tăng chiều cao. | From here the child is measured standing instead of lying down, so no height change is shown. |
| Source change note | {measure} ở mốc này lấy từ bảng chuẩn khác mốc trước, nên không tính mức tăng. | {measure} here comes from a different reference table than the step before, so no change is shown. |
| Age figures note | Chiều cao và cân nặng là trung vị tham khảo của WHO/CDC. | Height and weight are WHO/CDC reference medians. |

## 1.8 Images

| Path | Used for |
|---|---|
| `public/assets/baby/week-NN.svg` | Weeks 01–40 |
| `public/assets/baby/age-NN.svg` | Ages 00–18 without gender; months reuse `age-00` (0–11), `age-01` (12–23), `age-02` (24) |
| `public/assets/baby/{boy,girl}/age-NN.svg` | Ages 00–18 by gender (dashboard after birth) |
| `public/assets/size/<fruit>.svg` | Fruit size comparison |

## 1.9 SEO

- Every guide page has its own title, description, canonical URL and `hreflang` vi / en / x-default.
- Month page title: "Month {month}: baby length, weight and care"; description names the boy and girl medians.
- The sitemap lists every week, month and age path in both locales.
- Unknown values (`/week/41/`, `/month/25/`, `/age/19/`) are not generated and return 404.

---

## Routes

```
GET /{locale}/                 — Dashboard + journey index
GET /{locale}/week/{1..40}/    — Pregnancy week guide
GET /{locale}/month/{0..24}/   — Month guide
GET /{locale}/age/{0..18}/     — Age guide
```

All routes are prerendered at build time (static export); there is no API.

## Permissions

None. The app has no accounts; every page is public.
