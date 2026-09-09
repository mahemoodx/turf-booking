import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

export function TurfCardSkeleton({ layout = "grid" }) {
  const list = layout === "list";
  return (
    <div
      className={cn(
        "bg-card border-border shadow-card overflow-hidden rounded-3xl border",
        list && "sm:flex",
      )}
    >
      <Skeleton
        className={cn(
          "rounded-none",
          list ? "h-48 sm:h-auto sm:w-72 sm:shrink-0" : "h-52",
        )}
      />
      <div className="flex-1 space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-14" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TurfGridSkeleton({ count = 6, layout = "grid" }) {
  return (
    <div
      className={
        layout === "grid"
          ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <TurfCardSkeleton key={i} layout={layout} />
      ))}
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-card border-border shadow-card overflow-hidden rounded-3xl border sm:flex">
      <Skeleton className="h-40 w-full rounded-none sm:h-auto sm:w-56 sm:shrink-0" />
      <div className="flex-1 space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-9 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
