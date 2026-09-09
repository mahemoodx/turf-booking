import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-sm opacity-80"
    >
      <Link to="/" className="hover:underline">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <ChevronRight size={14} />
          {item.to ? (
            <Link to={item.to} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
