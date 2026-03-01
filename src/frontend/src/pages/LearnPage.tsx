import { useParams } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Clock,
  Lightbulb,
  Play,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { useGetAllCourses } from "../hooks/useQueries";

const ART_IMAGES: Record<string, string> = {
  "Toda Embroidery": "/assets/generated/toda-embroidery.dim_800x600.jpg",
  Madhubani: "/assets/generated/madhubani-painting.dim_800x600.jpg",
  Warli: "/assets/generated/warli-art.dim_800x600.jpg",
  Mandala: "/assets/generated/mandala-art.dim_800x600.jpg",
  Kalamkari: "/assets/generated/kalamkari-art.dim_800x600.jpg",
};

const LESSONS = [
  {
    id: 1,
    title: "Introduction & Cultural Context",
    duration: "12 min",
    done: true,
  },
  {
    id: 2,
    title: "Tools & Materials — The Sacred Inventory",
    duration: "18 min",
    done: true,
  },
  {
    id: 3,
    title: "Foundation Patterns — The Geometry of Tradition",
    duration: "25 min",
    done: false,
  },
  {
    id: 4,
    title: "First Motif — The Dairy Temple",
    duration: "32 min",
    done: false,
  },
  {
    id: 5,
    title: "Colour Application — Natural Pigments",
    duration: "28 min",
    done: false,
  },
  { id: 6, title: "Advanced Composition", duration: "40 min", done: false },
  {
    id: 7,
    title: "Final Project — The Heritage Piece",
    duration: "60 min",
    done: false,
  },
];

const TIPS = [
  "Thread your needle with the direction of the weave, not against it — the Toda believe each thread has memory.",
  "Work in natural light when possible. The Nilgiri mist and your home light create different depths of colour.",
  "Each motif is a prayer. Work with intention, not speed.",
];

export default function LearnPage() {
  const { courseId } = useParams({ from: "/protected/learn/$courseId" });
  const { data: courses = [] } = useGetAllCourses();
  const [activeLesson, setActiveLesson] = useState(3);
  const [currentTip] = useState(0);

  const course =
    courses.find((c) => c.id.toString() === courseId) ?? courses[0];
  const artImg = course
    ? (ART_IMAGES[course.artType] ?? ART_IMAGES["Toda Embroidery"])
    : ART_IMAGES["Toda Embroidery"];
  const completedCount = LESSONS.filter((l) => l.done).length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        {/* Course Header */}
        <div
          className="border-b border-gray-100 px-6 py-5"
          style={{ background: "oklch(0.99 0.005 80)" }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase text-charcoal/40">
                Now Learning
              </p>
              <h1 className="font-display text-2xl font-semibold text-charcoal mt-1">
                {course?.title ?? "Toda Embroidery"}
              </h1>
            </div>
            <div className="flex items-center gap-6 text-xs text-charcoal/50">
              <div className="flex items-center gap-1.5">
                <BookOpen size={13} />
                {LESSONS.length} lessons
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle
                  size={13}
                  style={{ color: "oklch(0.60 0.12 185)" }}
                />
                {completedCount} complete
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Left: Video + Tips */}
            <div>
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-craft group cursor-pointer"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={artImg}
                  alt={course?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform">
                    <Play size={22} className="text-charcoal ml-1" />
                  </div>
                </div>

                {/* Lesson title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white/70 text-xs mb-1">
                    Lesson {activeLesson} of {LESSONS.length}
                  </p>
                  <p className="text-white font-display text-lg">
                    {LESSONS[activeLesson - 1]?.title}
                  </p>
                </div>

                {/* Duration badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                  <Clock size={11} />
                  {LESSONS[activeLesson - 1]?.duration}
                </div>
              </motion.div>

              {/* Master's Tips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 rounded-xl p-6"
                style={{
                  background: "oklch(0.97 0.02 165 / 0.4)",
                  border: "1px solid oklch(0.90 0.04 165 / 0.5)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb
                    size={16}
                    style={{ color: "oklch(0.55 0.15 145)" }}
                  />
                  <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "oklch(0.45 0.12 145)" }}
                  >
                    Master's Tips
                  </p>
                </div>
                <p className="font-display text-base italic text-charcoal/75 leading-relaxed">
                  "{TIPS[currentTip]}"
                </p>
                <p className="text-xs text-charcoal/40 mt-3">
                  — {course?.mentorName ?? "Devaki Amma"},{" "}
                  {course?.artType ?? "Toda Embroidery"} Master
                </p>
              </motion.div>
            </div>

            {/* Right: Lesson Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-gray-100 overflow-hidden"
              style={{ background: "oklch(0.975 0.005 80)" }}
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-white">
                <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                  Course Syllabus
                </p>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(completedCount / LESSONS.length) * 100}%`,
                      background: "oklch(0.60 0.12 185)",
                    }}
                  />
                </div>
                <p className="text-xs text-charcoal/40 mt-1.5">
                  {completedCount} / {LESSONS.length} lessons
                </p>
              </div>

              <div className="py-2">
                {LESSONS.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLesson(lesson.id)}
                    className={[
                      "w-full text-left flex items-start gap-3 px-5 py-3.5 transition-colors",
                      activeLesson === lesson.id
                        ? "bg-white border-r-2 border-teal"
                        : "hover:bg-white/70",
                    ].join(" ")}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {lesson.done ? (
                        <CheckCircle
                          size={16}
                          style={{ color: "oklch(0.60 0.12 185)" }}
                        />
                      ) : (
                        <Circle
                          size={16}
                          className={
                            activeLesson === lesson.id
                              ? "text-teal"
                              : "text-charcoal/25"
                          }
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          activeLesson === lesson.id
                            ? "font-semibold text-charcoal"
                            : lesson.done
                              ? "text-charcoal/60"
                              : "text-charcoal/70"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-charcoal/35 mt-0.5">
                        {lesson.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
