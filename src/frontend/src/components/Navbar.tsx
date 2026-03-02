import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = location.pathname;
  const initial = userName ? userName[0].toUpperCase() : "K";
  const prevPathRef = useRef(pathname);

  const isActive = (to: string) => pathname === to;

  // Close menu on route change (avoids including setMenuOpen in deps)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setMenuOpen(false);
    }
  });

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (!isAuthenticated) return null;
  if (pathname === "/" || pathname === "/heritage") return null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-6 md:px-8 h-[60px] flex items-center gap-0">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center pr-6 md:pr-8 border-r border-gray-150 mr-6 md:mr-8 flex-shrink-0"
            style={{ borderColor: "oklch(0.91 0.005 80)" }}
          >
            <span
              className="font-display text-[1.2rem] md:text-[1.35rem] font-semibold"
              style={{
                color: "oklch(0.60 0.12 185)",
                letterSpacing: "-0.01em",
              }}
            >
              Choosen Kids
            </span>
          </Link>

          {/* Center Nav — desktop only */}
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

          {/* Right: profile + logout (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            {/* Sign out — desktop only */}
            <button
              type="button"
              onClick={logout}
              className="hidden md:block text-[10px] tracking-[0.18em] uppercase text-charcoal/35 hover:text-charcoal/70 transition-colors"
            >
              Sign Out
            </button>

            {/* Profile avatar */}
            <Link to="/dashboard">
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-md"
                style={{ background: "oklch(0.60 0.12 185)" }}
              >
                {initial}
              </button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 rounded-md hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2"
              style={
                {
                  "--tw-ring-color": "oklch(0.60 0.12 185)",
                } as React.CSSProperties
              }
            >
              {menuOpen ? (
                /* Close (X) icon */
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2L16 16M16 2L2 16"
                    stroke="oklch(0.35 0.02 60)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Hamburger (3 lines) icon */
                <svg
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1H17M1 7H17M1 13H17"
                    stroke="oklch(0.35 0.02 60)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={[
          "fixed inset-x-0 top-[60px] z-40 md:hidden transition-all duration-300 ease-in-out",
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="bg-white border-b border-gray-200/80 shadow-lg">
          <ul className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link, index) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "flex items-center gap-3 px-3 py-3.5 rounded-lg text-[11px] tracking-[0.20em] uppercase font-medium transition-all duration-150",
                    isActive(link.to)
                      ? "text-white"
                      : "text-charcoal/60 hover:text-charcoal hover:bg-gray-50",
                  ].join(" ")}
                  style={
                    isActive(link.to)
                      ? { background: "oklch(0.60 0.12 185)" }
                      : {}
                  }
                  aria-current={isActive(link.to) ? "page" : undefined}
                >
                  {/* Subtle index number for luxury editorial feel */}
                  <span
                    className="text-[9px] tabular-nums opacity-40 w-4 text-right flex-shrink-0"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li aria-hidden="true">
              <div className="my-1 h-px bg-gray-100" />
            </li>

            {/* Sign Out */}
            <li>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-lg text-[11px] tracking-[0.20em] uppercase font-medium text-charcoal/40 hover:text-charcoal/70 hover:bg-gray-50 transition-all duration-150"
              >
                <span
                  className="text-[9px] tabular-nums opacity-40 w-4 text-right flex-shrink-0"
                  aria-hidden="true"
                >
                  05
                </span>
                Sign Out
              </button>
            </li>
          </ul>
        </div>

        {/* Tap-outside backdrop */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is decorative, keyboard users use Escape or nav links */}
        <div
          className="fixed inset-0 bg-black/10 -z-10"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      </nav>
    </>
  );
}
