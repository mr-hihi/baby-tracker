import type { ReactNode } from "react";

export function PageShell({ disclaimer, children }: { disclaimer: string; children: ReactNode }) {
  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 pt-2 pb-10">{children}</main>
      <footer className="mx-auto w-full max-w-md px-4 pb-10 text-center text-xs text-muted">{disclaimer}</footer>
    </>
  );
}
