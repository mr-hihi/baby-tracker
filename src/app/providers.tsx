"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { babiesLoaded } from "@/features/babies/babiesSlice";
import { LocaleProvider } from "@/features/locale/LocaleProvider";
import type { Locale } from "@/features/locale/locales";
import { makeStore } from "@/store";
import { readSavedBabies, writeSavedBabies } from "@/store/persistence";

export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(babiesLoaded(readSavedBabies()));
    let saved = store.getState().babies;
    return store.subscribe(() => {
      const { babies } = store.getState();
      if (babies === saved) return;
      saved = babies;
      writeSavedBabies({ items: babies.items, selectedId: babies.selectedId });
    });
  }, [store]);

  return (
    <Provider store={store}>
      <LocaleProvider locale={locale}>{children}</LocaleProvider>
    </Provider>
  );
}
