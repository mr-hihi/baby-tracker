import { Icon, type IconName } from "@/components/atoms/Icon";

export function StatRow({ icon, label, value }: { icon: IconName; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
        <Icon name={icon} className="size-6" />
      </span>
      <div>
        <dt className="text-sm text-muted">{label}</dt>
        <dd className="text-lg font-extrabold text-ink">{value}</dd>
      </div>
    </div>
  );
}
