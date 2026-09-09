import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "No turfs found",
  message = "Try changing your filters or search.",
  action,
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center">
      <div className="bg-accent text-accent-foreground mb-4 flex size-14 items-center justify-center rounded-2xl">
        <SearchX size={26} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
