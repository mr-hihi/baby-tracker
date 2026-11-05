# Project Overview

## Purpose

Let parents follow a baby day by day: pregnancy week, size compared to a fruit, length, weight, heart rate, then — after birth — month by month up to 24 months and a milestone per year up to 18, each figure with its change since the step before. After birth each month and year also gives a day rhythm (how often and how much milk or how many meals, and how long the child sleeps) and the skills to teach at that age. Each step also says what to supplement, what to eat and what to avoid, which national vaccines are due and, during pregnancy, which screening tests (NIPT) to take; parents record the doses given and tests done per baby.

## Users and platform

- Parents-to-be and parents; Vietnamese first, English second.
- Mobile-first: one centred column, touch-sized controls (sizes in `styling.md`).
- Runs fully in the browser; works from any static host (GitHub Pages).

## Scope

| In | Out |
|---|---|
| Several babies per browser; add, choose, edit | Accounts, sync between devices, backend |
| Baby = name + first day of last period + optional gender + vaccination and prenatal test records | Real birth date, growth measurements entered by the parent |
| Weekly pages 1–40, monthly pages 0–24, yearly pages 0–18, vaccination and prenatal test schedule pages, in vi / en | Personal medical advice — every page carries the disclaimer |
| Reference care advice with doses and a named source (Ministry of Health, WHO); national immunization (TCMR) vaccines | Service (paid) vaccines |
| Reference feeding and sleep schedule per month and year (E.A.S.Y. rhythm, AAP, WHO, AASM) | Tracking the feeds or sleep of a baby |
| Skills to teach per month and year, paraphrased from the book *Em phải đến Harvard học kinh tế* | Tracking which skills a child has learned |
| Prenatal screening tests (NIPT) with the date done | Test results |
| Illustrations per week and per year (boy / girl / neutral) | Photo upload |

## Business rules

- **Critical:** gestational age is counted from the first day of the last period; the estimated birth date is that day + 280 days (9 months 10 days).
- **Critical:** after birth the age is counted from the estimated birth date; there is no real birth date field.
- **Critical:** the last period date may not be in the future.
- Images after birth follow the gender; no gender → the neutral set.
- Figures are reference values (pregnancy tables, WHO/CDC medians), never personal measurements.
- Care and vaccine content is reference advice with a named source, verified against current Ministry of Health / WHO guidance before release.
- The feeding and sleep schedule is a reference: a breastfed baby still feeds on demand, and bottle amounts are for bottle feeds only.
- A vaccine dose date or a prenatal test date is entered by the parent; it may not be in the future or before the last period date.
- Business specs per domain: [business.md](business.md).
