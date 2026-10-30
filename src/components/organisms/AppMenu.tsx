"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { selectBabies } from "@/features/babies/babiesSlice";
import { dialogOpened, type DialogKind } from "@/features/dialogs/dialogSlice";
import { useLocale } from "@/features/locale/LocaleProvider";
import { LOCALES, switchLocaleInPath } from "@/features/locale/locales";
import { rememberLocale } from "@/features/locale/preference";
import { localePath, VACCINES_PATH } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const MENU_ID = "app-menu";

const MENU_ITEM =
  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left font-bold text-ink transition-colors hover:bg-brand-soft disabled:opacity-40";

function MenuIcon({ icon }: { icon: IconName }) {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
      <Icon name={icon} />
    </span>
  );
}

function MenuAction({ icon, label, disabled, onClick }: {
  icon: IconName;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" role="menuitem" disabled={disabled} onClick={onClick} className={MENU_ITEM}>
      <MenuIcon icon={icon} />
      {label}
    </button>
  );
}

function MenuLink({ icon, label, href, onClick }: { icon: IconName; label: string; href: string; onClick: () => void }) {
  return (
    <Link href={href} role="menuitem" onClick={onClick} className={MENU_ITEM}>
      <MenuIcon icon={icon} />
      {label}
    </Link>
  );
}

export function AppMenu() {
  const { locale, dict } = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const babies = useAppSelector(selectBabies);
  const menuRef = useRef<HTMLDivElement>(null);

  function open(kind: DialogKind) {
    menuRef.current?.hidePopover();
    dispatch(dialogOpened(kind));
  }

  return (
    <>
      <button
        type="button"
        popoverTarget={MENU_ID}
        aria-label={dict.menu.open}
        aria-haspopup="menu"
        className="grid size-11 place-items-center rounded-2xl border-2 border-brand-soft bg-surface text-brand transition-colors hover:bg-brand-soft"
      >
        <Icon name="menu" />
      </button>
      <div
        id={MENU_ID}
        ref={menuRef}
        popover="auto"
        role="menu"
        aria-label={dict.menu.open}
        className="fixed top-16 right-[max(1rem,calc((100vw-28rem)/2+1rem))] bottom-auto left-auto m-0 w-64 rounded-3xl bg-surface p-2 text-ink shadow-float"
      >
        <MenuAction icon="plus" label={dict.menu.addBaby} onClick={() => open("add-baby")} />
        <MenuAction
          icon="swap"
          label={dict.menu.chooseBaby}
          disabled={babies.length === 0}
          onClick={() => open("choose-baby")}
        />
        <MenuAction
          icon="pencil"
          label={dict.menu.editBaby}
          disabled={babies.length === 0}
          onClick={() => open("edit-baby")}
        />
        <MenuLink
          icon="syringe"
          label={dict.menu.vaccines}
          href={localePath(locale, VACCINES_PATH)}
          onClick={() => menuRef.current?.hidePopover()}
        />
        <div className="mt-1 border-t border-line px-3 pt-3 pb-2">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-muted">
            <Icon name="globe" className="size-4" />
            {dict.menu.language}
          </p>
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-page p-1">
            {LOCALES.map((target) => (
              <Link
                key={target}
                href={switchLocaleInPath(pathname, target)}
                hrefLang={target}
                lang={target}
                aria-current={target === locale ? "true" : undefined}
                onClick={() => {
                  rememberLocale(target);
                  menuRef.current?.hidePopover();
                }}
                className={`rounded-xl px-3 py-2 text-center text-sm font-bold transition-colors ${
                  target === locale ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"
                }`}
              >
                {dict.languages[target]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
