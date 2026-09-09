import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-turf.jpg";

export default function AuthShell({ title, highlight, subtitle, points, children }) {
  return (
    <section className="surface-deep grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative isolate hidden flex-col justify-center overflow-hidden px-10 py-14 lg:flex xl:px-16">
        <img
          src={heroImg}
          alt="Floodlit football turf at night"
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-10 size-full scale-105 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-hero)]" />

        <Link
          to="/"
          className="text-primary-deep-foreground group flex w-fit items-center gap-3"
        >
          <span className="bg-[image:var(--gradient-primary)] text-primary-foreground flex size-12 items-center justify-center rounded-2xl text-xl font-black transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            T
          </span>
          <span className="leading-tight">
            <span className="block text-2xl font-extrabold">TurfBook</span>
            <span className="text-primary block text-sm font-medium">
              Book. Play. Enjoy.
            </span>
          </span>
        </Link>

        <h1 className="text-primary-deep-foreground auth-rise mt-14 max-w-md text-4xl leading-[1.05] font-extrabold text-balance xl:text-5xl">
          {title} <span className="text-primary">{highlight}</span>
        </h1>
        <p className="text-primary-deep-foreground auth-rise mt-5 max-w-sm text-sm leading-relaxed opacity-85 [animation-delay:80ms]">
          {subtitle}
        </p>

        {points?.length ? (
          <ul className="mt-10 space-y-3">
            {points.map((p, i) => (
              <li
                key={p.title}
                style={{ animationDelay: `${140 + i * 80}ms` }}
                className="text-primary-deep-foreground auth-point auth-rise flex items-start gap-3 rounded-2xl p-2 hover:bg-white/5"
              >
                <span className="border-primary/40 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border bg-white/5 transition-colors duration-300">
                  <p.icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{p.title}</span>
                  <span className="block text-xs opacity-75">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Form panel */}
      <div className="bg-background text-foreground flex items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
        <div className="auth-card auth-rise bg-card text-card-foreground shadow-lift border-border w-full max-w-lg rounded-3xl border p-6 sm:p-9">
          <Link
            to="/"
            className="group mb-6 flex items-center justify-center gap-2.5 lg:hidden"
          >
            <span className="bg-[image:var(--gradient-primary)] text-primary-foreground flex size-10 items-center justify-center rounded-2xl text-lg font-black transition-transform duration-300 group-hover:-rotate-6">
              T
            </span>
            <span className="text-lg font-extrabold">TurfBook</span>
          </Link>
          {children}
        </div>
      </div>
    </section>
  );
}

export function Field({ label, icon: Icon, error, children }) {
  return (
    <label className="group/field block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide uppercase opacity-80">
        {label}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon
            size={16}
            className="text-muted-foreground group-focus-within/field:text-primary pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors duration-200"
          />
        )}
        {children}
      </span>
      {error && (
        <span className="text-destructive mt-1.5 block text-xs font-medium">
          {error}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  "auth-field w-full rounded-xl border border-border bg-card px-10 py-3 text-sm outline-none placeholder:text-muted-foreground/70";
