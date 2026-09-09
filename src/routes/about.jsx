import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
  CalendarCheck,
  Building2,
  Trophy,
  Heart,
  Target,
} from "lucide-react";
import Button from "@/components/Button";
import heroImg from "@/assets/about-hero.jpg";
import whoWeAreImg from "@/assets/about-who-we-are.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — TurfBook" },
      {
        name: "description",
        content:
          "Learn about TurfBook's mission to make sports turf booking simple, fast and accessible for every player and venue.",
      },
      { property: "og:title", content: "About Us — TurfBook" },
      {
        property: "og:description",
        content:
          "Discover the story behind TurfBook and why players trust us for their game.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { icon: Building2, value: "500+", label: "Turfs Listed" },
  { icon: Users, value: "50K+", label: "Happy Players" },
  { icon: CalendarCheck, value: "100K+", label: "Bookings Completed" },
  { icon: MapPin, value: "20+", label: "Cities Covered" },
];

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Turfs",
    description:
      "All turfs are verified for quality, safety, and an amazing play experience.",
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    description:
      "Check live availability and book your slot instantly.",
  },
];

const values = [
  {
    icon: Trophy,
    title: "Our Vision",
    description:
      "To become the most trusted sports booking platform and build a strong sports community.",
  },
  {
    icon: Heart,
    title: "Our Mission",
    description:
      "To make turf booking simple, fast, and reliable so you can focus on playing the game you love.",
  },
  {
    icon: Target,
    title: "Our Values",
    description:
      "Integrity, Passion, Customer First, and Continuous Improvement.",
  },
];

function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Floodlit football turf at night"
          width={1920}
          height={600}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="from-primary-deep/90 to-primary-deep/70 absolute inset-0 -z-10 bg-gradient-to-b" />
        <div className="container-page text-primary-deep-foreground relative flex flex-col justify-center py-20 lg:py-28">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm opacity-80">
            <Link to="/" className="hover:text-primary hover:opacity-100 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="opacity-100">About Us</span>
          </nav>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-90 sm:text-lg">
            We're on a mission to make sports accessible, one booking at a time.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
              Who We Are
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Making Sports Accessible{" "}
              <span className="text-primary">for Everyone</span>
            </h2>
            <p className="text-muted-foreground mt-5 text-sm leading-relaxed sm:text-base">
              TurfBook was founded with a simple mission – to make booking sports turfs as easy as possible. Whether you're planning a casual game with friends or organizing a tournament, we're here to help you find the perfect turf, anytime, anywhere.
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
              We connect players with the best turfs in their city through a seamless online platform that saves time, effort, and hassle.
            </p>
            <div className="mt-8">
              <Button as={Link} to="/turfs">
                Explore Turfs <ArrowRight size={16} />
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-lift">
            <img
              src={whoWeAreImg}
              alt="Soccer ball on a green turf at sunset"
              width={1200}
              height={800}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page pb-16 lg:pb-24">
        <div className="grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 border-border px-4 py-4 sm:border-r sm:last:border-r-0 lg:px-6"
            >
              <div className="bg-primary/10 flex size-14 items-center justify-center rounded-full">
                <s.icon size={26} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-extrabold sm:text-3xl">{s.value}</p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-page pb-16 lg:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
            Why Choose Us
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Experience the <span className="text-primary">Best</span> of Sports Booking
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border-border shadow-card flex flex-col rounded-2xl border p-6"
            >
              <div className="bg-primary/10 flex size-14 items-center justify-center rounded-full">
                <f.icon size={26} className="text-primary" />
              </div>
              <h3 className="mt-5 text-base font-extrabold">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="surface-deep">
        <div className="container-page py-16 lg:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="text-primary-deep-foreground flex flex-col items-start"
              >
                <div className="bg-primary/20 flex size-14 items-center justify-center rounded-full">
                  <v.icon size={28} className="text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-primary">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-85">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust banner */}
      <section className="container-page py-16 lg:py-24">
        <div className="bg-primary/10 border-primary/20 flex max-w-4xl items-center gap-5 rounded-2xl border px-6 py-6 sm:gap-6 sm:px-10 sm:py-8 lg:mx-auto">
          <div className="bg-primary/15 flex size-16 shrink-0 items-center justify-center rounded-full">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold sm:text-xl">
              Safe, Secure & <span className="text-primary">Hassle-Free</span> Booking
            </h3>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              We ensure a smooth and secure booking experience for everyone, every time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
