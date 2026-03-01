import { Award, ExternalLink, Palette, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";
import { useGetVerifiedArtworks } from "../hooks/useQueries";

// Mock artworks for display when backend returns empty
const MOCK_ARTWORKS = [
  {
    id: 1n,
    title: "Sacred Triangle Sequence",
    artist: "Priya Nilgiris, Age 14",
    artType: "Toda Embroidery",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
  },
  {
    id: 2n,
    title: "Krishna Leela Panorama",
    artist: "Ananya Darbhanga, Age 16",
    artType: "Madhubani",
    image: "/assets/generated/madhubani-painting.dim_800x600.jpg",
  },
  {
    id: 3n,
    title: "Harvest Festival Warli",
    artist: "Ravi Maharashtra, Age 13",
    artType: "Warli",
    image: "/assets/generated/warli-art.dim_800x600.jpg",
  },
  {
    id: 4n,
    title: "Cosmic Mandala No. 7",
    artist: "Deepa Jaipur, Age 15",
    artType: "Mandala",
    image: "/assets/generated/mandala-art.dim_800x600.jpg",
  },
  {
    id: 5n,
    title: "Shiva's River — Kalamkari",
    artist: "Vikram Srikalahasti, Age 17",
    artType: "Kalamkari",
    image: "/assets/generated/kalamkari-art.dim_800x600.jpg",
  },
  {
    id: 6n,
    title: "Nilgiri Dawn Embroidery",
    artist: "Sita Ooty, Age 12",
    artType: "Toda Embroidery",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
  },
];

const STATS = [
  { n: "₹12.4L", label: "Royalties distributed to students" },
  { n: "86", label: "Brand partnerships active" },
  { n: "340+", label: "Motifs licensed this season" },
];

export default function PartnersPage() {
  const { data: artworks = [] } = useGetVerifiedArtworks();
  const displayArtworks = artworks.length > 0 ? artworks : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
                className="px-8 py-3.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "oklch(0.18 0.01 260)" }}
              >
                Apply for Partnership
              </button>
              <button
                type="button"
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
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-3">
                Gallery
              </p>
              <h2 className="font-display text-4xl font-semibold text-charcoal">
                Motif Library
              </h2>
              <p className="text-sm text-charcoal/50 mt-2">
                {MOCK_ARTWORKS.length} verified artworks available for licensing
              </p>
            </div>
            <div className="flex items-center gap-2">
              {["All", "Embroidery", "Painting", "Weaving"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                    filter === "All"
                      ? "bg-charcoal text-white border-charcoal"
                      : "border-gray-200 text-charcoal/60 hover:border-charcoal/40"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_ARTWORKS.map((artwork, i) => (
              <motion.div
                key={artwork.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group"
              >
                {/* Gallery Frame */}
                <div className="gallery-frame rounded-sm bg-white">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={
                        displayArtworks
                          ? "/assets/generated/toda-embroidery.dim_800x600.jpg"
                          : artwork.image
                      }
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Artwork info */}
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-display font-semibold text-charcoal">
                      {artwork.title}
                    </p>
                    <p className="text-xs text-charcoal/45 mt-0.5">
                      {artwork.artist}
                    </p>
                    <p className="text-xs text-teal mt-0.5">
                      {artwork.artType}
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all"
                    >
                      <ExternalLink size={10} />
                      License
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

      {/* Brand Partners Logos Strip */}
      <section className="py-16 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase text-charcoal/35 mb-10">
            Trusted by the world's finest houses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              {
                src: "/assets/generated/brand-logo-lv-transparent.dim_300x80.png",
                alt: "Louis Vuitton",
              },
              {
                src: "/assets/generated/brand-logo-gucci-transparent.dim_300x80.png",
                alt: "Gucci",
              },
              {
                src: "/assets/generated/brand-logo-chanel-transparent.dim_300x80.png",
                alt: "Chanel",
              },
              {
                src: "/assets/generated/brand-logo-prada-transparent.dim_300x80.png",
                alt: "Prada",
              },
              {
                src: "/assets/generated/brand-logo-dior-transparent.dim_300x80.png",
                alt: "Dior",
              },
              {
                src: "/assets/generated/brand-logo-swat-transparent.dim_300x80.png",
                alt: "Swat",
              },
            ].map((brand) => (
              <motion.div
                key={brand.alt}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
              >
                <img
                  src={brand.src}
                  alt={brand.alt}
                  className="h-8 object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
