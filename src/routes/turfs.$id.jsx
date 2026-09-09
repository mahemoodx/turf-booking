import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Rating from "@/components/Rating";
import TimeSlot from "@/components/TimeSlot";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/store/AppStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { turfApi } from "@/lib/api";

export const Route = createFileRoute("/turfs/$id")({
  head: () => ({
      meta: [
        { title: "Turf details — Book Online | TurfBook" },
        { name: "description", content: "Check live availability and book your TurfBook slot." },
        { property: "og:title", content: "Book a Turf | TurfBook" },
        { property: "og:description", content: "Check live availability and book your next game." },
        { property: "og:type", content: "website" },
      ],
  }),
  component: TurfDetails,
});

const today = () => new Date().toISOString().slice(0, 10);

function TurfDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { setDraft } = useApp();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [active, setActive] = useState(0);
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    let activeRequest = true;
    setLoading(true);
    turfApi.detail(id)
      .then((result) => activeRequest && setTurf(result))
      .catch((error) => activeRequest && setLoadError(error.message || "Unable to load this turf."))
      .finally(() => activeRequest && setLoading(false));
    return () => { activeRequest = false; };
  }, [id]);

  useEffect(() => {
    let activeRequest = true;
    setSlotsLoading(true);
    setSelectedSlot(null);
    turfApi.slots(id, date)
      .then((result) => activeRequest && setSlots(result))
      .catch(() => activeRequest && setSlots([]))
      .finally(() => activeRequest && setSlotsLoading(false));
    return () => { activeRequest = false; };
  }, [id, date]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-20"><LoadingSpinner label="Loading turf details..." /></div>;

  if (!turf) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Turf not found"
          message={loadError || "The turf you are looking for is no longer listed."}
          action={
            <Button as={Link} to="/turfs" className="no-underline">
              Browse all turfs
            </Button>
          }
        />
      </div>
    );
  }

  const onBook = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot to continue.");
      return;
    }
    setDraft({
      turfId: turf.id,
      turfName: turf.name,
      location: turf.area,
      sport: turf.sport,
      image: turf.images[0],
      date,
      slot: selectedSlot.label,
      slotId: selectedSlot.id,
      price: selectedSlot.price,
    });
    navigate({ to: "/booking" });
  };

  return (
    <>
      <PageHero
        title={turf.name}
        subtitle={turf.area}
        items={[{ label: "Turfs", to: "/turfs" }, { label: turf.name }]}
      />

      <section className="page-enter mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="media-frame media-frame-soft shadow-card h-64 rounded-3xl sm:h-96">
              <img
                src={turf.images[active]}
                alt={`${turf.name} — view ${active + 1}`}
                width={1200}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {turf.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`ui-focus media-frame media-frame-soft h-20 cursor-pointer rounded-2xl border-2 transition-all duration-300 sm:h-24 ${
                    i === active
                      ? "border-primary shadow-[var(--shadow-glow)]"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${turf.name} thumbnail ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>


            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Rating value={turf.rating} count={turf.reviews} />
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin size={15} /> {turf.area}
              </span>
              <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-semibold capitalize">
                {turf.sport}
              </span>
            </div>

            <h2 className="mt-8 text-xl font-semibold">About this turf</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {turf.description}
            </p>

            <h2 className="mt-8 text-xl font-semibold">Facilities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {turf.facilities.map((f) => (
                <span
                  key={f}
                  className="border-border bg-card hover:border-primary hover:text-primary flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                >
                  <ShieldCheck size={14} className="text-primary" /> {f}
                </span>
              ))}
            </div>

          </div>

          <aside className="bg-card border-border shadow-card h-fit rounded-3xl border p-6 lg:sticky lg:top-24">
            <p className="text-2xl font-bold">
              ₹{turf.price}
              <span className="text-muted-foreground text-sm font-normal">
                /hour
              </span>
            </p>

            <label className="mt-5 block text-sm font-semibold">
              Select date
              <input
                type="date"
                value={date}
                min={today()}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="ui-field border-border bg-card mt-2 w-full cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-normal outline-none"
              />
            </label>

            <p className="mt-6 text-sm font-semibold">Select time slot</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {slotsLoading ? <p className="text-muted-foreground col-span-2 py-3 text-center text-sm">Loading slots...</p> : slots.map((t) => (
                <TimeSlot
                  key={t.id}
                  label={t.label}
                  selected={selectedSlot?.id === t.id}
                  unavailable={!t.available}
                  onSelect={() => setSelectedSlot(t)}
                />
              ))}
              {!slotsLoading && slots.length === 0 && <p className="text-muted-foreground col-span-2 py-3 text-center text-sm">No slots available for this date.</p>}
            </div>

            <Button size="lg" className="ui-focus mt-6 w-full" onClick={onBook}>
              <Star size={16} /> Book Now
            </Button>
            <p className="text-muted-foreground mt-3 text-center text-xs">
              Free cancellation up to 6 hours before your slot.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
