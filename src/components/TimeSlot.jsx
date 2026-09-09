import { cn } from "@/lib/utils";

export default function TimeSlot({ label, selected, unavailable, onSelect }) {
  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={() => onSelect?.(label)}
      className={cn(
        "ui-focus rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm",
        unavailable
          ? "border-border bg-muted text-muted-foreground cursor-not-allowed line-through opacity-70"
          : selected
            ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] -translate-y-0.5"
            : "border-border bg-card hover:border-primary hover:text-primary hover:-translate-y-0.5 cursor-pointer hover:shadow-[var(--shadow-card)]",
      )}
    >
      {label}
    </button>
  );
}
