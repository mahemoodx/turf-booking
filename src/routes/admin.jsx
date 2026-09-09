import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CalendarCheck, IndianRupee, RefreshCw, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { adminApi } from "@/lib/api";
import { useApp } from "@/store/AppStore";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard | TurfBook" }, { name: "description", content: "Manage TurfBook users, bookings and venue performance." }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, authLoading } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (manual = false) => {
    if (!user.roles.includes("ADMIN")) return;
    if (manual) setRefreshing(true);
    try {
      const [dashboard, userPage, bookingPage] = await Promise.all([adminApi.dashboard(), adminApi.users(), adminApi.bookings()]);
      setData({ dashboard, users: userPage.content, bookings: bookingPage.content });
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load the dashboard.");
    } finally {
      setRefreshing(false);
    }
  }, [user.roles]);

  useEffect(() => {
    if (!user.roles.includes("ADMIN")) return;
    loadDashboard();
    const refreshTimer = window.setInterval(loadDashboard, 15000);
    return () => window.clearInterval(refreshTimer);
  }, [loadDashboard, user.roles]);

  if (authLoading) return <div className="mx-auto max-w-3xl px-4 py-20"><LoadingSpinner label="Checking access..." /></div>;
  if (!user.loggedIn || !user.roles.includes("ADMIN")) {
    return <div className="mx-auto max-w-3xl px-4 py-20"><EmptyState title="Admin access required" message="Sign in with an administrator account to manage TurfBook." action={<Button as={Link} to="/login" className="no-underline">Log in</Button>} /></div>;
  }
  if (!data && !error) return <div className="mx-auto max-w-3xl px-4 py-20"><LoadingSpinner label="Loading dashboard..." /></div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-20"><EmptyState title="Dashboard unavailable" message={error} /></div>;

  const metrics = [
    { icon: Users, label: "Registered users", value: data.dashboard.totalUsers },
    { icon: Building2, label: "Active turfs", value: data.dashboard.totalTurfs },
    { icon: CalendarCheck, label: "Total bookings", value: data.dashboard.totalBookings },
    { icon: IndianRupee, label: "Paid revenue", value: `₹${Number(data.dashboard.revenue).toLocaleString("en-IN")}` },
  ];
  return <>
    <PageHero title="Admin dashboard" subtitle="A live overview of your TurfBook marketplace. New bookings refresh automatically." items={[{ label: "Admin" }]} />
    <section className="page-enter mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => loadDashboard(true)} disabled={refreshing}>
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Refreshing..." : "Refresh bookings"}
        </Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ icon: Icon, label, value }) => <article key={label} className="bg-card border-border shadow-card rounded-3xl border p-6">
          <span className="bg-accent text-primary flex size-11 items-center justify-center rounded-2xl"><Icon size={20} /></span>
          <p className="mt-5 text-3xl font-extrabold">{value}</p><p className="text-muted-foreground mt-1 text-sm">{label}</p>
        </article>)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="bg-card border-border shadow-card overflow-hidden rounded-3xl border">
          <div className="border-border flex items-center justify-between border-b px-6 py-5">
            <div><h2 className="font-bold">Recent bookings</h2><p className="text-muted-foreground mt-1 text-xs">Latest booking activity</p></div>
            <CalendarCheck className="text-primary" size={20} />
          </div>
          {data.bookings.length ? <div className="divide-border divide-y">
            {data.bookings.map((booking) => <div key={booking.id} className="flex items-center justify-between gap-3 px-6 py-4 text-sm">
              <div className="min-w-0"><p className="truncate font-semibold">{booking.turfName}</p><p className="text-muted-foreground mt-1">{booking.date} · {booking.slot}</p></div>
              <div className="text-right"><p className="font-semibold">₹{Number(booking.amount).toLocaleString("en-IN")}</p><p className="text-primary mt-1 text-xs font-semibold">{booking.status}</p></div>
            </div>)}
          </div> : <p className="text-muted-foreground px-6 py-10 text-center text-sm">No bookings yet.</p>}
        </section>

        <section className="bg-card border-border shadow-card overflow-hidden rounded-3xl border">
          <div className="border-border flex items-center justify-between border-b px-6 py-5">
            <div><h2 className="font-bold">Newest users</h2><p className="text-muted-foreground mt-1 text-xs">Recently registered players</p></div>
            <Users className="text-primary" size={20} />
          </div>
          {data.users.length ? <div className="divide-border divide-y">
            {data.users.map((account) => <div key={account.id} className="flex items-center justify-between gap-3 px-6 py-4 text-sm">
              <div className="min-w-0"><p className="truncate font-semibold">{account.fullName}</p><p className="text-muted-foreground truncate mt-1">{account.email}</p></div>
              <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-semibold">{account.roles.join(", ")}</span>
            </div>)}
          </div> : <p className="text-muted-foreground px-6 py-10 text-center text-sm">No users yet.</p>}
        </section>
      </div>
    </section>
  </>;
}
