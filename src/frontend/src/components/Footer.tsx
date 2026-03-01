export function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="border-t border-gray-100 bg-cream py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="font-display text-lg font-semibold"
            style={{ color: "oklch(0.60 0.12 185)" }}
          >
            Choosen Kids
          </span>
          <span className="text-charcoal/20">|</span>
          <span className="text-xs text-charcoal/40 tracking-wide">
            Preserving India's Dying Arts
          </span>
        </div>
        <p className="text-xs text-charcoal/40">
          © {year}. Built with{" "}
          <span style={{ color: "oklch(0.60 0.12 185)" }}>♥</span> using{" "}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-charcoal/70 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
