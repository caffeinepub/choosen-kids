import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Course } from "../backend.d";
import { Footer } from "../components/Footer";
import { useGetAllCourses } from "../hooks/useQueries";

const ART_IMAGES: Record<string, string> = {
  "Toda Embroidery": "/assets/generated/toda-embroidery.dim_800x600.jpg",
  Madhubani: "/assets/generated/madhubani-painting.dim_800x600.jpg",
  Warli: "/assets/generated/warli-art.dim_800x600.jpg",
  Mandala: "/assets/generated/mandala-art.dim_800x600.jpg",
  Kalamkari: "/assets/generated/kalamkari-art.dim_800x600.jpg",
};

const MENTOR_AVATARS = [
  "/assets/generated/mentor-woman-avatar.dim_200x200.jpg",
  "/assets/generated/mentor-man-avatar.dim_200x200.jpg",
];

function formatPrice(price: bigint): string {
  return `₹${(Number(price) / 100).toLocaleString("en-IN")}`;
}

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
        <div className="flex items-center justify-between mt-5">
          <div>
            <p className="text-2xl font-display font-semibold text-charcoal">
              {formatPrice(course.price)}
            </p>
            <p className="text-xs text-charcoal/40 mt-0.5">
              Course + Starter Kit
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/learn/$courseId",
                params: { courseId: course.id.toString() },
              })
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "oklch(0.18 0.01 260)" }}
          >
            <ShoppingBag size={14} />
            Buy Course
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { data: courses = [] } = useGetAllCourses();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse at 100% 0%, oklch(0.60 0.12 185), transparent 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto relative">
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

      <Footer />
    </div>
  );
}
