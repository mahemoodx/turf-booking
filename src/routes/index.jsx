import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Grid2x2,
  Headphones,
  IndianRupee,
  Lock,
  ShieldCheck,
  Star,
  ThumbsUp,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import heroImg from "@/assets/hero-turf.jpg";
import SearchBar from "@/components/SearchBar";
import SportCard from "@/components/SportCard";
import TurfCard from "@/components/TurfCard";
import Button from "@/components/Button";
import { sports } from "@/data/sports";
import { stats } from "@/data/testimonials";
import { turfApi } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TurfBook — Book Your Perfect Turf, Anytime" },
      {
        name: "description",
        content:
          "Search verified football, cricket, badminton, tennis and basketball turfs across Hyderabad, Bengaluru, Chennai, Mumbai, Pune, Delhi and Kochi.",
      },
      { property: "og:title", content: "TurfBook — Book Your Perfect Turf" },
      {
        property: "og:description",
        content:
          "Verified turfs, real-time availability and best price guarantee.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const benefits = [
  { icon: BadgeCheck, label: "Verified Turfs" },
  { icon: Timer, label: "Real-time Availability" },
  { icon: ShieldCheck, label: "Secure Booking" },
  { icon: IndianRupee, label: "Best Price Guarantee" },
];

const highlights = [
  { icon: Users, value: "10K+", label: "Happy Players" },
  { icon: Building2, value: "500+", label: "Turfs Listed" },
  { icon: CalendarCheck, value: "25K+", label: "Bookings Completed" },
  { icon: ThumbsUp, value: "4.8/5", label: "Average Rating" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    text: "All turfs are verified for quality & safety",
  },
  {
    icon: CalendarCheck,
    title: "Instant Booking",
    text: "Real-time slot confirmation",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    text: "100% safe & secure payments",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "We're here to help anytime",
  },
];

function Home() {
  const [turfs, setTurfs] = useState([]);
  useEffect(() => {
    turfApi.list({ order: "rating", size: 50 }).then((page) => setTurfs(page.content)).catch(() => setTurfs([]));
  }, []);
  const topRated = turfs.slice(0, 6);
  const sportCards = sports.map((s) => ({
    ...s,
    venues: turfs.filter((t) => t.sports.includes(s.id)).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative isolate">
        <img
          src={heroImg}
          alt="Floodlit football turf at night"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]" />
        <div className="container-page text-primary-deep-foreground grid gap-10 py-20 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:py-24">
          <div>
            <span className="text-primary text-xs font-bold tracking-[0.22em] uppercase">
              Play more. Wait less.
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
              Book Your Perfect Turf,{" "}
              <span className="text-primary">Anytime!</span>
            </h1>
            <p className="mt-5 max-w-xl text-base opacity-85 sm:text-lg">
              Find and book the best turfs near you.
              <br />
              Real-time availability • Easy booking • Best experience
            </p>

            <div className="mt-9">
              <SearchBar />
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {benefits.map((b) => (
                <li
                  key={b.label}
                  className="flex items-center gap-2 text-sm font-medium opacity-90"
                >
                  <b.icon size={17} className="text-primary" />
                  {b.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Why choose card */}
          <aside className="border-primary-deep-foreground/15 rounded-3xl border bg-black/35 p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold">Why Choose TurfBook?</h2>
            <ul className="mt-5 space-y-5">
              {highlights.map((h) => (
                <li key={h.label} className="flex items-center gap-4">
                  <span className="border-primary/40 text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-white/5">
                    <h.icon size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="text-xl font-extrabold">{h.value}</p>
                    <p className="text-xs opacity-75">{h.label}</p>
                  </div>
                  <TrendingUp size={20} className="text-primary opacity-80" />
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Sports + features */}
      <section className="container-page py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Popular Sports
          </h2>
          <Link
            to="/turfs"
            className="text-primary flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            View All Sports <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {sportCards.map((s) => (
              <SportCard key={s.id} sport={s} />
            ))}
            <Link
              to="/turfs"
              className="bg-card border-border shadow-card hover:border-primary hover:shadow-lift group flex flex-col items-center rounded-3xl border px-4 py-7 transition-all duration-200 hover:-translate-y-1"
            >
              <span className="bg-accent text-primary flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
                <Grid2x2 size={24} />
              </span>
              <p className="mt-4 font-semibold">View All</p>
              <p className="text-muted-foreground text-xs">All Sports</p>
            </Link>
          </div>

          <div className="bg-muted grid gap-6 rounded-3xl p-7 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <span className="bg-card text-primary shadow-card mx-auto flex size-12 items-center justify-center rounded-2xl">
                  <f.icon size={20} />
                </span>
                <p className="mt-3 text-sm font-semibold">{f.title}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section className="container-page pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Top Rated Turfs
          </h2>
          <Button as={Link} to="/turfs" variant="outline" size="sm">
            View all turfs <ArrowRight size={15} />
          </Button>
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topRated.map((t) => (
            <TurfCard key={t.id} turf={t} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container-page pb-20">
        <div className="surface-deep grid grid-cols-2 gap-6 rounded-3xl p-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.id} className="text-center">
              <span className="border-primary/40 text-primary mx-auto flex size-12 items-center justify-center rounded-2xl border bg-white/5">
                {[Users, Building2, CalendarCheck, Star].map((Icon, idx) =>
                  idx === i ? <Icon key={idx} size={20} /> : null,
                )}
              </span>
              <p className="mt-3 text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs opacity-75">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      {eyebrow && (
        <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
