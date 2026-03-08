import {
  Award,
  BookMarked,
  BookOpen,
  Download,
  Printer,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

// ── Print styles injected once ────────────────────────────────────────────────
const PRINT_STYLES = `
  @media print {
    .no-print { display: none !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page-break { page-break-before: always; }
    .avoid-break { page-break-inside: avoid; }
    @page { margin: 1.5cm; size: A4; }
  }
`;

// ── Course data ───────────────────────────────────────────────────────────────
interface CatalogueCourse {
  title: string;
  mentor: string;
  price: string;
  image: string;
  description: string;
}

const RAJASTHAN_COURSES: CatalogueCourse[] = [
  {
    title: "Pichwai Painting of Rajasthan",
    mentor: "Shri Dinesh Soni — Nathdwara, 38 years",
    price: "₹3,499",
    image: "/assets/generated/rajasthan-pichwai-painting.dim_800x600.jpg",
    description:
      "Sacred devotional art depicting Lord Krishna with lotus flowers and cows, using natural pigments on cloth.",
  },
  {
    title: "Jaipur Blue Pottery Craft",
    mentor: "Ustaad Raza Khan — Jaipur, 25 years",
    price: "₹2,999",
    image: "/assets/generated/rajasthan-blue-pottery.dim_800x600.jpg",
    description:
      "Persian-influenced hand-painted floral motifs on quartz-clay ceramics with cobalt and turquoise pigments.",
  },
  {
    title: "Phad Scroll Painting",
    mentor: "Shri Prakash Joshi — Bhilwara, 32 years",
    price: "₹2,799",
    image: "/assets/generated/rajasthan-phad-painting.dim_800x600.jpg",
    description:
      "Ancient horizontal scroll paintings narrating epic tales of Pabuji using earthy vegetable pigments on hand-spun cloth.",
  },
  {
    title: "Bandhani Tie-Dye Textile Art",
    mentor: "Farida Khatoon — Jodhpur, 28 years",
    price: "₹2,499",
    image: "/assets/generated/rajasthan-bandhani-art.dim_800x600.jpg",
    description:
      "Vibrant geometric dot patterns on silk and cotton using resist tie-dye with natural dyes.",
  },
];

const KERALA_COURSES: CatalogueCourse[] = [
  {
    title: "Kerala Mural Painting",
    mentor: "Krishnan Nair — Thrissur, 40 years",
    price: "₹2,999",
    image: "/assets/generated/kerala-mural-painting.dim_800x600.jpg",
    description:
      "Ancient Chitra Kala temple mural tradition with sacred geometry, natural pigments, and divine iconography.",
  },
  {
    title: "Theyyam Mask & Costume Craft",
    mentor: "Rajan Perumal — Kannur, master artist",
    price: "₹3,499",
    image: "/assets/generated/theyyam-mask-craft.dim_800x600.jpg",
    description:
      "Sacred Theyyam masks and costumes worn in North Kerala's divine rituals — papier-mâché, natural dyes, mirror-work.",
  },
  {
    title: "Aranmula Kannadi",
    mentor: "Devaki Varma — Pathanamthitta, 4th generation",
    price: "₹3,999",
    image: "/assets/generated/aranmula-kannadi.dim_800x600.jpg",
    description:
      "Legendary Aranmula metal mirror — an ancient alloy of copper and tin polished to perfection as a sacred temple offering.",
  },
  {
    title: "Kalaripayattu Body Art",
    mentor: "Gopalan Nambiar — Chief Gurukkal, Thiruvananthapuram",
    price: "₹2,499",
    image: "/assets/generated/kalaripayattu-art.dim_800x600.jpg",
    description:
      "Ritualistic body painting and symbolic costume art from Kerala's ancient martial art tradition.",
  },
];

const ORIGINAL_COURSES: CatalogueCourse[] = [
  {
    title: "Toda Embroidery",
    mentor: "Devaki Amma — Nilgiris, 38 years",
    price: "₹3,499",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
    description:
      "Ancient geometric embroidery of the Toda tribe — one of India's most endangered textile traditions.",
  },
  {
    title: "Madhubani Painting",
    mentor: "Ramesh Babu — Mithila, 42 years",
    price: "₹2,999",
    image: "/assets/generated/madhubani-painting.dim_800x600.jpg",
    description:
      "Vibrant storytelling tradition of Mithila — paintings that speak of gods, nature, and cosmic rhythms.",
  },
  {
    title: "Warli Folk Art",
    mentor: "Sunita Warli — Maharashtra community elder",
    price: "₹1,999",
    image: "/assets/generated/warli-art.dim_800x600.jpg",
    description:
      "Minimalist tribal geometry of the Warli people — white on earthy terracotta, stories of harvest and life.",
  },
  {
    title: "Sacred Mandala",
    mentor: "Anand Sharma — Pan-India, spiritual artist",
    price: "₹2,499",
    image: "/assets/generated/mandala-art.dim_800x600.jpg",
    description:
      "Intricate mandalas using traditional pigment and gold leaf techniques rooted in Tantric geometry.",
  },
  {
    title: "Kalamkari Chronicles",
    mentor: "Lakshmi Devi — Srikalahasti, 4th generation",
    price: "₹3,199",
    image: "/assets/generated/kalamkari-art.dim_800x600.jpg",
    description:
      "Ancient pen-and-brush art of Andhra — natural dyes, mythological narratives, centuries of unbroken tradition.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function CourseMiniCard({ course }: { course: CatalogueCourse }) {
  return (
    <div
      className="avoid-break rounded-xl overflow-hidden border border-gray-100 bg-white"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="font-display text-sm font-semibold text-charcoal leading-snug">
          {course.title}
        </p>
        <p className="text-[10px] text-charcoal/45 mt-1 leading-relaxed line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <p className="text-[10px] text-charcoal/50 leading-snug max-w-[70%]">
            {course.mentor}
          </p>
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.48 0.12 60)" }}
          >
            {course.price}
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  accent,
}: {
  label: string;
  title: string;
  accent: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">
        {label}
      </p>
      <h2
        className="font-display text-2xl font-semibold text-charcoal"
        style={{ borderLeft: `4px solid ${accent}`, paddingLeft: 12 }}
      >
        {title}
      </h2>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CataloguePage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <style>{PRINT_STYLES}</style>

      {/* ── Print button ── */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} style={{ color: "oklch(0.48 0.12 60)" }} />
          <span className="text-sm font-semibold text-charcoal">
            Choosen Kids Catalogue 2026
          </span>
        </div>
        <button
          type="button"
          data-ocid="catalogue.primary_button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "oklch(0.48 0.12 60)" }}
        >
          <Printer size={15} />
          Print / Save as PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* ── Cover / Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="avoid-break text-center mb-16 pb-12 border-b-2 border-charcoal/10"
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4"
              style={{ borderColor: "oklch(0.65 0.12 60)" }}
            >
              <img
                src="/assets/generated/choosen-kids-logo-seal-v2.dim_400x400.png"
                alt="Choosen Kids Seal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1
            className="font-display text-5xl font-semibold tracking-tight mb-3"
            style={{ color: "oklch(0.18 0.01 260)" }}
          >
            Choosen Kids
          </h1>
          <p
            className="text-lg italic font-normal mb-2"
            style={{ color: "oklch(0.55 0.12 185)" }}
          >
            Preserve. Create. Earn.
          </p>
          <p
            className="text-sm tracking-widest uppercase font-medium"
            style={{ color: "oklch(0.55 0.04 260)" }}
          >
            2026 Heritage Arts Catalogue
          </p>
          <div
            className="mt-6 mx-auto h-px w-24"
            style={{ background: "oklch(0.65 0.12 60)" }}
          />
        </motion.header>

        {/* ── Section 1: About ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="avoid-break mb-14"
        >
          <SectionHeading
            label="Our Mission"
            title="About Choosen Kids"
            accent="oklch(0.55 0.12 185)"
          />
          <p className="text-base text-charcoal/65 leading-relaxed mb-8 font-sans">
            Choosen Kids bridges India's dying art traditions with the next
            generation of creators. By pairing young students with master
            artisans, we preserve cultural heritage while creating real economic
            opportunity — through courses, physical starter kits, and a global
            brand licensing programme that puts royalties directly into the
            hands of young artists and NGOs.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: <BookMarked size={20} />,
                n: "47+",
                label: "Arts Preserved",
                color: "oklch(0.55 0.12 185)",
              },
              {
                icon: <Users size={20} />,
                n: "120+",
                label: "Master Artisans",
                color: "oklch(0.48 0.12 60)",
              },
              {
                icon: <Award size={20} />,
                n: "8,200+",
                label: "Students Trained",
                color: "oklch(0.45 0.15 30)",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-6 text-center avoid-break"
                style={{ background: "oklch(0.98 0.008 80)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{
                    background: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <p
                  className="font-display text-3xl font-semibold"
                  style={{ color: stat.color }}
                >
                  {stat.n}
                </p>
                <p className="text-xs text-charcoal/45 mt-1 tracking-wide font-sans">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Section 2: Rajasthan Death-End Arts ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 page-break"
        >
          <SectionHeading
            label="Featured Region"
            title="Rajasthan — Where Every Craft Tells an Epic"
            accent="oklch(0.65 0.12 60)"
          />
          <p className="text-sm text-charcoal/55 leading-relaxed mb-6 font-sans">
            Rajasthan's art traditions are among India's most visually
            spectacular — and most endangered. From the sacred Pichwai paintings
            of Nathdwara to the vibrant Bandhani textiles of Jodhpur, these four
            courses immerse students in living traditions maintained by some of
            Rajasthan's last hereditary masters.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {RAJASTHAN_COURSES.map((course) => (
              <CourseMiniCard key={course.title} course={course} />
            ))}
          </div>
        </motion.section>

        {/* ── Section 3: Kerala Heritage Arts ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 page-break"
        >
          <SectionHeading
            label="Heritage Region"
            title="Kerala — Divine Art, Living Ritual"
            accent="oklch(0.55 0.12 185)"
          />
          <p className="text-sm text-charcoal/55 leading-relaxed mb-6 font-sans">
            Kerala's art forms are inseparable from its temple culture and
            ritual life. From the magnificent Chitra Kala murals to the
            one-of-a-kind Aranmula metal mirrors, these traditions have survived
            millennia and are now in the hands of a precious few masters.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {KERALA_COURSES.map((course) => (
              <CourseMiniCard key={course.title} course={course} />
            ))}
          </div>
        </motion.section>

        {/* ── Section 4: Original Dying Arts ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 page-break"
        >
          <SectionHeading
            label="Founding Curriculum"
            title="The Original Dying Arts"
            accent="oklch(0.45 0.15 30)"
          />
          <p className="text-sm text-charcoal/55 leading-relaxed mb-6 font-sans">
            Our founding five courses — each one preserved by a single living
            master. From the sacred Toda geometry of the Nilgiris to the
            mythological Kalamkari scrolls of Andhra Pradesh, these courses are
            the soul of Choosen Kids.
          </p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {ORIGINAL_COURSES.map((course) => (
              <CourseMiniCard key={course.title} course={course} />
            ))}
          </div>
        </motion.section>

        {/* ── Section 5: Brand Licensing ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="avoid-break mb-14 page-break"
        >
          <SectionHeading
            label="For Brand Partners"
            title="Brand Licensing Programme"
            accent="oklch(0.25 0.02 260)"
          />
          <p className="text-sm text-charcoal/55 leading-relaxed mb-8 font-sans">
            License authentic, AI-verified student artwork for luxury products,
            textiles, and digital applications. Every motif carries a cultural
            certificate and supports its young creator directly. Our transparent
            revenue-sharing model ensures every stakeholder benefits.
          </p>

          {/* Revenue split visualization */}
          <div
            className="rounded-2xl p-7 mb-6"
            style={{ background: "oklch(0.98 0.008 80)" }}
          >
            <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-5 text-center font-sans">
              Revenue Distribution Per Licensed Motif
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  pct: "50%",
                  label: "Choosen Kids",
                  sub: "Platform & operations",
                  bg: "oklch(0.97 0.01 260)",
                  accent: "oklch(0.25 0.02 260)",
                  bar: "oklch(0.40 0.05 260)",
                },
                {
                  pct: "25%",
                  label: "Student Creators",
                  sub: "Direct royalties to kids",
                  bg: "oklch(0.94 0.06 185)",
                  accent: "oklch(0.38 0.14 185)",
                  bar: "oklch(0.55 0.15 185)",
                },
                {
                  pct: "25%",
                  label: "NGO Partners",
                  sub: "Community impact fund",
                  bg: "oklch(0.96 0.04 60)",
                  accent: "oklch(0.45 0.10 60)",
                  bar: "oklch(0.65 0.12 60)",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-5 text-center avoid-break"
                  style={{ background: item.bg }}
                >
                  <p
                    className="font-display text-4xl font-bold"
                    style={{ color: item.accent }}
                  >
                    {item.pct}
                  </p>
                  <div
                    className="h-1 rounded-full mt-2 mb-2 mx-auto w-10"
                    style={{ background: item.bar }}
                  />
                  <p
                    className="text-xs font-semibold tracking-wide uppercase font-sans"
                    style={{ color: item.accent }}
                  >
                    {item.label}
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-1 font-sans">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Partnership details */}
          <div
            className="rounded-xl p-5 border border-gray-100"
            style={{ background: "white" }}
          >
            <div className="grid sm:grid-cols-2 gap-4 font-sans">
              <div>
                <p className="text-xs font-semibold text-charcoal mb-2 tracking-wide uppercase">
                  What partners receive
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Exclusive or shared licensing rights",
                    "Cultural authenticity certificate",
                    "High-resolution vector & raster files",
                    "Artist profile & provenance document",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-charcoal/60"
                    >
                      <span
                        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "oklch(0.55 0.12 185)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal mb-2 tracking-wide uppercase">
                  Eligible applications
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Luxury fashion & textiles",
                    "Home décor & wallpaper",
                    "Stationery & packaging",
                    "Digital products & NFTs",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-charcoal/60"
                    >
                      <span
                        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "oklch(0.65 0.12 60)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Section 6: Contact & Footer ── */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="avoid-break pt-12 border-t-2 border-charcoal/10 text-center"
        >
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-2"
              style={{ borderColor: "oklch(0.65 0.12 60)" }}
            >
              <img
                src="/assets/generated/choosen-kids-logo-seal-v2.dim_400x400.png"
                alt="Choosen Kids"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h3
            className="font-display text-xl font-semibold mb-1"
            style={{ color: "oklch(0.18 0.01 260)" }}
          >
            Choosen Kids
          </h3>
          <p
            className="text-sm italic mb-6"
            style={{ color: "oklch(0.55 0.12 185)" }}
          >
            "Preserving India's dying arts, one child at a time."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 font-sans">
            {[
              { icon: <Download size={14} />, text: "contact@choosenkids.in" },
              { icon: <BookOpen size={14} />, text: "www.choosenkids.in" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-sm text-charcoal/60"
              >
                <span style={{ color: "oklch(0.55 0.12 185)" }}>
                  {item.icon}
                </span>
                {item.text}
              </div>
            ))}
          </div>

          {/* Print CTA */}
          <div className="no-print mt-6">
            <button
              type="button"
              data-ocid="catalogue.submit_button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "oklch(0.18 0.01 260)" }}
            >
              <Printer size={16} />
              Save as PDF
            </button>
          </div>

          <p className="text-[10px] text-charcoal/25 mt-8 font-sans">
            © {new Date().getFullYear()} Choosen Kids. All rights reserved. ·
            Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal/50 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
