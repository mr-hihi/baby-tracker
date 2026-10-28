# Project Overview

## Purpose

Let parents follow a baby day by day: pregnancy week, size compared to a fruit, length, weight, heart rate, then — after birth — age, average height / weight and a milestone per year, up to 18.

## Users and platform

- Parents-to-be and parents; Vietnamese first, English second.
- Mobile-first: one centred column, touch-sized controls (sizes in `styling.md`).
- Runs fully in the browser; works from any static host (GitHub Pages).

## Scope

| In | Out |
|---|---|
| Several babies per browser; add, choose, edit | Accounts, sync between devices, backend |
| Baby = name + first day of last period + optional gender | Real birth date, measurements entered by the parent |
| Weekly pages 1–40, yearly pages 0–18, in vi / en | Medical advice — every page carries the disclaimer |
| Illustrations per week and per year (boy / girl / neutral) | Photo upload |

## Business rules

- **Critical:** gestational age is counted from the first day of the last period; the estimated birth date is that day + 280 days (9 months 10 days).
- **Critical:** after birth the age is counted from the estimated birth date; there is no real birth date field.
- **Critical:** the last period date may not be in the future.
- Images after birth follow the gender; no gender → the neutral set.
- Figures are reference values (pregnancy tables, WHO/CDC medians), never personal measurements.
