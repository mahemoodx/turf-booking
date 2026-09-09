import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/store/AppStore";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Review & Confirm Your Booking | TurfBook" },
      {
        name: "description",
        content:
          "Review your selected turf, date, slot and price summary before confirming your TurfBook slot.",
      },
      { property: "og:title", content: "Review & Confirm Your Booking" },
      {
        property: "og:description",
        content: "Check your turf, slot and total before confirming.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { draft, confirmBooking, user } = useApp();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  if (!draft) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="No booking in progress"
          message="Pick a turf and a time slot to start a booking."
          action={
            <Button as={Link} to="/turfs" className="no-underline">
              Browse turfs
            </Button>
          }
        />
      </div>
    );
  }

  const base = draft.price;
  const taxes = Math.round(base * 0.18);
  const fee = 30;
  const total = base + taxes + fee;

  const onConfirm = async () => {
    if (!user.loggedIn) {
      toast.info("Please log in to confirm your booking.");
      navigate({ to: "/login" });
      return;
    }
    setConfirming(true);
    try {
      await confirmBooking(draft.slotId);
      toast.success("Booking confirmed!");
      navigate({ to: "/booking-confirmation" });
    } catch (error) {
      toast.error(error.message || "This slot is no longer available.");
      navigate({ to: "/turfs/$id", params: { id: draft.turfId } });
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <PageHero
        title="Confirm your booking"
        subtitle="Everything looks good? Lock your slot in one tap."
        items={[{ label: "Turfs", to: "/turfs" }, { label: "Booking" }]}
      />

      <section className="page-enter mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="turf-card bg-card border-border shadow-card overflow-hidden rounded-3xl border">
            <div className="media-frame h-52 sm:h-60">
              <img
                src={draft.image}
                alt={draft.turfName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold">{draft.turfName}</h2>
              <p className="text-muted-foreground mt-1.5 flex items-center gap-1 text-sm">
                <MapPin size={14} /> {draft.location}
              </p>
              <span className="bg-secondary text-secondary-foreground mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize">
                {draft.sport}
              </span>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Detail icon={CalendarDays} label="Date" value={draft.date} />
                <Detail icon={Clock} label="Time" value={draft.slot} />
                <Detail icon={Wallet} label="Duration" value="1 hour" />
              </div>
            </div>
          </div>

          <aside className="bg-card border-border shadow-card h-fit rounded-3xl border p-6">
            <h3 className="text-base font-semibold">Price summary</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Turf price (1 hour)" value={base} />
              <Row label="Taxes (18%)" value={taxes} />
              <Row label="Convenience fee" value={fee} />
              <div className="border-border mt-2 flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </dl>
            <Button
              size="lg"
              className="ui-focus mt-6 w-full"
              onClick={onConfirm}
              disabled={confirming}
            >
              {confirming ? "Confirming..." : "Confirm Booking"}
            </Button>
            <Button
              as={Link}
              to="/turfs/$id"
              params={{ id: draft.turfId }}
              variant="outline"
              className="ui-focus mt-3 w-full no-underline"
            >
              Change slot
            </Button>

          </aside>
        </div>
      </section>
    </>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="bg-accent/60 hover:bg-accent rounded-2xl p-4 transition-colors">

      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Icon size={13} /> {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">₹{value}</dd>
    </div>
  );
}
