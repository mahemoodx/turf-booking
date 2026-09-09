import { RotateCcw } from "lucide-react";
import { sports } from "@/data/sports";
import Button from "./Button";

function Section({ title, children }) {
  return (
    <div className="border-border border-b py-5 last:border-0">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      {children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, onReset, locations = [], facilityOptions = [] }) {
  const toggleArray = (key, value) => {
    const current = filters[key];
    onChange(
      key,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  return (
    <aside className="bg-card border-border shadow-card rounded-3xl border p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Filters</h3>
        <button
          onClick={onReset}
          className="text-muted-foreground hover:text-primary ui-focus flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <Section title="Location">
        <select
          value={filters.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="ui-field border-border bg-card w-full cursor-pointer rounded-xl border px-3 py-2.5 text-sm outline-none"
        >
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Section>

      <Section title="Turf Type">
        <div className="space-y-2">
          {sports.map((s) => (
            <label
              key={s.id}
              className="ui-check-row flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <input
                type="checkbox"
                className="ui-check size-4"
                checked={filters.sports.includes(s.id)}
                onChange={() => toggleArray("sports", s.id)}
              />
              {s.name}
            </label>
          ))}
        </div>
      </Section>

      <Section title={`Price up to ₹${filters.maxPrice}/hour`}>
        <input
          type="range"
          min={500}
          max={2000}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", Number(e.target.value))}
          className="ui-focus accent-primary w-full cursor-pointer rounded-full"
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>₹500</span>
          <span>₹2000</span>
        </div>
      </Section>

      <Section title="Minimum rating">
        <select
          aria-label="Minimum turf rating"
          value={filters.minRating}
          onChange={(e) => onChange("minRating", Number(e.target.value))}
          className="ui-field border-border bg-card w-full cursor-pointer rounded-xl border px-3 py-2.5 text-sm outline-none"
        >
          <option value={0}>Any rating</option>
          <option value={4}>4.0+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </select>
      </Section>

      <Section title="Facilities">
        <div className="space-y-2">
          {facilityOptions.map((f) => (
            <label
              key={f}
              className="ui-check-row flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <input
                type="checkbox"
                className="ui-check size-4"
                checked={filters.facilities.includes(f)}
                onChange={() => toggleArray("facilities", f)}
              />
              {f}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Availability">
        <label className="ui-check-row flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            className="ui-check size-4"
            checked={filters.availableToday}
            onChange={(e) => onChange("availableToday", e.target.checked)}
          />
          Available Today
        </label>
      </Section>

      <Button
        variant="outline"
        className="ui-focus mt-4 w-full"
        onClick={onReset}
      >
        Clear all filters
      </Button>
    </aside>
  );
}
