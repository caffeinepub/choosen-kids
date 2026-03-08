import {
  Award,
  BookOpen,
  Download,
  Palette,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/Footer";
import { useGetVerifiedArtworks } from "../hooks/useQueries";

interface MockArtwork {
  id: bigint;
  title: string;
  artist: string;
  artType: string;
  category: string;
  region: string;
  status: "Available" | "Licensed";
  image: string;
}

// Mock artworks for display when backend returns empty
const MOCK_ARTWORKS: MockArtwork[] = [
  {
    id: 1n,
    title: "Sacred Triangle Sequence",
    artist: "Priya Nilgiris, Age 14",
    artType: "Toda Embroidery",
    category: "Embroidery",
    region: "Nilgiris",
    status: "Available",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
  },
  {
    id: 2n,
    title: "Krishna Leela Panorama",
    artist: "Ananya Darbhanga, Age 16",
    artType: "Madhubani",
    category: "Painting",
    region: "Mithila",
    status: "Licensed",
    image: "/assets/generated/madhubani-painting.dim_800x600.jpg",
  },
  {
    id: 3n,
    title: "Harvest Festival Warli",
    artist: "Ravi Maharashtra, Age 13",
    artType: "Warli",
    category: "Painting",
    region: "Maharashtra",
    status: "Available",
    image: "/assets/generated/warli-art.dim_800x600.jpg",
  },
  {
    id: 4n,
    title: "Cosmic Mandala No. 7",
    artist: "Deepa Jaipur, Age 15",
    artType: "Mandala",
    category: "Painting",
    region: "Rajasthan",
    status: "Available",
    image: "/assets/generated/mandala-art.dim_800x600.jpg",
  },
  {
    id: 5n,
    title: "Shiva's River — Kalamkari",
    artist: "Vikram Srikalahasti, Age 17",
    artType: "Kalamkari",
    category: "Painting",
    region: "Andhra",
    status: "Licensed",
    image: "/assets/generated/kalamkari-art.dim_800x600.jpg",
  },
  {
    id: 6n,
    title: "Nilgiri Dawn Embroidery",
    artist: "Sita Ooty, Age 12",
    artType: "Toda Embroidery",
    category: "Embroidery",
    region: "Nilgiris",
    status: "Available",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
  },
  {
    id: 7n,
    title: "Pichwai Krishna Leela",
    artist: "Arjun Nathdwara, Age 15",
    artType: "Pichwai Painting",
    category: "Painting",
    region: "Rajasthan",
    status: "Available",
    image: "/assets/generated/rajasthan-pichwai-painting.dim_800x600.jpg",
  },
  {
    id: 8n,
    title: "Jaipur Blue Floral Panel",
    artist: "Zainab Jaipur, Age 13",
    artType: "Blue Pottery",
    category: "Craft",
    region: "Rajasthan",
    status: "Licensed",
    image: "/assets/generated/rajasthan-blue-pottery.dim_800x600.jpg",
  },
  {
    id: 9n,
    title: "Pabuji Epic Scroll",
    artist: "Vikram Bhilwara, Age 16",
    artType: "Phad Painting",
    category: "Painting",
    region: "Rajasthan",
    status: "Available",
    image: "/assets/generated/rajasthan-phad-painting.dim_800x600.jpg",
  },
  {
    id: 10n,
    title: "Bandhani Sunrise Textile",
    artist: "Priya Jodhpur, Age 14",
    artType: "Bandhani",
    category: "Textile",
    region: "Rajasthan",
    status: "Available",
    image: "/assets/generated/rajasthan-bandhani-art.dim_800x600.jpg",
  },
  {
    id: 11n,
    title: "Mughal Court Miniature",
    artist: "Rahul Udaipur, Age 17",
    artType: "Miniature Painting",
    category: "Painting",
    region: "Rajasthan",
    status: "Available",
    image: "/assets/generated/rajasthan-miniature-painting.dim_800x600.jpg",
  },
  {
    id: 12n,
    title: "Meenakari Gold Medallion",
    artist: "Sana Jaipur, Age 15",
    artType: "Meenakari",
    category: "Jewellery",
    region: "Rajasthan",
    status: "Licensed",
    image: "/assets/generated/rajasthan-meenakari-art.dim_800x600.jpg",
  },
  {
    id: 13n,
    title: "Leheriya Wave Weave",
    artist: "Deepika Udaipur, Age 13",
    artType: "Leheriya",
    category: "Textile",
    region: "Rajasthan",
    status: "Available",
    image: "/assets/generated/rajasthan-leheriya-textile.dim_800x600.jpg",
  },
  {
    id: 14n,
    title: "Bengal Kantha Garden",
    artist: "Meera Kolkata, Age 16",
    artType: "Kantha Embroidery",
    category: "Embroidery",
    region: "Bengal",
    status: "Available",
    image: "/assets/generated/bengal-kantha-embroidery.dim_800x600.jpg",
  },
];

const STATS = [
  { n: "₹12.4L", label: "Royalties distributed to students" },
  { n: "86", label: "Brand partnerships active" },
  { n: "340+", label: "Motifs licensed this season" },
];

const BRAND_NAMES = [
  "Louis Vuitton",
  "Gucci",
  "Chanel",
  "Prada",
  "Dior",
  "Swat",
  "Artisana",
  "Celeste",
  "Aurum",
];

interface LicenseForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

interface SelectedArtwork {
  title: string;
  artist: string;
  artType: string;
}

const FILTER_OPTIONS = [
  "All",
  "Embroidery",
  "Painting",
  "Textile",
  "Jewellery",
  "Craft",
];

export default function PartnersPage() {
  useGetVerifiedArtworks();

  const [licenseOpen, setLicenseOpen] = useState(false);
  const [partnershipOpen, setPartnershipOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedArtwork, setSelectedArtwork] =
    useState<SelectedArtwork | null>(null);
  const [licenseForm, setLicenseForm] = useState<LicenseForm>({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const filteredArtworks =
    activeFilter === "All"
      ? MOCK_ARTWORKS
      : MOCK_ARTWORKS.filter((a) => a.category === activeFilter);

  function handleLicenseOpen(artwork: SelectedArtwork) {
    setSelectedArtwork(artwork);
    setLicenseOpen(true);
  }

  function handleLicenseSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLicenseOpen(false);
    setLicenseForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── License Enquiry Modal ── */}
      <AnimatePresence>
        {licenseOpen && (
          <motion.div
            key="license-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setLicenseOpen(false)}
          >
            <motion.div
              key="license-card"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full"
              style={{ maxWidth: 420, padding: "28px 32px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setLicenseOpen(false)}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-5">
                <p className="text-[10px] tracking-widest uppercase text-charcoal/40 mb-1">
                  Licensing Enquiry
                </p>
                <h3 className="font-display text-xl font-semibold text-charcoal leading-snug">
                  {selectedArtwork?.title ?? "License This Motif"}
                </h3>
                {selectedArtwork && (
                  <p className="text-xs text-charcoal/45 mt-0.5">
                    {selectedArtwork.artType} · {selectedArtwork.artist}
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleLicenseSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="lf-name"
                      className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1 block"
                    >
                      Full Name
                    </label>
                    <input
                      id="lf-name"
                      type="text"
                      required
                      value={licenseForm.name}
                      onChange={(e) =>
                        setLicenseForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lf-company"
                      className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1 block"
                    >
                      Company / Brand
                    </label>
                    <input
                      id="lf-company"
                      type="text"
                      required
                      value={licenseForm.company}
                      onChange={(e) =>
                        setLicenseForm((p) => ({
                          ...p,
                          company: e.target.value,
                        }))
                      }
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
                      placeholder="Brand name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="lf-email"
                      className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1 block"
                    >
                      Email
                    </label>
                    <input
                      id="lf-email"
                      type="email"
                      required
                      value={licenseForm.email}
                      onChange={(e) =>
                        setLicenseForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
                      placeholder="you@brand.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lf-phone"
                      className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1 block"
                    >
                      Phone
                    </label>
                    <input
                      id="lf-phone"
                      type="tel"
                      value={licenseForm.phone}
                      onChange={(e) =>
                        setLicenseForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lf-message"
                    className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1 block"
                  >
                    Licensing Intent
                  </label>
                  <textarea
                    id="lf-message"
                    rows={2}
                    value={licenseForm.message}
                    onChange={(e) =>
                      setLicenseForm((p) => ({
                        ...p,
                        message: e.target.value,
                      }))
                    }
                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal transition-colors resize-none"
                    placeholder="Describe how you'd like to use this motif…"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "oklch(0.60 0.12 185)" }}
                >
                  Submit Enquiry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Partnership Pitch Modal ── */}
      <AnimatePresence>
        {partnershipOpen && (
          <motion.div
            key="partnership-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setPartnershipOpen(false)}
          >
            <motion.div
              key="partnership-card"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full"
              style={{ maxWidth: 460, padding: "30px 32px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setPartnershipOpen(false)}
                className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <p className="text-[10px] tracking-widest uppercase text-charcoal/40 mb-1">
                  Revenue Sharing
                </p>
                <h3 className="font-display text-2xl font-semibold text-charcoal">
                  Partnership Revenue Model
                </h3>
                <p className="text-sm text-charcoal/50 mt-1.5">
                  Every licensed motif revenue is split as:
                </p>
              </div>

              {/* Revenue Split */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Choosen Kids */}
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "oklch(0.97 0.01 260)" }}
                >
                  <p
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.25 0.02 260)" }}
                  >
                    50%
                  </p>
                  <div
                    className="h-1 rounded-full mt-2 mb-2 mx-auto w-10"
                    style={{ background: "oklch(0.40 0.05 260)" }}
                  />
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/60 leading-tight">
                    Choosen Kids
                  </p>
                  <p className="text-[9px] text-charcoal/40 mt-0.5">Platform</p>
                </div>

                {/* Kids */}
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "oklch(0.94 0.06 185)" }}
                >
                  <p
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.38 0.14 185)" }}
                  >
                    25%
                  </p>
                  <div
                    className="h-1 rounded-full mt-2 mb-2 mx-auto w-10"
                    style={{ background: "oklch(0.55 0.15 185)" }}
                  />
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/60 leading-tight">
                    Kids
                  </p>
                  <p className="text-[9px] text-charcoal/40 mt-0.5">
                    Student creators
                  </p>
                </div>

                {/* NGOs */}
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "oklch(0.96 0.04 60)" }}
                >
                  <p
                    className="font-display text-3xl font-bold"
                    style={{ color: "oklch(0.45 0.10 60)" }}
                  >
                    25%
                  </p>
                  <div
                    className="h-1 rounded-full mt-2 mb-2 mx-auto w-10"
                    style={{ background: "oklch(0.65 0.12 60)" }}
                  />
                  <p className="text-[10px] uppercase tracking-widest text-charcoal/60 leading-tight">
                    NGO's
                  </p>
                  <p className="text-[9px] text-charcoal/40 mt-0.5">
                    Community impact
                  </p>
                </div>
              </div>

              {/* Tie-up brands marquee */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-3 text-center">
                  Tie-up Brands
                </p>
                <div className="overflow-hidden border border-gray-100 rounded-xl py-3 bg-gray-50">
                  <div className="animate-marquee">
                    {[...BRAND_NAMES, ...BRAND_NAMES].map((name, i) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: marquee duplicate list requires index
                        key={`${name}-${i}`}
                        className="mx-6 text-xs font-semibold tracking-widest uppercase whitespace-nowrap"
                        style={{ color: "oklch(0.35 0.02 260)" }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => setPartnershipOpen(false)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "oklch(0.18 0.01 260)" }}
              >
                Become a Partner
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden border-b border-gray-100">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, oklch(0.18 0.01 260), oklch(0.18 0.01 260) 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="max-w-5xl mx-auto relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-4">
              Brand Partnership Portal
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-charcoal leading-[1.1]">
              Where Heritage
              <br />
              <em
                className="italic font-normal"
                style={{ color: "oklch(0.60 0.12 185)" }}
              >
                Meets High Fashion
              </em>
            </h1>
            <p className="mt-6 text-base text-charcoal/55 max-w-xl mx-auto leading-relaxed">
              License authentic, AI-verified student artwork for your luxury
              products. Every motif carries a cultural certificate and supports
              its young creator directly.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => setPartnershipOpen(true)}
                className="px-8 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "oklch(0.18 0.01 260)" }}
              >
                Apply for Partnership
              </button>
              <button
                type="button"
                data-ocid="catalogue.primary_button"
                onClick={() => window.open("/catalogue", "_blank")}
                className="px-8 py-3.5 rounded-full text-sm font-medium text-charcoal border border-gray-200 hover:border-charcoal transition-all"
              >
                Download Catalogue
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center py-4 px-8"
              >
                <p className="font-display text-3xl font-semibold text-charcoal">
                  {stat.n}
                </p>
                <p className="text-xs text-charcoal/45 mt-1.5 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motif Library */}
      <section
        className="py-20 px-6"
        style={{ background: "oklch(0.99 0.005 80)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-3">
                Gallery
              </p>
              <h2 className="font-display text-4xl font-semibold text-charcoal">
                Motif Library
              </h2>
              <p className="text-sm text-charcoal/50 mt-2">
                {filteredArtworks.length} of {MOCK_ARTWORKS.length} verified
                artworks
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  data-ocid="motif.filter.tab"
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                    filter === activeFilter
                      ? "bg-charcoal text-white border-charcoal"
                      : "border-gray-200 text-charcoal/60 hover:border-charcoal/40"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid — compact mini-cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredArtworks.map((artwork, i) => (
              <motion.div
                key={artwork.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 36px rgba(0,0,0,0.12)",
                }}
                transition={{
                  opacity: { duration: 0.5, delay: i * 0.06 },
                  y: { type: "spring", stiffness: 300, damping: 22 },
                  boxShadow: { type: "spring", stiffness: 300, damping: 22 },
                }}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              >
                {/* Square image with badges */}
                <div className="relative overflow-hidden aspect-square w-full">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  {/* Art type badge — top left */}
                  <div className="absolute top-1.5 left-1.5">
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full font-semibold text-white leading-none"
                      style={{ background: "oklch(0.55 0.12 185 / 0.9)" }}
                    >
                      {artwork.artType}
                    </span>
                  </div>
                  {/* Status chip — top right */}
                  <div className="absolute top-1.5 right-1.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold leading-none ${
                        artwork.status === "Licensed"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {artwork.status}
                    </span>
                  </div>
                </div>

                {/* Compact card info */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-charcoal leading-snug line-clamp-1">
                    {artwork.title}
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-0.5 line-clamp-1">
                    {artwork.artist}
                  </p>
                  <p className="text-[10px] text-charcoal/40 mt-0.5 mb-2">
                    📍 {artwork.region}
                  </p>
                  <button
                    type="button"
                    data-ocid="motif.open_modal_button"
                    onClick={() =>
                      handleLicenseOpen({
                        title: artwork.title,
                        artist: artwork.artist,
                        artType: artwork.artType,
                      })
                    }
                    className="text-[10px] px-2.5 py-1.5 rounded-lg border border-charcoal/20 text-charcoal/60 hover:bg-charcoal hover:text-white hover:border-charcoal transition-all w-full font-medium"
                  >
                    License
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Catalogue Section */}
      <section
        className="py-16 px-6"
        style={{ background: "oklch(0.98 0.01 70)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border border-amber-100"
            style={{ background: "oklch(0.97 0.01 60)" }}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Info */}
              <div className="p-10 flex flex-col justify-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: "oklch(0.93 0.06 60)",
                    color: "oklch(0.48 0.12 60)",
                  }}
                >
                  <BookOpen size={22} />
                </div>
                <p className="text-[10px] tracking-widest uppercase text-charcoal/40 mb-2">
                  Official Publication
                </p>
                <h3 className="font-display text-2xl font-semibold text-charcoal leading-snug mb-2">
                  Choosen Kids Catalogue 2026
                </h3>
                <p className="text-sm text-charcoal/55 leading-relaxed mb-6">
                  Complete guide to our courses, artisan network, and brand
                  licensing programme.
                </p>
                <ul className="space-y-2 mb-8">
                  {[
                    "Rajasthan Death-End Arts — 4 new courses",
                    "Kerala Heritage Traditions",
                    "Master Artisan Profiles",
                    "Brand Licensing Guide & Revenue Model",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-charcoal/65"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "oklch(0.65 0.12 60)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-ocid="catalogue.open_modal_button"
                  onClick={() => window.open("/catalogue", "_blank")}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 w-fit"
                  style={{ background: "oklch(0.48 0.12 60)" }}
                >
                  <Download size={15} />
                  Open Catalogue
                </button>
              </div>

              {/* Right: Catalogue cover mockup */}
              <div
                className="relative flex items-center justify-center p-10"
                style={{ background: "oklch(0.94 0.03 60)" }}
              >
                {/* Book shadow */}
                <div
                  className="relative"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.18))",
                  }}
                >
                  {/* Catalogue cover */}
                  <div
                    className="w-52 rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      background: "oklch(0.18 0.01 260)",
                      minHeight: 280,
                    }}
                  >
                    {/* Cover header */}
                    <div
                      className="px-5 pt-6 pb-4"
                      style={{
                        borderBottom: "1px solid oklch(0.35 0.02 260)",
                      }}
                    >
                      <p
                        className="text-[8px] tracking-[0.25em] uppercase mb-2"
                        style={{ color: "oklch(0.65 0.12 60)" }}
                      >
                        Official Catalogue
                      </p>
                      <p
                        className="font-display text-sm font-semibold leading-snug"
                        style={{ color: "oklch(0.95 0.01 80)" }}
                      >
                        Choosen Kids
                      </p>
                      <p
                        className="text-[9px] mt-0.5"
                        style={{ color: "oklch(0.65 0.12 60)" }}
                      >
                        Heritage Arts 2026
                      </p>
                    </div>
                    {/* Seal */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <div
                        className="w-24 h-24 rounded-full overflow-hidden border-2 mb-3"
                        style={{ borderColor: "oklch(0.65 0.12 60)" }}
                      >
                        <img
                          src="/assets/generated/choosen-kids-logo-seal-v2.dim_400x400.png"
                          alt="Choosen Kids Seal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p
                        className="text-[8px] text-center tracking-widest uppercase"
                        style={{ color: "oklch(0.55 0.04 260)" }}
                      >
                        Preserve · Create · Earn
                      </p>
                    </div>
                    {/* Cover footer */}
                    <div
                      className="px-5 py-3"
                      style={{ background: "oklch(0.65 0.12 60)" }}
                    >
                      <p className="text-[8px] font-semibold tracking-widest uppercase text-white">
                        Brand Licensing Edition
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edition badge */}
                <div
                  className="absolute top-6 right-6 rounded-full px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase"
                  style={{
                    background: "oklch(0.65 0.12 60)",
                    color: "white",
                  }}
                >
                  2026
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mockup Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-4">
                Application Example
              </p>
              <h2 className="font-display text-4xl font-semibold text-charcoal leading-[1.1]">
                From Nilgiri Hills
                <br />
                to Luxury Leather
              </h2>
              <p className="mt-5 text-base text-charcoal/55 leading-relaxed">
                A student's Toda Embroidery motif, verified and licensed,
                applied to a designer leather bag. The student earned royalties;
                the brand earned authenticity. That is the Choosen Kids model.
              </p>

              <div className="space-y-4 mt-8">
                {[
                  {
                    icon: <Award size={14} />,
                    text: "Culturally certified motifs",
                  },
                  {
                    icon: <TrendingUp size={14} />,
                    text: "Student royalties on every sale",
                  },
                  {
                    icon: <Palette size={14} />,
                    text: "Exclusive licensing available",
                  },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "oklch(0.92 0.05 185)",
                        color: "oklch(0.60 0.12 185)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <p className="text-sm text-charcoal/70">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Product mockup */}
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-luxury">
                <img
                  src="/assets/generated/toda-embroidery.dim_800x600.jpg"
                  alt="Motif on designer bag"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-1">
                      Licensed Motif
                    </p>
                    <p className="text-sm font-semibold text-charcoal">
                      Toda Embroidery × Designer Leather Co.
                    </p>
                    <p className="text-xs text-charcoal/50 mt-1">
                      By Priya Nilgiris, Age 14 · ₹2,400 royalties earned
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Partners Logos Strip — scrolling marquee */}
      <section className="py-16 px-6 border-t border-gray-100 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <p className="text-xs tracking-widest uppercase text-charcoal/35">
            Trusted by the world's finest houses
          </p>
        </div>
        <div className="overflow-hidden">
          <div className="animate-marquee">
            {[
              "Louis Vuitton",
              "Gucci",
              "Chanel",
              "Prada",
              "Dior",
              "Swat",
              "Louis Vuitton",
              "Gucci",
              "Chanel",
              "Prada",
              "Dior",
              "Swat",
            ].map((brand, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: marquee duplicate list requires index
                key={`brand-${i}`}
                className="mx-10 text-sm font-semibold tracking-widest uppercase whitespace-nowrap transition-colors cursor-default"
                style={{ color: "oklch(0.50 0.03 260)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.color =
                    "oklch(0.18 0.01 260)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.color =
                    "oklch(0.50 0.03 260)";
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
