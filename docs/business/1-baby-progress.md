# 1. Baby Progress (Tiến trình của bé)

> One file = one domain. Every section below belongs to the "Baby progress" domain.

## 1.1 Purpose

Shows where each baby is today, worked out from the first day of the last period: the gestational age while pregnant, the child's age after birth. Read by parents on the dashboard summary and in the baby picker. Adding, choosing and editing a baby belong to another domain.

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
