import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  BadgeCheck,
  Clock,
  Lock,
  Headphones,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/Button";
import heroImg from "@/assets/how-it-works-hero.jpg";
import ctaImg from "@/assets/how-it-works-cta.jpg";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How TurfBook Works — Book in 5 Simple Steps" },
      {
        name: "description",
        content:
          "Discover how easy it is to find, compare and book premium sports turfs on TurfBook in just five simple steps.",
      },
      { property: "og:title", content: "How TurfBook Works — Book in 5 Simple Steps" },
      {
        property: "og:description",
        content:
          "Find verified turfs, compare prices, book instantly and play — all in under a minute.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Find Your Turf",
    description:
      "Search turfs near you by location, sport type, or facilities and choose the best one.",
  },
  {
    number: 2,
    icon: CalendarDays,
    title: "Select Date & Time",
    description:
      "Pick your preferred date and choose an available time slot.",
  },
  {
    number: 3,
    icon: ClipboardCheck,
    title: "Book Your Slot",
    description:
      "Review your booking details and confirm your slot instantly.",
  },
  {
    number: 4,
    icon: CreditCard,
    title: "Make Payment",
    description:
      "Secure your booking by making a quick and safe payment.",
  },
  {
    number: 5,
    icon: CheckCircle2,
    title: "Play & Enjoy",
    description:
      "Your booking is confirmed! Now just show up and enjoy the game.",
  },
];

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Turfs",
    description: "All turfs are verified and quality checked.",
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    description: "Get real-time updates on availability and bookings.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Your payments are safe with us.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help you anytime.",
  },
];

function HowItWorksPage() {
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
        <div className="text-primary-deep-foreground container-page relative flex flex-col items-center justify-center py-24 text-center lg:py-32">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            How It Works
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-90 sm:text-lg">
            Book your favorite turf in just a few simple steps and enjoy the game!
          </p>
          <div className="bg-primary mt-6 h-1 w-20 rounded-full" />
        </div>
      </section>

      {/* Steps */}
      <section className="container-page py-16 lg:py-24">
        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector arrow (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] items-center justify-center">
                  <div className="border-primary/40 w-full border-t-2 border-dashed" />
                  <ArrowRight size={16} className="text-primary -ml-1.5 shrink-0" />
                </div>
              )}

              {/* Icon with numbered badge */}
              <div className="relative">
                <span className="bg-primary text-primary-foreground absolute -top-2 -left-2 flex size-7 items-center justify-center rounded-full text-xs font-bold shadow-md">
                  {step.number}
                </span>
                <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full">
                  <step.icon size={40} className="text-primary" />
                </div>
              </div>

              <h3 className="mt-6 text-lg font-extrabold">{step.title}</h3>
              <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust banner */}
        <div className="mt-16 flex justify-center">
          <div className="bg-primary/10 border-primary/20 flex max-w-2xl items-center gap-4 rounded-2xl border px-6 py-5 sm:gap-6 sm:px-8">
            <div className="bg-primary/15 flex size-14 shrink-0 items-center justify-center rounded-full">
              <ShieldCheck size={28} className="text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-extrabold sm:text-lg">
                Safe, Secure & <span className="text-primary">Hassle-Free</span> Booking
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                We ensure a smooth and secure booking experience for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-16 lg:pb-24">
        <div className="bg-primary-deep relative overflow-hidden rounded-[2rem]">
          <div className="grid items-center lg:grid-cols-2">
            <div className="text-primary-deep-foreground relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="bg-primary/20 flex size-14 items-center justify-center rounded-full">
                <Trophy size={28} className="text-primary" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
                Ready to <span className="text-primary">Book</span> Your Turf?
              </h2>
              <p className="mt-4 max-w-md text-sm opacity-85 sm:text-base">
                Join thousands of players who trust TurfBook for their game.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button as={Link} to="/turfs" className="text-primary-deep-foreground">
                  Browse Turfs <ArrowRight size={16} />
                </Button>
                <Button as={Link} to="/contact" variant="outline" className="border-primary-deep-foreground/30 text-primary-deep-foreground hover:bg-primary-deep-foreground/10 hover:text-primary-deep-foreground">
                  Contact Us <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto lg:min-h-[360px]">
              <img
                src={ctaImg}
                alt="Floodlit football goalpost at night"
                width={1200}
                height={600}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="from-primary-deep/95 via-primary-deep/60 to-transparent absolute inset-0 bg-gradient-to-r" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page pb-20 lg:pb-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border-border shadow-card flex flex-col items-center rounded-2xl border p-6 text-center"
            >
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <feature.icon size={28} className="text-primary" />
              </div>
              <h3 className="mt-5 text-base font-extrabold">{feature.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
