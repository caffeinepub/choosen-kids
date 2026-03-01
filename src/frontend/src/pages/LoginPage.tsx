import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      void navigate({ to: "/heritage" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Subtle decorative corner motifs */}
      <div
        className="absolute top-0 left-0 w-64 h-64 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, oklch(0.60 0.12 185), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, oklch(0.65 0.12 85), transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Wordmark */}
        <div className="text-center mb-12">
          {/* Decorative top rule with dot */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="h-px w-12"
              style={{ background: "oklch(0.60 0.12 185 / 0.4)" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.65 0.12 85)" }}
            />
            <div
              className="h-px w-12"
              style={{ background: "oklch(0.60 0.12 185 / 0.4)" }}
            />
          </div>
          <h1
            className="font-display font-semibold tracking-tight"
            style={{
              color: "oklch(0.18 0.01 260)",
              fontSize: "2.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Choosen Kids
          </h1>
          <p
            className="mt-3 text-xs tracking-[0.22em] uppercase font-medium"
            style={{ color: "oklch(0.60 0.12 185 / 0.7)" }}
          >
            Heritage Arts Platform
          </p>
        </div>

        {/* Thin decorative rule */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal/30 font-medium">
            Sign In
          </span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-xl p-8 shadow-craft"
        >
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-wider uppercase text-charcoal/50 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-wider uppercase text-charcoal/50 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 text-sm rounded-lg border border-gray-200 bg-white text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-full text-sm font-medium text-white tracking-[0.06em] transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: "oklch(0.60 0.12 185)" }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connecting…
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-charcoal/40">
              Secured with{" "}
              <span
                className="font-medium"
                style={{ color: "oklch(0.60 0.12 185)" }}
              >
                Internet Identity
              </span>
            </p>
          </div>
        </form>

        {/* Tagline */}
        <p className="mt-8 text-center text-xs text-charcoal/30 tracking-wide">
          A sanctuary for India's dying arts
        </p>
      </div>
    </main>
  );
}
