import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Rating({ value = 0, count, className, size = 14 }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value)
              ? "fill-warning text-warning"
              : "text-muted-foreground/40"
          }
        />
      ))}
      <span className="ml-1 font-semibold">{value.toFixed(1)}</span>
      {count != null && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </span>
  );
}
