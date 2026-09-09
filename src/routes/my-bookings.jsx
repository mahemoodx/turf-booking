import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/store/AppStore";
import LoadingSpinner from "@/components/LoadingSpinner";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — Upcoming & Past Slots | TurfBook" },
      {
        name: "description",
        content:
          "Track upcoming, completed and cancelled turf bookings, view details and cancel a slot in one tap.",
      },
      { property: "og:title", content: "My Bookings | TurfBook" },
      {
        property: "og:description",
        content: "Track upcoming, completed and cancelled turf bookings.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MyBookings,
});

const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const statusClass = {
  upcoming: "bg-[image:var(--gradient-primary)] text-primary-foreground",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

function MyBookings() {
  const { bookings, cancelBooking, loadBookings, user, authLoading } = useApp();
  const [tab, setTab] = useState("upcoming");
  const [details, setDetails] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user.loggedIn) { setLoading(false); return; }
    loadBookings().catch((error) => toast.error(error.message || "Unable to load your bookings.")).finally(() => setLoading(false));
  }, [authLoading, user.loggedIn]);

  const list = bookings.filter((b) => b.status === tab);

  if (authLoading || loading) return <div className="mx-auto max-w-3xl px-4 py-20"><LoadingSpinner label="Loading your bookings..." /></div>;
  if (!user.loggedIn) return <div className="mx-auto max-w-3xl px-4 py-20"><EmptyState title="Log in to view bookings" message="Your confirmed and past slots will appear here." action={<Button as={Link} to="/login" className="no-underline">Log in</Button>} /></div>;

  return (
    <>
      <PageHero
        title="My bookings"
        subtitle="All your turf slots in one place."
        items={[{ label: "My Bookings" }]}
      />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="border-border bg-card mb-8 inline-flex flex-wrap gap-1 rounded-full border p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            title={`No ${tab} bookings`}
            message="When you book a turf it will show up in this tab."
            action={
              <Button as={Link} to="/turfs" className="no-underline">
                Browse turfs
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-5">
            {list.map((b) => {
              const image = b.image;
              return (
                <article
                  key={b.id}
                  className="bg-card border-border shadow-card overflow-hidden rounded-3xl border sm:flex"
                >
                  {image && (
                    <img
                      src={image}
                      alt={b.turfName}
                      loading="lazy"
                      className="h-40 w-full object-cover sm:h-auto sm:w-56 sm:shrink-0"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{b.turfName}</h3>
                        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                          <MapPin size={14} /> {b.location}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} /> {b.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {b.slot}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xl font-bold">₹{b.amount}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDetails(b)}
                        >
                          View Details
                        </Button>
                        {b.status === "upcoming" && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setConfirmId(b.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal
        open={!!details}
        onClose={() => setDetails(null)}
        title="Booking details"
      >
        {details && (
          <dl className="border-border divide-y rounded-2xl border text-sm">
            {[
              ["Booking ID", details.id],
              ["Turf", details.turfName],
              ["Location", details.location],
              ["Sport", details.sport],
              ["Date", details.date],
              ["Time", details.slot],
              ["Amount", `₹${details.amount}`],
              ["Status", details.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold capitalize">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Cancel this booking?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Keep booking
            </Button>
            <Button
              variant="danger"
              disabled={cancelling}
              onClick={async () => {
                setCancelling(true);
                try {
                  await cancelBooking(confirmId);
                  setConfirmId(null);
                  toast.success("Booking cancelled.");
                } catch (error) {
                  toast.error(error.message || "Unable to cancel this booking.");
                } finally {
                  setCancelling(false);
                }
              }}
            >
              {cancelling ? "Cancelling..." : "Yes, cancel"}
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground text-sm">
          Your slot will be released and moved to the Cancelled tab.
        </p>
      </Modal>
    </>
  );
}
