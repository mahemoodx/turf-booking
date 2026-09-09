import { cn } from "@/lib/utils";

const variants = {
  primary:
    "relative overflow-hidden bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] hover:brightness-105 hover:-translate-y-0.5 before:pointer-events-none before:absolute before:inset-y-0 before:-left-full before:w-1/2 before:skew-x-[-20deg] before:bg-white/25 before:transition-[left] before:duration-600 before:ease-out hover:before:left-[150%]",
  deep: "surface-deep hover:opacity-92",
  outline: "border border-border bg-card text-foreground hover:bg-accent",
  ghost: "text-foreground hover:bg-accent",
  light:
    "bg-card/12 text-primary-deep-foreground border border-primary-deep-foreground/25 hover:bg-card/22 backdrop-blur",
  danger:
    "border border-destructive/40 text-destructive hover:bg-destructive/10",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <Comp
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
