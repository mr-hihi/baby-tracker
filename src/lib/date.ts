export type IsoDate = string;

export type CalendarSpan = { years: number; months: number; days: number };

const MS_PER_DAY = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parts(iso: IsoDate): [year: number, month: number, day: number] {
  const [year, month, day] = iso.split("-").map(Number);
  return [year, month, day];
}

function toUtcMs(iso: IsoDate): number {
  const [year, month, day] = parts(iso);
  return Date.UTC(year, month - 1, day);
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isIsoDate(value: string): value is IsoDate {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = parts(value);
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

export function toIsoDate(date: Date): IsoDate {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayIso(): IsoDate {
  return toIsoDate(new Date());
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY);
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  return new Date(toUtcMs(iso) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

export function addMonths(iso: IsoDate, months: number): IsoDate {
  const [year, month, day] = parts(iso);
  const total = year * 12 + (month - 1) + months;
  const nextYear = Math.floor(total / 12);
  const nextMonth = (total % 12) + 1;
  const nextDay = Math.min(day, daysInMonth(nextYear, nextMonth));
  return `${String(nextYear).padStart(4, "0")}-${String(nextMonth).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
}

export function calendarSpan(from: IsoDate, to: IsoDate): CalendarSpan {
  const [fromYear, fromMonth] = parts(from);
  const [toYear, toMonth] = parts(to);
  let months = (toYear - fromYear) * 12 + (toMonth - fromMonth);
  if (addMonths(from, months) > to) months -= 1;
  const days = daysBetween(addMonths(from, months), to);
  return { years: Math.floor(months / 12), months: months % 12, days };
}
