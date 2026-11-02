import type { ReactNode } from "react";
import type { Dictionary } from "@/features/locale/dictionaries";
import { describeTest } from "@/features/prenatal-tests/describeTest";
import type { PrenatalTest } from "@/features/prenatal-tests/prenatal-tests";

export function TestRow({ test, dict, children }: { test: PrenatalTest; dict: Dictionary; children?: ReactNode }) {
  const { name, weeks, note } = describeTest(test, dict);
  return (
    <li className="rounded-2xl bg-page px-3 py-2">
      <p className="font-bold">
        {name} <span className="font-normal text-muted">· {weeks}</span>
      </p>
      <p className="mt-0.5 text-xs text-muted">{note}</p>
      {children}
    </li>
  );
}
