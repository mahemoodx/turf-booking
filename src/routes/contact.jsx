import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Headphones,
  ShieldCheck,
  Zap,
  Users,
  User,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/Button";
import heroImg from "@/assets/contact-hero.jpg";
import { contactApi } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — TurfBook" },
      {
        name: "description",
        content:
          "Get in touch with the TurfBook team for booking support, venue partnerships or any queries. We reply within 24 hours.",
      },
      { property: "og:title", content: "Contact Us — TurfBook" },
      {
        property: "og:description",
        content:
          "Reach the TurfBook team by phone, email or our contact form for support and partnerships.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const details = [
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 81794 69535", "Mon – Sat, 9:00 AM – 9:00 PM"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["support@turfbook.com", "We reply within 24 hours"],
  },
  {
    icon: MapPin,
    title: "Address",
    lines: [
      "TurfBook Sports Pvt. Ltd.",
      "Kondapur, Hyderabad,",
      "Telangana – 500084",
    ],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Sat: 9:00 AM – 9:00 PM", "Sun: 9:00 AM – 6:00 PM"],
  },
];

const trust = [
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We are here to help you anytime.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Safe",
    description: "Your data and privacy are our priority.",
  },
  {
    icon: Zap,
    title: "Quick Response",
    description: "We respond to all queries within 24 hours.",
  },
  {
    icon: Users,
    title: "Trusted by Players",
    description: "Join thousands of happy players across the city.",
  },
];

const subjects = [
  "Booking Support",
  "Turf Partnership",
  "Payment Issue",
  "Feedback",
  "Other",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const message = form.message.trim();

  if (!name) errors.name = "Please enter your name";
  else if (name.length > 100) errors.name = "Name must be under 100 characters";

  if (!email) errors.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "Enter a valid email address";

  if (phone && !/^[0-9+\s-]{7,15}$/.test(phone))
    errors.phone = "Enter a valid phone number";

  if (!form.subject) errors.subject = "Please select a subject";

  if (!message) errors.message = "Please enter a message";
  else if (message.length < 10)
    errors.message = "Message must be at least 10 characters";
  else if (message.length > 1000)
    errors.message = "Message must be under 1000 characters";

  return errors;
}

const fieldClass =
  "border-border bg-background focus:border-primary focus:ring-primary/25 w-full rounded-xl border py-3 pr-4 pl-11 text-sm outline-none transition focus:ring-4";

function ContactPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSending(true);
    try {
      await contactApi.create(form);
      setSending(false);
      setForm(emptyForm);
      toast.success("Message sent! Our team will reply within 24 hours.");
    } catch (error) {
      toast.error(error.message || "Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Floodlit football turf at night"
          width={1920}
          height={700}
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="from-primary-deep/95 via-primary-deep/80 to-primary-deep/45 absolute inset-0 -z-10 bg-gradient-to-r" />
        <div className="container-page text-primary-deep-foreground relative py-20 lg:py-24">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mt-4 max-w-md text-base opacity-90 sm:text-lg">
            We'd love to hear from you! Reach out to us for any queries, support
            or partnerships.
          </p>
          <nav
            aria-label="Breadcrumb"
            className="mt-6 flex items-center gap-2 text-sm opacity-80"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="opacity-100">Contact Us</span>
          </nav>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_1.6fr] lg:gap-16">
          {/* Get in touch */}
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Get <span className="text-primary">in Touch</span>
            </h2>
            <span className="bg-primary mt-4 block h-1 w-16 rounded-full" />
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
              Have a question or need assistance? Our team is here to help you.
            </p>

            <ul className="mt-8 space-y-6">
              {details.map((d) => (
                <li key={d.title} className="flex gap-4">
                  <span className="bg-accent text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
                    <d.icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold">{d.title}</p>
                    {d.lines.map((line) => (
                      <p
                        key={line}
                        className="text-muted-foreground text-sm leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="border-border bg-card shadow-card rounded-3xl border p-6 sm:p-9">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="name"
                  label="Your Name"
                  icon={User}
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={update("name")}
                  error={errors.name}
                  maxLength={100}
                />
                <Field
                  id="email"
                  type="email"
                  label="Your Email"
                  icon={Mail}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={update("email")}
                  error={errors.email}
                  maxLength={255}
                />
                <Field
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  icon={Phone}
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={update("phone")}
                  error={errors.phone}
                  maxLength={15}
                />
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={update("subject")}
                    className="border-border bg-background focus:border-primary focus:ring-primary/25 w-full cursor-pointer rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.subject && <ErrorText>{errors.subject}</ErrorText>}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Type your message here..."
                  className="border-border bg-background focus:border-primary focus:ring-primary/25 w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4"
                />
                {errors.message ? (
                  <ErrorText>{errors.message}</ErrorText>
                ) : (
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    {form.message.trim().length}/1000 characters
                  </p>
                )}
              </div>

              <Button type="submit" disabled={sending} className="rounded-xl">
                <Send size={16} />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* Trust strip */}
        <div className="bg-muted mt-14 grid gap-8 rounded-3xl p-8 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-4">
              <span className="bg-accent text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
                <t.icon size={18} />
              </span>
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ErrorText({ children }) {
  return <p className="text-destructive mt-1.5 text-xs">{children}</p>;
}

function Field({ id, label, icon: Icon, error, type = "text", ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
        />
        <input id={id} type={type} className={fieldClass} {...props} />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
