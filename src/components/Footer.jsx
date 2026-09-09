import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import Button from "./Button";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! Turf deals are on the way.");
    setEmail("");
  };

  return (
    <footer className="surface-deep mt-24">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-[image:var(--gradient-primary)] text-primary-foreground flex size-10 items-center justify-center rounded-2xl text-lg font-black">
              T
            </span>
            <span className="text-lg font-extrabold">TurfBook</span>
          </div>
          <p className="mt-4 text-sm opacity-75">
            Book. Play. Enjoy. India's simplest way to find and reserve premium
            sports turfs near you.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            {[
              { to: "/turfs", label: "Browse Turfs" },
              { to: "/how-it-works", label: "How It Works" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
              { to: "/my-bookings", label: "My Bookings" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:opacity-100 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Get in Touch</h4>
          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li className="flex items-center gap-2">
              <Phone size={15} /> +91 81794 69535
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} /> support@turfbook.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5" /> Kondapur, Hyderabad,
              Telangana 500084
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Newsletter</h4>
          <p className="mt-4 text-sm opacity-75">
            Weekly slot drops and turf offers in your inbox.
          </p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-current/20 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:opacity-60 focus:border-current/50"
            />
            <Button type="submit" size="sm" aria-label="Subscribe">
              <Send size={15} />
            </Button>
          </form>
        </div>
      </div>

      <div className="container-page border-t border-current/15 py-6 text-center text-xs opacity-70">
        © {new Date().getFullYear()} TurfBook. Frontend demo prototype.
      </div>
    </footer>
  );
}
