# 5. Feeding and Sleep

> One file = one domain. Every section below belongs to the domain "Feeding and Sleep".

## 5.1 Overview

Each month page (0–24) and age page (2–18) gives parents a day rhythm to follow: how often and how much milk, or how many meals, and how long the child sleeps. The figures are reference ranges from named sources, identical for every baby and prerendered into the page; nothing is stored. What to eat and what to avoid stays in [2. Care Guide](2-care-guide.md). Code lives in `src/features/routine/`.

- Persona: parents (end users), reading.
- Depends on: [1. Baby Progress](1-baby-progress.md) (guide steps, guide pages), Locale (texts).
- Content is a reference schedule, not a prescription; every page keeps the disclaimer. A breastfed baby is still fed whenever the baby asks.

## 5.2 Data model

`Range` is `[min, max]` with `0 < min ≤ max`; when `min = max` one number is shown.

### Feeding stage

| Shape | Step kind | Steps | Fields |
|---|---|---|---|
| `MilkStage` | `month` | 0–11 | `intervalHours` (hours between feeds), `mlPerFeed` (bottle feed), `feedsPerDay` |
| `MealStage` | `month` | 12–24 | `dairyMl` (milk and dairy, ml a day) |
| `MealStage` | `age` | 2–18 | `mainMeals`, `snacks`, `dairyMl` |

Every feeding stage also has `id` (kebab-case, unique), `stepKind`, `from`, `to` and `source`. A month meal stage has no `mainMeals` and no `snacks`: at 12–24 months the number of meals is the Care item `family-food`, on the same page, and stays there only.

### Sleep stage

| Field | Type | Description |
|---|---|---|
| `id` | string (kebab-case, unique) | Stable key, e.g. `sleep-newborn` |
| `stepKind` | `"month"` \| `"age"` | Step kind the stage belongs to |
| `from`, `to` | integer | First and last step of the stage |
| `totalHours` | `Range` | Sleep per 24 hours, naps included |
| `hoursSource` | `"who-2019"` \| `"aasm-2016"` | Source of `totalHours` |
| `naps` | `Range`, optional | Daytime naps; absent when no source gives a count |
| `napsSource` | `"easy"`, set together with `naps` | Source of `naps`: neither WHO nor the AASM counts naps |

Texts live in the dictionaries: `routineStages[id]` is a one-line tip for the stage; labels, units and source names are under `routine`. The `en` dictionary type forces every id to exist in both languages.

## 5.3 Display on a guide page

For the page of step `P` (kind `S`, value `v`), the stage of each table with `stepKind = S` and `from ≤ v ≤ to`.

- Section "Feeding and sleep", one `h2`, below the boy / girl table and before the Care section. Pages: month 0–24, age 2–18. Age 0–1 pages (their months cover them) and week pages have no section.
- Feeding block, milk stage: rows "Feed every", "Per bottle feed", "Feeds a day", the stage tip, the breastfeeding note, the formula limit note, the source line.
- Feeding block, meal stage: rows "Main meals" and "Snacks" (age stages only), "Milk and dairy", the stage tip, the source line.
- Sleep block: rows "Total sleep", "Daytime naps" (hidden when `naps` is absent), the stage tip, then one source line for the hours and, when naps show, one for the naps.
- A range shows as `min–max` with the locale's decimal separator (`2,5–3 giờ`, `2.5–3 hours`); `min = max` shows one number (`4 hours`, `1 nap`).
- The content is the same with or without a saved baby and is present in the prerendered HTML.

### Visible text

| Key | vi | en |
|---|---|---|
| Section heading | Ăn & ngủ | Feeding and sleep |
| Feeding block | Ăn | Feeding |
| Sleep block | Ngủ | Sleep |
| Feed every | Cách nhau | Feed every |
| Per bottle feed | Mỗi cữ (bú bình) | Per bottle feed |
| Feeds a day | Số cữ mỗi ngày | Feeds a day |
| Main meals | Bữa chính | Main meals |
| Snacks | Bữa phụ | Snacks |
| Milk and dairy | Sữa và chế phẩm sữa (quy ra sữa) | Milk and dairy (as milk) |
| Total sleep | Tổng giờ ngủ | Total sleep |
| Daytime naps | Giấc ngày | Daytime naps |
| Hours | {n} giờ | {n} hour / {n} hours |
| Hours a day | {n} giờ/ngày | {n} hours a day |
| Millilitres | {n} ml | {n} ml |
| Millilitres a day | {n} ml/ngày | {n} ml a day |
| Feeds | {n} cữ | {n} feed / {n} feeds |
| Meals | {n} bữa | {n} meal / {n} meals |
| Naps | {n} giấc | {n} nap / {n} naps |
| Breastfeeding note | Lịch tham khảo; bé bú mẹ vẫn cho bú khi bé đòi. Lượng ml chỉ dành cho bú bình. | A reference schedule: a breastfed baby still feeds whenever they ask. The amounts are for bottle feeds only. |
| Formula limit note | Lượng mỗi cữ và số cữ không nhân thẳng với nhau: nhiều cữ thì mỗi cữ ít hơn. Tổng sữa công thức thường không quá 960 ml/ngày. | Amount and number of feeds do not multiply: more feeds mean smaller ones. Formula usually stays under 960 ml a day in total. |
| Source line | Nguồn: {source} | Source: {source} |
| Naps source line | Số giấc: {source} | Naps: {source} |
| Source `easy-aap` | Nhịp E.A.S.Y. (Tracy Hogg); lượng sữa theo AAP | E.A.S.Y. rhythm (Tracy Hogg); amounts from the AAP |
| Source `aap` | AAP | AAP |
| Source `aap-dga` | Số bữa theo AAP; sữa theo Dietary Guidelines for Americans | Meals from the AAP; dairy from the Dietary Guidelines for Americans |
| Source `who-2019` | WHO 2019 | WHO 2019 |
| Source `aasm-2016` | AASM 2016 (AAP chấp thuận) | AASM 2016 (endorsed by the AAP) |
| Source `easy` | E.A.S.Y. (Tracy Hogg) | E.A.S.Y. (Tracy Hogg) |

## 5.4 Initial content

**Draft.** Every tip is paraphrased, never quoted. The figures marked ⚠ come from the E.A.S.Y. method and have not yet been checked against the books. The content owner checks them before release, together with every range below against the current guidance.

### Feeding

| `id` | Step kind | Range | Feed every (h) | Per bottle feed (ml) | Feeds a day | Source | Tip (en) |
|---|---|---|---|---|---|---|---|
| `milk-newborn` | month | 0–0 | 2.5–3 ⚠ | 30–90 | 8–10 ⚠ | easy-aap | Feed when the baby wakes, then a short awake time, then sleep; about every 3 hours, nights included |
| `milk-3-hour` | month | 1–3 | 3–3.5 ⚠ | 90–120 | 6–8 ⚠ | easy-aap | Keep the 3-hour eat, play, sleep cycle by day; let the night stretch grow as the baby gains weight |
| `milk-4-hour` | month | 4–5 | 3.5–4 ⚠ | 120–180 ⚠ | 4–5 ⚠ | easy-aap | Move to a 4-hour cycle: fewer, larger feeds and longer play; a late-evening feed helps the night |
| `milk-with-solids` | month | 6–8 | 4 ⚠ | 180–240 | 4–5 | easy-aap | Keep the 4-hour cycle and offer solids after a milk feed; milk is still the main food |
| `milk-three-meals` | month | 9–11 | 4–5 ⚠ | 180–240 | 3–4 ⚠ | easy-aap | Solid meals settle into the day; milk comes on waking, between meals and at bedtime |

| `id` | Step kind | Range | Main meals | Snacks | Milk and dairy (ml a day) | Source | Tip (en) |
|---|---|---|---|---|---|---|---|
| `meals-family` | month | 12–24 | — | — | 480–720 | aap | Keep breastfeeding up to 24 months; otherwise whole cow's milk from a cup, with meals or snacks |
| `meals-toddler` | age | 2–3 | 3 | 2 | 480 | aap-dga | Meals and snacks at set times, sitting at the table; water in between |
| `meals-preschool` | age | 4–5 | 3 | 2 | 600 | aap-dga | Keep set meal times; let the child serve and feed themselves |
| `meals-school` | age | 6–8 | 3 | 1–2 ⚠ | 600 | aap-dga | Breakfast every day; a snack after school carries the child to dinner |
| `meals-older` | age | 9–18 | 3 | 1–2 ⚠ | 720 | aap-dga | Growth spurts raise appetite; keep breakfast and regular family meals |

### Sleep

| `id` | Step kind | Range | Total sleep (h a day) | Hours source | Daytime naps (source `easy`) | Tip (en) |
|---|---|---|---|---|---|---|
| `sleep-newborn` | month | 0–0 | 14–17 | who-2019 | 4–5 ⚠ | Lay the baby down drowsy but awake, on the back, in their own sleep space |
| `sleep-young-infant` | month | 1–3 | 14–17 | who-2019 | 3–4 ⚠ | Start the wind-down at the first yawn or stare, before the baby is overtired |
| `sleep-three-naps` | month | 4–5 | 12–16 | who-2019 | 3–4 ⚠ | Three longer naps and a short late-afternoon one |
| `sleep-two-three-naps` | month | 6–8 | 12–16 | who-2019 | 2–3 ⚠ | The late-afternoon nap drops out; keep the same bedtime routine every night |
| `sleep-two-naps` | month | 9–11 | 12–16 | who-2019 | 2 ⚠ | A morning and an afternoon nap, bedtime at the same time each night |
| `sleep-one-two-naps` | month | 12–17 | 11–14 | who-2019 | 1–2 ⚠ | The morning nap fades; move to one midday nap when the child resists it |
| `sleep-one-nap` | month | 18–24 | 11–14 | who-2019 | 1 ⚠ | One midday nap; a calm routine before bed |
| `sleep-age-2` | age | 2–2 | 11–14 | who-2019 | 1 ⚠ | One afternoon nap and a story at bedtime |
| `sleep-preschool` | age | 3–4 | 10–13 | who-2019 | — | The nap may stop; keep a quiet time and regular bed and wake times |
| `sleep-age-5` | age | 5–5 | 10–13 | aasm-2016 | — | Regular bed and wake times, weekends too |
| `sleep-school` | age | 6–12 | 9–12 | aasm-2016 | — | No screens in the hour before bed; a dark, cool bedroom |
| `sleep-teen` | age | 13–18 | 8–10 | aasm-2016 | — | Teens drift later; protect a regular bedtime and limit late screens |

### Sources

- Bottle amounts and the 960 ml limit: AAP, HealthyChildren.org, "Amount and Schedule of Baby Formula Feedings" (updated 2022-05-16), adapted from *Caring for Your Baby and Young Child: Birth to Age 5*, 7th ed., 2019. It gives 30–60 ml in the first week, 90–120 ml by the end of the first month every 3–4 hours, and 180–240 ml 4–5 times a day at 6 months. Months 1–3 use the end-of-first-month figure; months 4–5 (120–180 ml, ⚠) are interpolated between it and the 6-month figure. The per-feed range and the feeds a day are separate ranges, not a product: their upper ends together can pass the 960 ml limit, which the formula limit note states.
- Milk at 12–24 months (480–720 ml a day of whole cow's milk when not breastfed): AAP. Meals at 12–24 months are not repeated here; see the Care item `family-food`.
- Dairy at ages 2–18: Dietary Guidelines for Americans 2020–2025, 2 cup-equivalents a day at 2–3 years, 2½ at 4–8, 3 at 9–18. A cup-equivalent counts yoghurt and cheese as their milk equivalent, hence "as milk"; one cup is counted as 240 ml.
- Sleep hours 0–4 years: WHO, *Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age* (2019). Sleep hours 5–18 years: Paruthi et al., "Recommended Amount of Sleep for Pediatric Populations", *J Clin Sleep Med* 2016;12(6):785–786 (AASM, endorsed by the AAP).
- E.A.S.Y. rhythm and nap counts (⚠, chapters not yet checked; neither WHO nor the AASM counts naps): Tracy Hogg with Melinda Blau, *Secrets of the Baby Whisperer* (2001), ch. 2 "E.A.S.Y. Does It", and *The Baby Whisperer Solves All Your Problems* (2005), ch. 1 on the routine by age and the sleep chapters.
- Snacks at 6–18 years (⚠): found only in secondary sources that cite the AAP.

## 5.5 Content rules

Checked by unit tests on the content tables:

- `id` is unique across feeding and sleep stages.
- `from ≤ to`, inside the step-kind bounds: month 0–24, age 2–18.
- The feeding table and the sleep table each cover months 0–24 and ages 2–18 with no gap and no overlap.
- A milk stage covers only months 0–11.
- A month meal stage has no `mainMeals` and no `snacks`; an age meal stage has both.
- Every `Range` has `0 < min ≤ max`.
- Ages 0–1 and week steps have no stage.

---

## Routes

No route of its own. The section renders inside the guide pages of [1. Baby Progress](1-baby-progress.md): `/{locale}/month/{0..24}/`, `/{locale}/age/{2..18}/`.

## Permissions

None. The app has no accounts; the content is public.
