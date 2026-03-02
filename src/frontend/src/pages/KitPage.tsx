import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Clock, Package, Star } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";

const FEATURES = [
  {
    title: "Wooden Embroidery Frames",
    desc: "Hand-turned sal wood hoops, three sizes",
  },
  { title: "Organic Threads", desc: "36 natural dye colours, 100% cotton" },
  { title: "Premium Fabric", desc: "Unbleached muslin and silk base cloth" },
  { title: "Instruction Booklet", desc: "Illustrated guide in 5 languages" },
  {
    title: "Master's Personal Note",
    desc: "Handwritten welcome from your mentor",
  },
  {
    title: "Sketching Pencils",
    desc: "Traditional Indian chalk and carbon tools",
  },
];

const REVIEWS = [
  {
    name: "Meera R.",
    text: "The quality of threads is extraordinary — I've never seen such colour depth.",
    rating: 5,
  },
  {
    name: "Arjun S.",
    text: "My daughter opened this and cried happy tears. Truly special.",
    rating: 5,
  },
  {
    name: "Lakshmi P.",
    text: "The wooden frames smell of the forest. Every piece feels intentional.",
    rating: 5,
  },
];

export default function KitPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero — full bleed image */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src="/assets/generated/heritage-starter-kit.dim_1200x800.jpg"
          alt="Heritage Starter Kit"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />

        <div className="relative h-full flex items-center px-6 md:px-16 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-3">
              The Physical Companion
            </p>
            <h1
              className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]"
              style={{ color: "oklch(0.18 0.01 260)" }}
            >
              Heritage Starter Kit
            </h1>
            <p className="mt-4 text-base text-charcoal/60 leading-relaxed">
              Every course ships with the tools that artisans have used for
              centuries. Hold history in your hands.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <div
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: "oklch(0.92 0.08 165)",
                  color: "oklch(0.40 0.12 165)",
                }}
              >
                <Clock size={11} />
                Ships in 24 Hours
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12} className="text-gold fill-gold" />
                ))}
                <span className="text-xs text-charcoal/50 ml-1">4.9 (312)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-4">
              What's Inside
            </p>
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-8">
              Curated by Master Artisans
            </h2>

            <div className="space-y-4">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-cream transition-colors"
                >
                  <CheckCircle2
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "oklch(0.60 0.12 185)" }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal">
                      {feature.title}
                    </p>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Purchase Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="border border-gray-100 rounded-2xl p-8 shadow-craft sticky top-24">
              {/* Mockup — product styled as on a designer bag */}
              <div className="relative mb-6 rounded-xl overflow-hidden aspect-video">
                <img
                  src="/assets/generated/toda-embroidery.dim_800x600.jpg"
                  alt="Motif on product"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                    <p className="text-xs font-medium text-charcoal/70">
                      Heritage motif applied to luxury leather
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs text-charcoal/40 tracking-wide mb-1">
                    Base Kit Price
                  </p>
                  <p className="font-display text-4xl font-semibold text-charcoal">
                    ₹2,499
                  </p>
                  <p className="text-xs text-charcoal/40 mt-1">
                    + Free shipping across India
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{
                    background: "oklch(0.92 0.08 165)",
                    color: "oklch(0.40 0.12 165)",
                  }}
                >
                  <Package size={11} />
                  In Stock
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/checkout",
                    search: {
                      type: "kit",
                      courseId: "",
                      title: "Heritage Starter Kit",
                      price: "249900",
                    },
                  })
                }
                className="w-full py-4 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
                style={{ background: "oklch(0.65 0.12 85)" }}
              >
                Buy Now — ₹2,499
              </button>

              <button
                type="button"
                onClick={() => navigate({ to: "/home" })}
                className="w-full py-3.5 rounded-full text-sm font-medium text-charcoal border border-gray-200 hover:border-teal hover:text-teal transition-all flex items-center justify-center gap-2"
              >
                Bundle with a Course
                <ChevronRight size={14} />
              </button>

              <p className="text-xs text-charcoal/35 text-center mt-4">
                30-day satisfaction guarantee · Secure checkout
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews */}
      <section
        className="py-16 px-6"
        style={{ background: "oklch(0.98 0.008 80)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-charcoal/40 mb-3 text-center">
            Reviews
          </p>
          <h2 className="font-display text-3xl font-semibold text-charcoal text-center mb-10">
            What Families Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].slice(0, review.rating).map((s) => (
                    <Star key={s} size={12} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-charcoal/70 italic leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <p className="text-xs font-semibold text-charcoal">
                  {review.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
