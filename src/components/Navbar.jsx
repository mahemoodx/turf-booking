import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CircleUserRound, Menu, X } from "lucide-react";
import Button from "./Button";
import { useApp } from "@/store/AppStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/turfs", label: "Turfs" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="bg-[image:var(--gradient-primary)] text-primary-foreground flex size-10 items-center justify-center rounded-2xl text-lg font-black">
            T
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold">TurfBook</span>
            <span className="text-muted-foreground block text-[11px]">
              Book. Play. Enjoy.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="hover:text-primary rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user.loggedIn ? (
            <>
              <Button as={Link} to="/my-bookings" variant="outline" size="sm">
                My Bookings
              </Button>
              {user.roles.includes("ADMIN") && <Button as={Link} to="/admin" variant="outline" size="sm">Admin</Button>}
              <Button size="sm" onClick={logout}>
                <CircleUserRound size={16} /> {user.name.split(" ")[0]}
                <span className="sr-only">Log out</span>
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" size="sm">
                Sign Up
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="hover:bg-accent cursor-pointer rounded-xl p-2 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-border bg-background border-t lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-accent" }}
                className="rounded-xl px-4 py-3 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {user.loggedIn ? (
                <>
                  <Button
                    as={Link}
                    to="/my-bookings"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    My Bookings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { logout(); setOpen(false); }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
      <span className="sr-only">{pathname}</span>
    </header>
  );
}
