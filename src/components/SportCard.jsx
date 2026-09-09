import { Link } from "@tanstack/react-router";

export default function SportCard({ sport }) {
  return (
    <Link
      to="/turfs"
      search={{ sport: sport.id }}
      className="bg-card border-border shadow-card hover:border-primary hover:shadow-lift group flex flex-col items-center rounded-3xl border px-4 py-7 transition-all duration-200 hover:-translate-y-1"
    >
      <span className="bg-accent flex size-14 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110">
        {sport.emoji}
      </span>
      <p className="mt-4 font-semibold">{sport.name}</p>
      <p className="text-muted-foreground text-xs">{sport.venues} venues</p>
    </Link>
  );
}
