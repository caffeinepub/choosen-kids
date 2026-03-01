import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  IndianRupee,
  LayoutGrid,
  TrendingUp,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { useGetAllCourses, useGetCoursesProgress } from "../hooks/useQueries";

type TabId = "overview" | "projects" | "upload" | "royalties";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutGrid size={14} /> },
  { id: "projects", label: "My Projects", icon: <BookOpen size={14} /> },
  { id: "upload", label: "Upload Artwork", icon: <Upload size={14} /> },
  { id: "royalties", label: "Royalties", icon: <TrendingUp size={14} /> },
];

const MASTERS = [
  {
    name: "Devaki Amma",
    specialty: "Toda Embroidery",
    years: "38 years",
    image: "/assets/generated/master-artisan-woman.dim_600x700.jpg",
    story:
      "Born in the Nilgiri foothills, Devaki Amma learned the sacred PuKkur embroidery from her mother at age seven. Her geometric patterns — lozenges, chevrons, and sacred triangles — encode the Toda cosmology: the buffalo, the god Ön, and the dairy temple. Today she guards one of India's most endangered textile languages, having trained over 400 children in its geometry.",
  },
  {
    name: "Ramesh Babu",
    specialty: "Madhubani Painting",
    years: "42 years",
    image: "/assets/generated/master-artisan-man.dim_600x700.jpg",
    story:
      "Ramesh Babu's hands move like a raga — rhythmic, deliberate, ancient. From his studio in Darbhanga, he has painted the birth of Krishna, the wedding of Sita, the churning of the cosmic ocean. His pigments are ground minerals and plant saps; his lines carry the unbroken muscle memory of the Mithila tradition across five generations of his family.",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { data: progressList = [] } = useGetCoursesProgress();
  const { data: courses = [] } = useGetAllCourses();

  const firstProgress = progressList[0] ?? {
    progressPercent: 65n,
    royaltiesEarned: 124000n,
    courseId: 1n,
  };
  const progressPercent = Number(firstProgress.progressPercent);
  const royalties = Number(firstProgress.royaltiesEarned) / 100;

  const currentCourse =
    courses.find((c) => c.id === firstProgress.courseId) ?? courses[0];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-2">
            Your Space
          </p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Kids Working Space
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-gray-100 pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-wide transition-all border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-teal text-teal"
                  : "border-transparent text-charcoal/45 hover:text-charcoal/70",
              ].join(" ")}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Current Project Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                    Current Project
                  </p>
                  <h3 className="font-display text-xl font-semibold text-charcoal">
                    {currentCourse?.title ?? "Toda Embroidery"}
                  </h3>
                  <p className="text-xs text-charcoal/45 mt-1">
                    {currentCourse?.artType ?? "Toda Embroidery"} ·{" "}
                    {currentCourse?.region ?? "Nilgiris"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/learn/$courseId",
                      params: {
                        courseId: (currentCourse?.id ?? 1n).toString(),
                      },
                    })
                  }
                  className="text-xs px-4 py-2 rounded-full text-white transition-all hover:opacity-90"
                  style={{ background: "oklch(0.60 0.12 185)" }}
                >
                  Continue
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-charcoal/50 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold text-teal">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ background: "oklch(0.60 0.12 185)" }}
                  />
                </div>
                <p className="text-xs text-charcoal/40 mt-2">
                  {progressPercent < 100
                    ? `${100 - progressPercent}% remaining`
                    : "Complete!"}
                </p>
              </div>
            </div>

            {/* Royalties Tracker */}
            <div
              className="rounded-2xl p-6 text-charcoal relative overflow-hidden"
              style={{ background: "oklch(0.97 0.01 80)" }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.12 85), transparent)",
                }}
              />
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                Royalties Earned
              </p>
              <div className="flex items-end gap-1 mt-3">
                <IndianRupee size={20} className="text-charcoal/60 mb-1" />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-display text-4xl font-semibold text-charcoal"
                >
                  {royalties.toLocaleString("en-IN")}
                </motion.p>
              </div>
              <p className="text-xs text-charcoal/45 mt-2">
                Total lifetime earnings
              </p>
              <div
                className="mt-4 h-px"
                style={{ background: "oklch(0.90 0.03 85)" }}
              />
              <p className="text-xs text-charcoal/50 mt-3 leading-relaxed">
                Earned through licensed artwork and brand partnerships.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-4">
                Quick Actions
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/upload" })}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-teal/30 hover:bg-teal/5 transition-all group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(0.92 0.05 185)" }}
                  >
                    <Upload
                      size={14}
                      style={{ color: "oklch(0.60 0.12 185)" }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-charcoal">
                      Upload Artwork
                    </p>
                    <p className="text-xs text-charcoal/40">
                      AI Review & Verification
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/kit" })}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gold/30 hover:bg-gold/5 transition-all group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(0.92 0.07 85)" }}
                  >
                    <BookOpen
                      size={14}
                      style={{ color: "oklch(0.65 0.12 85)" }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-charcoal">
                      Starter Kit
                    </p>
                    <p className="text-xs text-charcoal/40">
                      Get your heritage toolkit
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 lg:col-span-2">
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-4">
                Enrolled Courses
              </p>
              <div className="space-y-3">
                {courses.slice(0, 3).map((course, i) => (
                  <div
                    key={course.id.toString()}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background:
                          i === 0 ? "oklch(0.60 0.12 185)" : "oklch(0.85 0 0)",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">
                        {course.title}
                      </p>
                      <p className="text-xs text-charcoal/40">
                        {course.region}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        i === 0
                          ? "bg-teal/10 text-teal"
                          : "bg-gray-100 text-charcoal/50"
                      }`}
                    >
                      {i === 0 ? `${progressPercent}%` : "Enrolled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-charcoal/40 text-sm">
              Your projects will appear here.
            </p>
          </motion.div>
        )}

        {activeTab === "upload" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-lg"
          >
            <p className="text-sm text-charcoal/60 mb-4">
              Submit your artwork for AI verification and royalty tracking.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/upload" })}
              className="px-6 py-3 rounded-full text-sm font-medium text-white"
              style={{ background: "oklch(0.60 0.12 185)" }}
            >
              Go to Upload Portal
            </button>
          </motion.div>
        )}

        {activeTab === "royalties" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md"
          >
            <div
              className="rounded-2xl p-8"
              style={{ background: "oklch(0.97 0.01 80)" }}
            >
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-2">
                Lifetime Royalties
              </p>
              <p className="font-display text-5xl font-semibold text-charcoal mt-2">
                ₹{royalties.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-charcoal/45 mt-3 leading-relaxed">
                Earned through brand partnerships, licensed motifs, and
                marketplace sales.
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* ── Meet the Masters Magazine Spread ── */}
      <section
        className="py-20 px-6"
        style={{ background: "oklch(0.99 0.005 80)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-3">
              The Artisans
            </p>
            <h2 className="font-display text-4xl font-semibold text-charcoal">
              Meet the Masters
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {MASTERS.map((master, i) => (
              <motion.article
                key={master.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4]">
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p
                          className="text-xs tracking-widest uppercase mb-1"
                          style={{ color: "oklch(0.85 0.07 185)" }}
                        >
                          {master.specialty}
                        </p>
                        <h3 className="font-display text-2xl font-semibold text-white">
                          {master.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl font-semibold text-white/90">
                          {master.years}
                        </p>
                        <p className="text-xs text-white/60">of Heritage</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="px-1">
                  <div
                    className="w-8 h-0.5 mb-4"
                    style={{ background: "oklch(0.60 0.12 185)" }}
                  />
                  <p className="font-display text-base italic text-charcoal/70 leading-relaxed">
                    "{master.story}"
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
