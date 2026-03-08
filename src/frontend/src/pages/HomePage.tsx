import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShoppingBag, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Course } from "../backend.d";
import { Footer } from "../components/Footer";
import { useGetAllCourses } from "../hooks/useQueries";

const ART_IMAGES: Record<string, string> = {
  "Toda Embroidery": "/assets/generated/toda-embroidery.dim_800x600.jpg",
  Madhubani: "/assets/generated/madhubani-painting.dim_800x600.jpg",
  Warli: "/assets/generated/warli-art.dim_800x600.jpg",
  Mandala: "/assets/generated/mandala-art.dim_800x600.jpg",
  Kalamkari: "/assets/generated/kalamkari-art.dim_800x600.jpg",
  "Kerala Mural": "/assets/generated/kerala-mural-painting.dim_800x600.jpg",
  "Theyyam Craft": "/assets/generated/theyyam-mask-craft.dim_800x600.jpg",
  "Metal Mirror Art": "/assets/generated/aranmula-kannadi.dim_800x600.jpg",
  "Kalaripayattu Art": "/assets/generated/kalaripayattu-art.dim_800x600.jpg",
};

const MENTOR_AVATARS = [
  "/assets/generated/mentor-woman-avatar.dim_200x200.jpg",
  "/assets/generated/mentor-man-avatar.dim_200x200.jpg",
];

function formatPrice(price: bigint): string {
  return `₹${(Number(price) / 100).toLocaleString("en-IN")}`;
}

// ─── Snow Breeze ──────────────────────────────────────────────────────────────
function SnowBreeze() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const flakes = Array.from({ length: 65 }, () => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      r: 1.5 + Math.random() * 2.5,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    let frame = 0;

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      frame++;

      for (const flake of flakes) {
        flake.y += flake.speed;
        flake.x += flake.drift + Math.sin(frame * 0.008 + flake.phase) * 0.25;

        if (flake.y > canvas!.height + 10) {
          flake.y = -10;
          flake.x = Math.random() * canvas!.width;
        }
        if (flake.x > canvas!.width + 10) flake.x = -10;
        if (flake.x < -10) flake.x = canvas!.width + 10;

        ctx!.beginPath();
        ctx!.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 230, 255, ${flake.opacity})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Welcome Cartoon ──────────────────────────────────────────────────────────
function WelcomeCartoon() {
  // phase: "hidden" → "entering" → "visible" → "exiting" → "done"
  const [phase, setPhase] = useState<
    "hidden" | "entering" | "visible" | "exiting" | "done"
  >("hidden");

  useEffect(() => {
    // 1 s delay → slide in
    const t1 = setTimeout(() => setPhase("entering"), 1000);
    // 1 s delay + 0.8 s slide-in + 3 s visible → start exit
    const t2 = setTimeout(() => setPhase("exiting"), 1000 + 800 + 3000);
    // after exit animation (0.7 s) → remove from DOM
    const t3 = setTimeout(() => setPhase("done"), 1000 + 800 + 3000 + 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "hidden" || phase === "done") return null;

  const isExiting = phase === "exiting";

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="welcome-cartoon"
          initial={{ y: 340 }}
          animate={{ y: 0 }}
          exit={{ y: 340 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            pointerEvents: "none",
            width: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.4,
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            style={{
              background: "oklch(0.55 0.14 185)",
              color: "#fff",
              borderRadius: 20,
              padding: "10px 18px",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.01em",
              boxShadow: "0 4px 18px oklch(0.55 0.14 185 / 0.35)",
              marginBottom: 10,
              whiteSpace: "nowrap",
              position: "relative",
            }}
          >
            Welcome, Kiddies! ✨{/* Bubble tail pointing down */}
            <span
              style={{
                position: "absolute",
                bottom: -9,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "10px solid oklch(0.55 0.14 185)",
              }}
            />
          </motion.div>

          {/* Cloud + Cartoon */}
          <div style={{ position: "relative", width: 200, height: 170 }}>
            {/* Fluffy cloud SVG */}
            <svg
              role="img"
              aria-label="Fluffy cloud"
              viewBox="0 0 200 100"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                filter: "drop-shadow(0 8px 24px rgba(100,180,255,0.25))",
              }}
            >
              {/* Cloud body – layered circles for fluffiness */}
              <ellipse cx="100" cy="78" rx="90" ry="28" fill="white" />
              <circle cx="55" cy="68" r="26" fill="white" />
              <circle cx="85" cy="58" r="30" fill="white" />
              <circle cx="118" cy="60" r="28" fill="white" />
              <circle cx="148" cy="68" r="22" fill="white" />
              {/* Subtle inner highlight */}
              <ellipse
                cx="100"
                cy="82"
                rx="75"
                ry="16"
                fill="rgba(220,240,255,0.4)"
              />
            </svg>

            {/* Cartoon kid character (SVG) */}
            <svg
              role="img"
              aria-label="Cartoon kid character"
              viewBox="0 0 100 130"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 38,
                left: "50%",
                transform: "translateX(-50%)",
                width: 90,
                height: 117,
              }}
            >
              {/* Body */}
              <rect
                x="30"
                y="72"
                width="40"
                height="38"
                rx="12"
                fill="oklch(0.72 0.15 185)"
              />
              {/* Collar / shirt detail */}
              <path d="M44 72 L50 82 L56 72" fill="white" opacity="0.6" />

              {/* Left arm with paintbrush */}
              <rect
                x="12"
                y="76"
                width="22"
                height="10"
                rx="5"
                fill="oklch(0.72 0.15 185)"
              />
              {/* Paintbrush handle */}
              <rect
                x="2"
                y="79"
                width="16"
                height="4"
                rx="2"
                fill="oklch(0.72 0.10 60)"
              />
              {/* Paintbrush tip */}
              <ellipse
                cx="3"
                cy="81"
                rx="4"
                ry="5"
                fill="oklch(0.62 0.18 30)"
              />

              {/* Right arm */}
              <rect
                x="66"
                y="76"
                width="22"
                height="10"
                rx="5"
                fill="oklch(0.72 0.15 185)"
              />

              {/* Neck */}
              <rect
                x="43"
                y="62"
                width="14"
                height="14"
                rx="4"
                fill="oklch(0.87 0.06 55)"
              />

              {/* Head */}
              <circle cx="50" cy="50" r="26" fill="oklch(0.87 0.06 55)" />

              {/* Hair */}
              <path
                d="M24 44 Q26 20 50 22 Q74 20 76 44 Q68 28 50 28 Q32 28 24 44Z"
                fill="oklch(0.30 0.05 50)"
              />

              {/* Hat brim */}
              <ellipse
                cx="50"
                cy="28"
                rx="22"
                ry="5"
                fill="oklch(0.55 0.14 185)"
              />
              {/* Hat crown */}
              <rect
                x="34"
                y="10"
                width="32"
                height="20"
                rx="6"
                fill="oklch(0.55 0.14 185)"
              />
              {/* Hat band */}
              <rect
                x="34"
                y="24"
                width="32"
                height="5"
                rx="2"
                fill="oklch(0.65 0.12 85)"
              />
              {/* Hat star */}
              <text x="46" y="21" fontSize="8" fill="white" textAnchor="middle">
                ★
              </text>

              {/* Eyes (whites) */}
              <circle cx="40" cy="50" r="8" fill="white" />
              <circle cx="60" cy="50" r="8" fill="white" />
              {/* Pupils */}
              <circle cx="41" cy="51" r="4.5" fill="oklch(0.25 0.04 260)" />
              <circle cx="61" cy="51" r="4.5" fill="oklch(0.25 0.04 260)" />
              {/* Eye shine */}
              <circle cx="43" cy="49" r="1.5" fill="white" />
              <circle cx="63" cy="49" r="1.5" fill="white" />

              {/* Rosy cheeks */}
              <ellipse
                cx="35"
                cy="57"
                rx="6"
                ry="4"
                fill="oklch(0.80 0.12 20)"
                opacity="0.45"
              />
              <ellipse
                cx="65"
                cy="57"
                rx="6"
                ry="4"
                fill="oklch(0.80 0.12 20)"
                opacity="0.45"
              />

              {/* Smile */}
              <path
                d="M41 62 Q50 70 59 62"
                stroke="oklch(0.40 0.05 30)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Nose */}
              <ellipse
                cx="50"
                cy="58"
                rx="3"
                ry="2"
                fill="oklch(0.75 0.07 40)"
                opacity="0.5"
              />

              {/* Legs */}
              <rect
                x="35"
                y="108"
                width="13"
                height="18"
                rx="6"
                fill="oklch(0.25 0.04 260)"
              />
              <rect
                x="52"
                y="108"
                width="13"
                height="18"
                rx="6"
                fill="oklch(0.25 0.04 260)"
              />
              {/* Shoes */}
              <ellipse
                cx="41"
                cy="126"
                rx="9"
                ry="5"
                fill="oklch(0.20 0.03 30)"
              />
              <ellipse
                cx="58"
                cy="126"
                rx="9"
                ry="5"
                fill="oklch(0.20 0.03 30)"
              />
            </svg>
          </div>
        </motion.div>
      )}

      {/* When exiting, use a separate element so exit animation plays */}
      {isExiting && (
        <motion.div
          key="welcome-cartoon-exit"
          initial={{ y: 0 }}
          animate={{ y: 340 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            pointerEvents: "none",
            width: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Speech bubble (fades out) */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: "oklch(0.55 0.14 185)",
              color: "#fff",
              borderRadius: 20,
              padding: "10px 18px",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.01em",
              marginBottom: 10,
              whiteSpace: "nowrap",
              position: "relative",
            }}
          >
            Welcome, Kiddies! ✨
            <span
              style={{
                position: "absolute",
                bottom: -9,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "10px solid oklch(0.55 0.14 185)",
              }}
            />
          </motion.div>

          {/* Cloud + Cartoon (same SVGs as above) */}
          <div style={{ position: "relative", width: 200, height: 170 }}>
            <svg
              role="img"
              aria-label="Fluffy cloud"
              viewBox="0 0 200 100"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                filter: "drop-shadow(0 8px 24px rgba(100,180,255,0.25))",
              }}
            >
              <ellipse cx="100" cy="78" rx="90" ry="28" fill="white" />
              <circle cx="55" cy="68" r="26" fill="white" />
              <circle cx="85" cy="58" r="30" fill="white" />
              <circle cx="118" cy="60" r="28" fill="white" />
              <circle cx="148" cy="68" r="22" fill="white" />
              <ellipse
                cx="100"
                cy="82"
                rx="75"
                ry="16"
                fill="rgba(220,240,255,0.4)"
              />
            </svg>
            <svg
              role="img"
              aria-label="Cartoon kid character"
              viewBox="0 0 100 130"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                bottom: 38,
                left: "50%",
                transform: "translateX(-50%)",
                width: 90,
                height: 117,
              }}
            >
              <rect
                x="30"
                y="72"
                width="40"
                height="38"
                rx="12"
                fill="oklch(0.72 0.15 185)"
              />
              <path d="M44 72 L50 82 L56 72" fill="white" opacity="0.6" />
              <rect
                x="12"
                y="76"
                width="22"
                height="10"
                rx="5"
                fill="oklch(0.72 0.15 185)"
              />
              <rect
                x="2"
                y="79"
                width="16"
                height="4"
                rx="2"
                fill="oklch(0.72 0.10 60)"
              />
              <ellipse
                cx="3"
                cy="81"
                rx="4"
                ry="5"
                fill="oklch(0.62 0.18 30)"
              />
              <rect
                x="66"
                y="76"
                width="22"
                height="10"
                rx="5"
                fill="oklch(0.72 0.15 185)"
              />
              <rect
                x="43"
                y="62"
                width="14"
                height="14"
                rx="4"
                fill="oklch(0.87 0.06 55)"
              />
              <circle cx="50" cy="50" r="26" fill="oklch(0.87 0.06 55)" />
              <path
                d="M24 44 Q26 20 50 22 Q74 20 76 44 Q68 28 50 28 Q32 28 24 44Z"
                fill="oklch(0.30 0.05 50)"
              />
              <ellipse
                cx="50"
                cy="28"
                rx="22"
                ry="5"
                fill="oklch(0.55 0.14 185)"
              />
              <rect
                x="34"
                y="10"
                width="32"
                height="20"
                rx="6"
                fill="oklch(0.55 0.14 185)"
              />
              <rect
                x="34"
                y="24"
                width="32"
                height="5"
                rx="2"
                fill="oklch(0.65 0.12 85)"
              />
              <text x="46" y="21" fontSize="8" fill="white" textAnchor="middle">
                ★
              </text>
              <circle cx="40" cy="50" r="8" fill="white" />
              <circle cx="60" cy="50" r="8" fill="white" />
              <circle cx="41" cy="51" r="4.5" fill="oklch(0.25 0.04 260)" />
              <circle cx="61" cy="51" r="4.5" fill="oklch(0.25 0.04 260)" />
              <circle cx="43" cy="49" r="1.5" fill="white" />
              <circle cx="63" cy="49" r="1.5" fill="white" />
              <ellipse
                cx="35"
                cy="57"
                rx="6"
                ry="4"
                fill="oklch(0.80 0.12 20)"
                opacity="0.45"
              />
              <ellipse
                cx="65"
                cy="57"
                rx="6"
                ry="4"
                fill="oklch(0.80 0.12 20)"
                opacity="0.45"
              />
              <path
                d="M41 62 Q50 70 59 62"
                stroke="oklch(0.40 0.05 30)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse
                cx="50"
                cy="58"
                rx="3"
                ry="2"
                fill="oklch(0.75 0.07 40)"
                opacity="0.5"
              />
              <rect
                x="35"
                y="108"
                width="13"
                height="18"
                rx="6"
                fill="oklch(0.25 0.04 260)"
              />
              <rect
                x="52"
                y="108"
                width="13"
                height="18"
                rx="6"
                fill="oklch(0.25 0.04 260)"
              />
              <ellipse
                cx="41"
                cy="126"
                rx="9"
                ry="5"
                fill="oklch(0.20 0.03 30)"
              />
              <ellipse
                cx="58"
                cy="126"
                rx="9"
                ry="5"
                fill="oklch(0.20 0.03 30)"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function CourseCard({ course, index }: { course: Course; index: number }) {
  const navigate = useNavigate();
  const artImg = ART_IMAGES[course.artType] ?? ART_IMAGES["Toda Embroidery"];
  const avatar = MENTOR_AVATARS[index % 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 luxury-card group"
    >
      {/* Art Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={artImg}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* Region tag */}
        <div className="absolute top-3 left-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/90 text-charcoal font-medium tracking-wide">
            {course.region}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-charcoal leading-tight">
          {course.title}
        </h3>
        <p className="text-xs text-charcoal/40 tracking-widest uppercase mt-1">
          {course.artType}
        </p>

        {/* Description */}
        <p className="text-sm text-charcoal/60 mt-3 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Mentor */}
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-50">
          <img
            src={avatar}
            alt={course.mentorName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal truncate">
              {course.mentorName}
            </p>
            <p className="text-xs text-charcoal/45 truncate">
              {course.mentorBio}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Star size={11} className="text-gold fill-gold" />
            <span className="text-xs font-medium text-charcoal/60">4.9</span>
          </div>
        </div>

        {/* Kit description */}
        <p className="mt-4 text-xs text-charcoal/40 leading-relaxed bg-cream rounded-lg px-3 py-2.5 italic">
          Includes specialized needles, organic threads, and premium fabric
          delivered to your door.
        </p>

        {/* Price + CTA */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-display font-semibold text-charcoal">
                {formatPrice(course.price + 249900n)}
              </p>
              <p className="text-xs text-charcoal/40 mt-0.5">
                Course + Starter Kit
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/checkout",
                  search: {
                    type: "bundle",
                    courseId: course.id.toString(),
                    title: course.title,
                    price: String(Number(course.price) + 249900),
                  },
                })
              }
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "oklch(0.65 0.12 85)" }}
            >
              <ShoppingBag size={14} />
              Buy Course + Kit
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/checkout",
                search: {
                  type: "course",
                  courseId: course.id.toString(),
                  title: course.title,
                  price: String(Number(course.price)),
                },
              })
            }
            className="text-xs text-charcoal/50 hover:text-charcoal/70 underline underline-offset-2 transition-colors"
          >
            Course only — {formatPrice(course.price)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hero Logo Seal ───────────────────────────────────────────────────────────
function HeroLogoSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1.0,
        delay: 0.3,
        type: "spring",
        stiffness: 90,
        damping: 14,
      }}
      className="hidden lg:flex flex-col items-center flex-shrink-0"
      style={{ width: 360 }}
    >
      {/* Red Thumbtack Pin */}
      <div
        className="flex flex-col items-center"
        style={{ marginBottom: -6, zIndex: 20, position: "relative" }}
      >
        {/* Red ball head */}
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3.5,
            ease: "easeInOut",
          }}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #ff6b6b, #dc2626 50%, #991b1b)",
            boxShadow:
              "0 4px 12px rgba(220,38,38,0.5), 0 2px 4px rgba(0,0,0,0.25), inset 0 -2px 4px rgba(0,0,0,0.2)",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Glossy highlight on ball */}
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 7,
              width: 10,
              height: 7,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
              transform: "rotate(-20deg)",
            }}
          />
          {/* Secondary small highlight */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 18,
              width: 4,
              height: 3,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
            }}
          />
        </motion.div>

        {/* Metallic pin needle/point */}
        <motion.div
          animate={{ scaleY: [1, 1.02, 1] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3.5,
            ease: "easeInOut",
          }}
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "22px solid #9ca3af",
            filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.2))",
            position: "relative",
          }}
        >
          {/* Metallic needle body above triangle tip */}
          <div
            style={{
              position: "absolute",
              top: -28,
              left: -3,
              width: 6,
              height: 10,
              background: "linear-gradient(90deg, #e5e7eb, #9ca3af, #d1d5db)",
              borderRadius: "1px",
            }}
          />
        </motion.div>
      </div>

      {/* Seal container with swing animation */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4.5,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "top center", position: "relative" }}
      >
        {/* Outer glow ring */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 36px 10px oklch(0.60 0.12 185 / 0.15), 0 8px 40px rgba(0,0,0,0.12)",
              "0 0 60px 20px oklch(0.60 0.12 185 / 0.28), 0 8px 40px rgba(0,0,0,0.12)",
              "0 0 36px 10px oklch(0.60 0.12 185 / 0.15), 0 8px 40px rgba(0,0,0,0.12)",
            ],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3,
            ease: "easeInOut",
          }}
          style={{
            borderRadius: "50%",
            padding: 8,
            background:
              "linear-gradient(135deg, oklch(0.96 0.04 185), oklch(0.98 0.02 85), oklch(0.96 0.04 185))",
          }}
        >
          {/* Decorative outer ring */}
          <div
            style={{
              borderRadius: "50%",
              padding: 5,
              background:
                "conic-gradient(from 0deg, oklch(0.60 0.12 185), oklch(0.75 0.14 85), oklch(0.55 0.14 30), oklch(0.60 0.12 185))",
            }}
          >
            {/* Inner cream ring */}
            <div
              style={{
                borderRadius: "50%",
                padding: 4,
                background: "oklch(0.98 0.01 85)",
              }}
            >
              {/* Seal image */}
              <div
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "oklch(0.98 0.01 85)",
                  border: "2px solid oklch(0.92 0.04 85)",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src="/assets/generated/choosen-kids-logo-seal-v2.dim_400x400.png"
                  alt="Choosen Kids Logo Seal"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloom sparkles around seal */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.div
            key={angle}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2.5,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: 9,
              height: 9,
              borderRadius: "50%",
              background:
                i % 2 === 0 ? "oklch(0.60 0.12 185)" : "oklch(0.75 0.14 85)",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-172px)`,
              pointerEvents: "none",
            }}
          />
        ))}
      </motion.div>

      {/* Subtle label below */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-4 text-xs tracking-widest uppercase font-medium"
        style={{ color: "oklch(0.55 0.08 185)" }}
      >
        Est. India · Heritage Arts
      </motion.p>
    </motion.div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const { data: courses = [] } = useGetAllCourses();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Snow Breeze canvas */}
        <SnowBreeze />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            zIndex: 2,
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse at 100% 0%, oklch(0.60 0.12 185), transparent 70%)",
            zIndex: 2,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-[3] flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Text content */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="h-px flex-1 max-w-12"
                  style={{ background: "oklch(0.60 0.12 185)" }}
                />
                <span className="text-xs tracking-widest uppercase text-charcoal/40">
                  India's Living Heritage
                </span>
              </div>

              <h1
                className="font-display tracking-tight leading-[1.05]"
                style={{ color: "oklch(0.18 0.01 260)" }}
              >
                <span className="block text-5xl md:text-7xl font-semibold">
                  Preserve.
                </span>
                <span
                  className="block text-6xl md:text-8xl font-normal italic"
                  style={{ color: "oklch(0.60 0.12 185)" }}
                >
                  Create.
                </span>
                <span className="block text-5xl md:text-7xl font-semibold">
                  Earn.
                </span>
              </h1>

              <p className="mt-8 text-lg text-charcoal/60 max-w-xl leading-relaxed font-light">
                Master dying Indian art forms guided by India's greatest living
                artisans. Each course ships a physical heritage kit — tools,
                threads, and the craft of generations.
              </p>

              <div className="flex items-center gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/kit" })}
                  className="px-8 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "oklch(0.60 0.12 185)" }}
                >
                  Explore Starter Kit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("courses")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Browse Courses
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-10 mt-16 pt-16 border-t border-gray-100"
            >
              {[
                { n: "47+", label: "Dying arts preserved" },
                { n: "120+", label: "Master artisans" },
                { n: "8,200+", label: "Young artists trained" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-semibold text-charcoal">
                    {stat.n}
                  </p>
                  <p className="text-xs text-charcoal/40 mt-1 tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Logo Seal hanging with safety pin */}
          <HeroLogoSeal />
        </div>
      </section>

      {/* Course Grid */}
      <section
        id="courses"
        className="py-24 px-6"
        style={{ background: "oklch(0.98 0.008 80)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Editorial section header */}
          <div className="mb-16 relative">
            {/* Large decorative numeral — editorial device */}
            <span
              className="absolute -top-6 left-0 font-display font-semibold select-none pointer-events-none leading-none"
              style={{
                fontSize: "clamp(6rem, 14vw, 12rem)",
                color: "oklch(0.18 0.01 260 / 0.04)",
                letterSpacing: "-0.03em",
              }}
              aria-hidden="true"
            >
              01
            </span>
            <div className="relative pt-10">
              <p className="text-xs tracking-[0.25em] uppercase text-charcoal/35 mb-5 font-medium">
                Curriculum
              </p>
              <h2
                className="font-display font-semibold tracking-tight leading-[1.0]"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "oklch(0.18 0.01 260)",
                }}
              >
                Dying Arts,
                <br />
                <em
                  className="italic font-normal"
                  style={{ color: "oklch(0.60 0.12 185)" }}
                >
                  Alive Again
                </em>
              </h2>
              <p className="mt-5 text-sm text-charcoal/45 max-w-sm leading-relaxed font-light">
                Five courses. Five endangered traditions. Each one kept alive by
                a single living master.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id.toString()}
                course={course}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Masters Teaser */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-4">
            The Artisans
          </p>
          <h2 className="font-display text-3xl font-semibold text-charcoal mb-4">
            Meet the Masters
          </h2>
          <p className="text-base text-charcoal/50 max-w-md mx-auto leading-relaxed mb-8">
            Decades of mastery, one craft at a time. Our mentors carry
            traditions that have survived centuries.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 text-sm font-medium text-charcoal hover:border-teal hover:text-teal transition-all"
          >
            Discover the Artisans
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      <WelcomeCartoon />
      <Footer />
    </div>
  );
}
