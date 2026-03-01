import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSaveUserProfile } from "../hooks/useQueries";

const REGIONS = [
  {
    id: "nilgiris",
    name: "Nilgiris",
    artForm: "Toda Embroidery",
    description: "Sacred geometric patterns from the Nilgiri hills",
    color: "oklch(0.60 0.12 185)",
    accent: "oklch(0.92 0.05 185)",
  },
  {
    id: "mithila",
    name: "Mithila",
    artForm: "Madhubani Painting",
    description: "Mythological narratives in vivid folk tradition",
    color: "oklch(0.65 0.12 85)",
    accent: "oklch(0.92 0.07 85)",
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    artForm: "Block Print & Phulkari",
    description: "Desert motifs carved into wood and woven in silk",
    color: "oklch(0.60 0.15 50)",
    accent: "oklch(0.94 0.05 50)",
  },
  {
    id: "bengal",
    name: "Bengal",
    artForm: "Kantha Stitch",
    description: "Whispered stories stitched into old saris",
    color: "oklch(0.55 0.15 145)",
    accent: "oklch(0.92 0.06 145)",
  },
  {
    id: "kerala",
    name: "Kerala",
    artForm: "Mural & Kasavu",
    description: "Temple murals and golden-bordered weaves",
    color: "oklch(0.62 0.14 165)",
    accent: "oklch(0.92 0.05 165)",
  },
  {
    id: "kashmir",
    name: "Kashmir",
    artForm: "Pashmina Weaving",
    description: "Gossamer wool from the Himalayas' finest fleece",
    color: "oklch(0.58 0.12 280)",
    accent: "oklch(0.93 0.05 280)",
  },
];

export default function HeritagePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const saveProfile = useSaveUserProfile();

  const handleSelect = async (regionId: string) => {
    setSelected(regionId);
    setIsLoading(true);
    const region = REGIONS.find((r) => r.id === regionId);
    try {
      await saveProfile.mutateAsync({
        region: regionId,
        name: region?.name ?? regionId,
      });
    } catch {
      // continue even if save fails
    }
    setIsLoading(false);
    await navigate({ to: "/home" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="py-16 text-center border-b border-gray-100"
        style={{ background: "oklch(0.99 0.005 80)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-16 bg-gray-200" />
            <span className="text-xs tracking-widest uppercase text-charcoal/40">
              Choosen Kids
            </span>
            <div className="h-px w-16 bg-gray-200" />
          </div>
          <h1
            className="font-display text-4xl md:text-5xl font-semibold tracking-tight"
            style={{ color: "oklch(0.18 0.01 260)" }}
          >
            Choose Your Heritage
          </h1>
          <p className="mt-4 text-base text-charcoal/55 max-w-md mx-auto leading-relaxed">
            Select the region whose art tradition you wish to master
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-craft">
              <img
                src="/assets/generated/india-heritage-map.dim_900x1000.jpg"
                alt="India Heritage Map"
                className="w-full h-auto object-cover"
              />
              {/* Overlay hotspots */}
              <div className="absolute inset-0">
                {/* Nilgiris */}
                <button
                  type="button"
                  onClick={() => handleSelect("nilgiris")}
                  className={`absolute map-pulse rounded-full w-4 h-4 transition-transform hover:scale-125 ${selected === "nilgiris" ? "scale-125" : ""}`}
                  style={{
                    bottom: "22%",
                    left: "30%",
                    background: "oklch(0.60 0.12 185)",
                    boxShadow: "0 0 0 4px oklch(0.60 0.12 185 / 0.2)",
                  }}
                  title="Nilgiris – Toda Embroidery"
                />
                {/* Mithila */}
                <button
                  type="button"
                  onClick={() => handleSelect("mithila")}
                  className={`absolute map-pulse rounded-full w-4 h-4 transition-transform hover:scale-125 ${selected === "mithila" ? "scale-125" : ""}`}
                  style={{
                    top: "32%",
                    left: "55%",
                    background: "oklch(0.65 0.12 85)",
                    boxShadow: "0 0 0 4px oklch(0.65 0.12 85 / 0.2)",
                  }}
                  title="Mithila – Madhubani"
                />
                {/* Rajasthan */}
                <button
                  type="button"
                  onClick={() => handleSelect("rajasthan")}
                  className={`absolute map-pulse rounded-full w-4 h-4 transition-transform hover:scale-125 ${selected === "rajasthan" ? "scale-125" : ""}`}
                  style={{
                    top: "38%",
                    left: "25%",
                    background: "oklch(0.60 0.15 50)",
                    boxShadow: "0 0 0 4px oklch(0.60 0.15 50 / 0.2)",
                  }}
                  title="Rajasthan – Block Print"
                />
                {/* Bengal */}
                <button
                  type="button"
                  onClick={() => handleSelect("bengal")}
                  className={`absolute map-pulse rounded-full w-4 h-4 transition-transform hover:scale-125 ${selected === "bengal" ? "scale-125" : ""}`}
                  style={{
                    top: "36%",
                    left: "65%",
                    background: "oklch(0.55 0.15 145)",
                    boxShadow: "0 0 0 4px oklch(0.55 0.15 145 / 0.2)",
                  }}
                  title="Bengal – Kantha"
                />
                {/* Kerala */}
                <button
                  type="button"
                  onClick={() => handleSelect("kerala")}
                  className={`absolute map-pulse rounded-full w-4 h-4 transition-transform hover:scale-125 ${selected === "kerala" ? "scale-125" : ""}`}
                  style={{
                    bottom: "15%",
                    left: "26%",
                    background: "oklch(0.62 0.14 165)",
                    boxShadow: "0 0 0 4px oklch(0.62 0.14 165 / 0.2)",
                  }}
                  title="Kerala – Kasavu"
                />
                {/* Kashmir */}
                <button
                  type="button"
                  onClick={() => handleSelect("kashmir")}
                  className={`absolute map-pulse rounded-full w-4 h-4 transition-transform hover:scale-125 ${selected === "kashmir" ? "scale-125" : ""}`}
                  style={{
                    top: "10%",
                    left: "30%",
                    background: "oklch(0.58 0.12 280)",
                    boxShadow: "0 0 0 4px oklch(0.58 0.12 280 / 0.2)",
                  }}
                  title="Kashmir – Pashmina"
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-center text-charcoal/35 tracking-wide">
              Tap a dot on the map or choose below
            </p>
          </motion.div>

          {/* Region Cards */}
          <div className="space-y-3">
            <AnimatePresence>
              {REGIONS.map((region, i) => (
                <motion.button
                  key={region.id}
                  type="button"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  onClick={() => handleSelect(region.id)}
                  disabled={isLoading}
                  className={[
                    "w-full text-left p-5 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                    selected === region.id
                      ? "border-transparent shadow-craft"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-craft bg-white",
                  ].join(" ")}
                  style={
                    selected === region.id
                      ? { background: region.accent, borderColor: region.color }
                      : {}
                  }
                >
                  {/* Ethnic border pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, ${region.color}08, ${region.color}08 1px, transparent 1px, transparent 12px)`,
                    }}
                  />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: region.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-charcoal">
                            {region.name}
                          </span>
                          <MapPin size={12} className="text-charcoal/30" />
                        </div>
                        <p className="text-xs text-charcoal/55 font-medium mt-0.5">
                          {region.artForm}
                        </p>
                        <p className="text-xs text-charcoal/40 mt-1">
                          {region.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-charcoal/20 group-hover:text-charcoal/60 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
