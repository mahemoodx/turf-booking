import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import PageHero from "@/components/PageHero";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import TurfCard from "@/components/TurfCard";
import EmptyState from "@/components/EmptyState";
import { TurfGridSkeleton } from "@/components/Skeleton";
import Button from "@/components/Button";
import { turfApi } from "@/lib/api";

export const Route = createFileRoute("/turfs/")({
  validateSearch: (search) => ({
    location: search.location ? String(search.location) : "",
    sport: search.sport ? String(search.sport) : "",
    date: search.date ? String(search.date) : "",
    time: search.time ? String(search.time) : "",
  }),
  head: () => ({
    meta: [
      { title: "Browse Turfs — Search & Book Sports Venues | TurfBook" },
      {
        name: "description",
        content:
          "Filter turfs by city, sport, price, facilities and availability, then book your slot instantly on TurfBook.",
      },
      { property: "og:title", content: "Browse Turfs | TurfBook" },
      {
        property: "og:description",
        content:
          "Filter turfs by city, sport, price, facilities and availability.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TurfsPage,
});

const defaultFilters = (search) => ({
  location: search.location || "",
  sports: search.sport ? [search.sport] : [],
  maxPrice: 2000,
  minRating: 0,
  facilities: [],
  availableToday: false,
});

function TurfsPage() {
  const search = Route.useSearch();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(() => defaultFilters(search));
  const [sort, setSort] = useState("recommended");
  const [layout, setLayout] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [locations, setLocations] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);

  useEffect(() => {
    setFilters(defaultFilters(search));
  }, [search.location, search.sport]);

  useEffect(() => {
    let active = true;
    Promise.all([turfApi.cities(), turfApi.facilities()]).then(([cities, facilities]) => {
      if (!active) return;
      setLocations(cities.map((city) => city.name));
      setFacilityOptions(facilities.map((facility) => facility.name));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    turfApi.list({
      city: filters.location,
      sports: filters.sports.map((sport) => sport.toUpperCase()),
      q: query.trim(),
      date: search.date,
      startTime: search.time,
      maxPrice: filters.maxPrice,
      rating: filters.minRating,
      facility: filters.facilities,
      availableToday: filters.availableToday,
      order: sort,
      size: 50,
    }).then((page) => active && setResults(page.content))
      .catch(() => active && setResults([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [query, filters, sort]);

  const onChange = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }));
  const onReset = () =>
    setFilters({
      location: "",
      sports: [],
      maxPrice: 2000,
      minRating: 0,
      facilities: [],
      availableToday: false,
    });

  return (
    <>
      <PageHero
        title="Find your next turf"
        subtitle="Verified venues, live availability and instant confirmation across five cities."
        items={[{ label: "Turfs" }]}
      >
        <SearchBar />
      </PageHero>

      <section className="page-enter mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className={showFilters ? "block" : "hidden lg:block"}>
            <FilterSidebar
              filters={filters}
              onChange={onChange}
              onReset={onReset}
              locations={locations}
              facilityOptions={facilityOptions}
            />
          </div>

          <div>
            <div className="bg-card border-border shadow-card mb-6 flex flex-wrap items-center gap-3 rounded-3xl border p-4">
              <input
                aria-label="Search turfs"
                value={query}
                maxLength={80}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by turf or area..."
                className="ui-field border-border bg-card min-w-[180px] flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none"
              />
              <select
                aria-label="Sort by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="ui-field border-border bg-card cursor-pointer rounded-xl border px-3 py-2.5 text-sm outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                className="ui-focus lg:hidden"
                onClick={() => setShowFilters((s) => !s)}
              >
                <SlidersHorizontal size={15} /> Filters
              </Button>
              <div className="border-border hidden overflow-hidden rounded-full border sm:flex">
                <button
                  aria-label="Grid view"
                  onClick={() => setLayout("grid")}
                  className={`ui-focus hover:text-primary cursor-pointer px-3 py-2 transition-colors ${layout === "grid" ? "bg-accent text-primary" : ""}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  aria-label="List view"
                  onClick={() => setLayout("list")}
                  className={`ui-focus hover:text-primary cursor-pointer px-3 py-2 transition-colors ${layout === "list" ? "bg-accent text-primary" : ""}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {loading ? (
              <TurfGridSkeleton count={6} layout={layout} />
            ) : results.length === 0 ? (
              <EmptyState
                action={
                  <Button variant="outline" onClick={onReset}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <>
                <p className="text-muted-foreground mb-4 text-sm">
                  {results.length} turf{results.length > 1 ? "s" : ""} found
                </p>
                <div
                  key={layout}
                  className={
                    layout === "grid"
                      ? "page-enter grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "page-enter flex flex-col gap-6"
                  }
                >
                  {results.map((t) => (
                    <TurfCard key={t.id} turf={t} layout={layout} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

    </>
  );
}
