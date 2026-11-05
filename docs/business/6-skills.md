# 6. Skills to Teach

> One file = one domain. Every section below belongs to the domain "Skills to Teach".

## 6.1 Overview

Each month page (0–24) and age page (2–18) suggests skills parents can teach at that step, drawn from the parenting book *Em phải đến Harvard học kinh tế* (Vietnamese edition of 《哈佛女孩刘亦婷》, *Harvard Girl*, by Liu Weihua and Zhang Xinwu, 2000). The content is a static table, identical for every baby and prerendered into the page; nothing is stored. Code lives in `src/features/skills/`.

- Persona: parents (end users), reading.
- Depends on: [1. Baby Progress](1-baby-progress.md) (guide steps, guide pages), Locale (texts).
- Every text is a paraphrase in our own words, never a quotation from the book.

## 6.2 Skill item

### Data model

| Field | Type | Description |
|---|---|---|
| `id` | string (kebab-case, unique) | Stable key, e.g. `talk-all-day` |
| `stepKind` | `"month"` \| `"age"` | Step kind the item belongs to |
| `area` | `"language"` \| `"movement"` \| `"thinking"` \| `"character"` \| `"independence"` \| `"social"` | What the skill trains, shown as a badge |
| `from`, `to` | integer | First and last step the item applies to |
| `title` | text vi / en | Short name |
| `detail` | text vi / en | One or two sentences on what to do |

Texts live in the dictionaries under `skillItems[id]`; the `en` dictionary type forces every id to exist in both languages.

| Step kind | `from`–`to` bounds |
|---|---|
| `month` | 0–24 |
| `age` | 2–18 |

- An item belongs to one step kind; a skill that runs across months and ages is two items.
- Ages 0 and 1 have no items: those years are covered by months 0–24.

## 6.3 Display on a guide page

For the page of step `P` (kind `S`, value `v`):

1. Applicable items: `stepKind = S` and `from ≤ v ≤ to`.
2. Items with `from = v` first, each with the "New" badge of the step kind, then the others; ties keep the content table order.
3. Each item shows its title, its area badge, the "New" badge when new, and its detail.
4. One source line closes the section.

- Section "Skills to teach", one `h2`, after the Care section and before the Vaccines section. Pages: month 0–24, age 2–18. Age 0–1 pages and week pages have no section.
- The content is the same with or without a saved baby and is present in the prerendered HTML.

### Visible text

| Key | vi | en |
|---|---|---|
| Section heading | Dạy con | Skills to teach |
| Area `language` | Ngôn ngữ | Language |
| Area `movement` | Vận động | Movement |
| Area `thinking` | Tư duy | Thinking |
| Area `character` | Ý chí | Character |
| Area `independence` | Tự lập | Independence |
| Area `social` | Giao tiếp | Social |
| "New" badge | the Care badges: Mới tháng này / Mới năm nay | New this month / New this year |
| Source line | Theo sách “Em phải đến Harvard học kinh tế” (Lưu Vệ Hoa, Trương Hân Vũ) | From the book “Harvard Girl” (Liu Weihua, Zhang Xinwu) |

The Vietnamese spelling "Trương Hân Vũ" follows the Hai Phong University library record of the Vietnamese edition, read through a search result (⚠: the cover itself has not been checked; an earlier note spelled it "Võ").

## 6.4 Initial content

**Draft.** The content owner checks every item against the book before release.

- ✓: the practice appears in a published summary of the book (Wikipedia, "Harvard Girl"). That summary gives an education started at 15 days old, relatives invited so someone was always talking to her, no baby talk, arguing with reasons, swimming, skipping rope, holding ice, trips to the countryside and to historic sites, and acting in a TV series at five.
- ✓ part: only part of the item is in the summary. `plain-speech-child`: no baby talk is ✓, asking questions so the child retells is ⚠. `adult-topics`: treating her as an adult and asking for reasoned views are ✓, discussing real issues is ⚠.
- ⚠: from memory of the book; not yet checked. Neither the step range nor the chapter has been checked for any item; no table of contents was found.
- The book's ice-holding endurance exercise is left out on purpose because it can hurt a child; `small-challenges` keeps the aim (willpower) with a safe practice.

| `id` | Area | Step kind | Range | Book | Title (en) | Detail (en) |
|---|---|---|---|---|---|---|
| `talk-all-day` | language | month | 0–11 | ✓ | Talk all day | Talk to your baby through the day, naming what you do and see. In the book the parents began her education at 15 days old and asked relatives over so someone was always talking to her. |
| `move-every-day` | movement | month | 0–11 | ⚠ | Move every day | Tummy time while awake, with an adult watching; kicking in the bath while an adult always holds the baby. |
| `see-the-world` | thinking | month | 6–24 | ⚠ | Show the world | Take the baby outdoors and name the trees, animals and things they look at. |
| `plain-speech` | language | month | 12–24 | ✓ | Plain speech | Speak in clear, full sentences instead of baby talk, and give things their real names. |
| `plain-speech-child` | language | age | 2–5 | ✓ part | Full sentences | Keep speaking in full sentences, and ask questions that let the child tell the story in their own words. |
| `read-together` | language | age | 2–10 | ⚠ | Read together | Read with your child every day and talk about the pictures and the story. |
| `chores` | independence | age | 3–12 | ⚠ | Chores and self-care | Give small jobs the child can finish alone, such as dressing, tidying toys or setting the table. |
| `reasoned-talk` | thinking | age | 3–18 | ✓ | Disagree with reasons | Let the child disagree with you as long as they give their reasons, and answer with yours. |
| `swim-and-rope` | movement | age | 4–12 | ✓ | Swim and skip | Regular swimming and skipping rope build strength and stamina. |
| `perform` | social | age | 5–12 | ✓ | Speak up in front of others | Let the child speak, sing or act in front of others; in the book she acted in a TV series at five. |
| `trips` | thinking | age | 6–18 | ✓ | Learning trips | Visit the countryside and historic places, then ask the child to tell what they saw. |
| `focus` | character | age | 6–12 | ⚠ | Focused work time | Set a fixed time for homework with no distractions, and stop when it ends. |
| `small-challenges` | character | age | 8–18 | ⚠ | Small challenges | Build willpower with small, safe challenges the child picks and may stop at any time. |
| `plan-time` | independence | age | 10–18 | ⚠ | Plan the week | Let the child plan their own week of study and play, and review it together. |
| `adult-topics` | thinking | age | 13–18 | ✓ part | Talk as with an adult | Discuss real issues as you would with an adult, and expect a reasoned view. |
| `set-goals` | character | age | 13–18 | ⚠ | Set goals | Help the teen choose a long-term goal and split it into small steps. |

## 6.5 Content rules

Checked by unit tests on the content table:

- `id` is unique.
- `from ≤ to`, inside the step-kind bounds in 6.2.
- Every month 0–24 and every age 2–18 has at least one item.
- `area` is one of the six areas.
- Every `detail` has at most two sentences, in both languages.

---

## Routes

No route of its own. The section renders inside the guide pages of [1. Baby Progress](1-baby-progress.md): `/{locale}/month/{0..24}/`, `/{locale}/age/{2..18}/`.

## Permissions

None. The app has no accounts; the content is public.
