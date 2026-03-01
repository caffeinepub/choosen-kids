import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { label: "Courses", to: "/home" },
  { label: "Live Auction", to: "/auction" },
  { label: "Masterpieces", to: "/partners" },
  { label: "Brand Partners", to: "/partners" },
];

export function Navbar() {
  const { isAuthenticated, logout, userName } = useAuth();
  const location = useLocation();
  const initial = userName ? userName[0].toUpperCase() : "K";

  const isActive = (to: string) => location.pathname === to;

  if (!isAuthenticated) return null;
  if (location.pathname === "/" || location.pathname === "/heritage")
    return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-8 h-[60px] flex items-center gap-0">
        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center pr-8 border-r border-gray-150 mr-8 flex-shrink-0"
          style={{ borderColor: "oklch(0.91 0.005 80)" }}
        >
          <span
            className="font-display text-[1.35rem] font-semibold"
            style={{
              color: "oklch(0.60 0.12 185)",
              letterSpacing: "-0.01em",
            }}
          >
            Choosen Kids
          </span>
        </Link>

        {/* Center Nav — takes all remaining space */}
        <nav className="hidden md:flex items-center gap-7 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={[
                "text-[10px] tracking-[0.18em] uppercase font-medium transition-colors duration-200 whitespace-nowrap",
                isActive(link.to)
                  ? "text-teal"
                  : "text-charcoal/50 hover:text-charcoal",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: profile + logout */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <button
            type="button"
            onClick={logout}
            className="hidden md:block text-[10px] tracking-[0.18em] uppercase text-charcoal/35 hover:text-charcoal/70 transition-colors"
          >
            Sign Out
          </button>
          <Link to="/dashboard">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-md"
              style={{ background: "oklch(0.60 0.12 185)" }}
            >
              {initial}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
