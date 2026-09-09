import { Link } from "@tanstack/react-router";
import { MapPin, Zap } from "lucide-react";
import Rating from "./Rating";
import Button from "./Button";
import { cn } from "@/lib/utils";

export default function TurfCard({ turf, layout = "grid" }) {
  const list = layout === "list";
  return (
    <article
      className={cn(
        "turf-card bg-card border-border shadow-card group overflow-hidden rounded-3xl border",
        list && "sm:flex",
      )}
    >
      <div
        className={cn(
          "media-frame",
          list ? "h-48 sm:h-auto sm:w-72 sm:shrink-0" : "h-52 sm:h-56",
        )}
      >
        <img
          src={turf.images[0]}
          alt={`${turf.name} in ${turf.area}`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover"
        />
        <span className="bg-card/85 text-foreground absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-semibold capitalize backdrop-blur-md">
          {turf.sport}
        </span>
        {turf.availableToday && (
          <span className="bg-[image:var(--gradient-primary)] text-primary-foreground absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
            <Zap size={12} /> Today
          </span>
        )}
        <span className="text-primary-deep-foreground absolute bottom-3 left-3 z-10 flex items-center gap-1 text-xs font-medium drop-shadow-md">
          <MapPin size={13} /> {turf.area}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="group-hover:text-primary text-lg leading-tight font-semibold transition-colors">
            {turf.name}
          </h3>
          <Rating value={turf.rating} size={13} className="shrink-0" />
        </div>
        <p className="text-muted-foreground mt-1.5 flex items-center gap-1 text-sm">
          <MapPin size={14} /> {turf.area}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {turf.facilities.slice(0, 3).map((f) => (
            <span
              key={f}
              className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs transition-colors group-hover:bg-[color-mix(in_oklab,var(--primary)_16%,var(--secondary))]"
            >
              {f}
            </span>
          ))}
          {turf.facilities.length > 3 && (
            <span className="text-muted-foreground px-1 py-1 text-xs">
              +{turf.facilities.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xl font-bold">
            ₹{turf.price}
            <span className="text-muted-foreground text-sm font-normal">
              /hour
            </span>
          </p>
          <Button
            as={Link}
            to="/turfs/$id"
            params={{ id: turf.id }}
            size="sm"
            className="ui-focus no-underline"
          >
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}
