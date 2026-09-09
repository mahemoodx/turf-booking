import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/store/AppStore";

export const Route = createFileRoute("/booking-confirmation")({
  head: () => ({
    meta: [
      { title: "Booking Confirmed | TurfBook" },
      {
        name: "description",
        content:
          "Your turf slot is confirmed. View your booking ID, venue, date, time and amount.",
      },
      { property: "og:title", content: "Booking Confirmed | TurfBook" },
      {
        property: "og:description",
        content: "Your turf slot is confirmed — see you on the pitch.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { lastBooking } = useApp();

  if (!lastBooking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="No recent booking"
          message="Once you confirm a booking, its receipt shows up here."
          action={
            <Button as={Link} to="/turfs" className="no-underline">
              Browse turfs
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="bg-card border-border shadow-lift rounded-3xl border p-8 text-center">
        <div className="bg-[image:var(--gradient-primary)] text-primary-foreground mx-auto flex size-16 items-center justify-center rounded-2xl">
          <CheckCircle2 size={30} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Your slot is locked. Show this booking ID at the venue.
        </p>

        <dl className="border-border mt-8 divide-y rounded-2xl border text-left text-sm">
          <Row label="Booking ID" value={lastBooking.id} />
          <Row label="Turf" value={lastBooking.turfName} />
          <Row label="Location" value={lastBooking.location} />
          <Row label="Date" value={lastBooking.date} />
          <Row label="Time" value={lastBooking.slot} />
          <Row label="Amount" value={`₹${lastBooking.amount}`} />
          <Row label="Status" value="Upcoming" />
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button as={Link} to="/my-bookings" className="no-underline">
            View My Bookings
          </Button>
          <Button as={Link} to="/" variant="outline" className="no-underline">
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold capitalize">{value}</dd>
    </div>
  );
}
