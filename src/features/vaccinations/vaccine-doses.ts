import type { IsoDate } from "@/lib/date";

export const VACCINES =["tetanus", "hepb", "bcg", "dtp-hepb-hib", "opv", "ipv", "measles", "je", "dtp", "mr"] as const;

export type Vaccine = (typeof VACCINES)[number];
export type DoseSubject = "mother" | "baby";

type VaccineDoseFields = {
  id: string;
  vaccine: Vaccine;
  dose: number | "booster";
  subject: DoseSubject;
  stepKind: "week" | "month";
  from: number;
  to: number;
};

export const VACCINE_DOSES = [
  { id: "tetanus-1", vaccine: "tetanus", dose: 1, subject: "mother", stepKind: "week", from: 20, to: 32 },
  { id: "tetanus-2", vaccine: "tetanus", dose: 2, subject: "mother", stepKind: "week", from: 24, to: 36 },
  { id: "hepb-birth", vaccine: "hepb", dose: 1, subject: "baby", stepKind: "month", from: 0, to: 0 },
  { id: "bcg", vaccine: "bcg", dose: 1, subject: "baby", stepKind: "month", from: 0, to: 0 },
  { id: "dtp-hepb-hib-1", vaccine: "dtp-hepb-hib", dose: 1, subject: "baby", stepKind: "month", from: 2, to: 2 },
  { id: "opv-1", vaccine: "opv", dose: 1, subject: "baby", stepKind: "month", from: 2, to: 2 },
  { id: "dtp-hepb-hib-2", vaccine: "dtp-hepb-hib", dose: 2, subject: "baby", stepKind: "month", from: 3, to: 3 },
  { id: "opv-2", vaccine: "opv", dose: 2, subject: "baby", stepKind: "month", from: 3, to: 3 },
  { id: "dtp-hepb-hib-3", vaccine: "dtp-hepb-hib", dose: 3, subject: "baby", stepKind: "month", from: 4, to: 4 },
  { id: "opv-3", vaccine: "opv", dose: 3, subject: "baby", stepKind: "month", from: 4, to: 4 },
  { id: "ipv-1", vaccine: "ipv", dose: 1, subject: "baby", stepKind: "month", from: 5, to: 5 },
  { id: "measles-1", vaccine: "measles", dose: 1, subject: "baby", stepKind: "month", from: 9, to: 9 },
  { id: "ipv-2", vaccine: "ipv", dose: 2, subject: "baby", stepKind: "month", from: 9, to: 9 },
  { id: "je-1", vaccine: "je", dose: 1, subject: "baby", stepKind: "month", from: 12, to: 12 },
  { id: "je-2", vaccine: "je", dose: 2, subject: "baby", stepKind: "month", from: 12, to: 12 },
  { id: "dtp-booster", vaccine: "dtp", dose: "booster", subject: "baby", stepKind: "month", from: 18, to: 18 },
  { id: "mr", vaccine: "mr", dose: 1, subject: "baby", stepKind: "month", from: 18, to: 18 },
  { id: "je-3", vaccine: "je", dose: 3, subject: "baby", stepKind: "month", from: 24, to: 24 },
] as const satisfies readonly VaccineDoseFields[];

export type VaccineDose = (typeof VACCINE_DOSES)[number];
export type VaccineDoseId = VaccineDose["id"];

export type VaccinationRecord = Partial<Record<string, IsoDate>>;
