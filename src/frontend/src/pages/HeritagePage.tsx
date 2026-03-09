import { useNavigate } from "@tanstack/react-router";
import { GripVertical, MapPin, Sparkles } from "lucide-react";
import { motion, useMotionValue } from "motion/react";
import { useRef, useState } from "react";
import { useSaveUserProfile } from "../hooks/useQueries";

const REGIONS = [
  {
    id: "nilgiris",
    name: "Nilgiris",
    artForm: "Toda Embroidery",
    description:
      "Sacred geometric patterns woven into prayers by the Toda tribe of the Nilgiri hills",
    color: "oklch(0.60 0.12 185)",
    colorRaw: "0.60 0.12 185",
    gradientTo: "oklch(0.45 0.14 195)",
    emoji: "🧵",
    pattern: "embroidery",
  },
  {
    id: "mithila",
    name: "Mithila",
    artForm: "Madhubani Painting",
    description:
      "Mythological narratives painted with rice paste — timeless folk tradition of Bihar",
    color: "oklch(0.65 0.15 75)",
    colorRaw: "0.65 0.15 75",
    gradientTo: "oklch(0.50 0.18 65)",
    emoji: "🎨",
    pattern: "painting",
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    artForm: "Block Print & Phulkari",
    description:
      "Desert motifs carved into teak wood blocks, stamped on silk with centuries of craft",
    color: "oklch(0.62 0.17 48)",
    colorRaw: "0.62 0.17 48",
    gradientTo: "oklch(0.46 0.20 38)",
    emoji: "🌅",
    pattern: "block",
  },
  {
    id: "bengal",
    name: "Bengal",
    artForm: "Kantha Stitch",
    description:
      "Whispered family stories lovingly stitched into layers of old saris by Bengali women",
    color: "oklch(0.55 0.15 145)",
    colorRaw: "0.55 0.15 145",
    gradientTo: "oklch(0.40 0.17 155)",
    emoji: "🪡",
    pattern: "stitch",
  },
  {
    id: "kerala",
    name: "Kerala",
    artForm: "Mural & Kasavu",
    description:
      "Ancient temple frescoes and luminous gold-bordered Kasavu weaves from God's Own Country",
    color: "oklch(0.58 0.16 162)",
    colorRaw: "0.58 0.16 162",
    gradientTo: "oklch(0.42 0.18 170)",
    emoji: "🏛️",
    pattern: "mural",
  },
  {
    id: "kashmir",
    name: "Kashmir",
    artForm: "Pashmina Weaving",
    description:
      "Gossamer-soft wool drawn from Himalayan Changthangi goats — the world's finest fleece",
    color: "oklch(0.55 0.14 278)",
    colorRaw: "0.55 0.14 278",
    gradientTo: "oklch(0.40 0.18 265)",
    emoji: "❄️",
    pattern: "pashmina",
  },
];

// SVG decorative mandala ring element
function MandalRing({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-full h-full"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="60"
        cy="60"
        r="52"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.6"
      />
      <circle
        cx="60"
        cy="60"
        r="40"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.4"
      />
      <circle
        cx="60"
        cy="60"
        r="28"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 60 + 30 * Math.cos(rad);
        const y1 = 60 + 30 * Math.sin(rad);
        const x2 = 60 + 50 * Math.cos(rad);
        const y2 = 60 + 50 * Math.sin(rad);
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 60 + 52 * Math.cos(rad);
        const cy = 60 + 52 * Math.sin(rad);
        return (
          <circle
            key={angle}
            cx={cx}
            cy={cy}
            r="3"
            fill={color}
            opacity="0.5"
          />
        );
      })}
    </svg>
  );
}

// Pre-computed grid positions to avoid array index keys
const EMBROIDERY_POSITIONS = Array.from({ length: 6 }, (_, row) =>
  Array.from({ length: 8 }, (_, col) => ({
    x: col * 40 + 10,
    y: row * 40 + 10,
    id: `e${col * 40 + 10}x${row * 40 + 10}`,
  })),
).flat();
const PAINTING_POSITIONS = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 6 }, (_, col) => ({
    cx: col * 50 + 25,
    cy: row * 50 + 25,
    id: `p${col * 50 + 25}x${row * 50 + 25}`,
  })),
).flat();
const BLOCK_POSITIONS = Array.from({ length: 4 }, (_, row) =>
  Array.from({ length: 5 }, (_, col) => ({
    x: col * 60 + 10,
    y: row * 60 + 10,
    id: `b${col * 60 + 10}x${row * 60 + 10}`,
  })),
).flat();
const DOTS_POSITIONS = Array.from({ length: 6 }, (_, row) =>
  Array.from({ length: 8 }, (_, col) => ({
    cx: col * 38 + 12,
    cy: row * 38 + 12,
    id: `d${col * 38 + 12}x${row * 38 + 12}`,
  })),
).flat();

// Ethnic pattern background SVG (subtle)
function EthnicPattern({ pattern }: { pattern: string }) {
  if (pattern === "embroidery") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        opacity="0.08"
        aria-hidden="true"
      >
        {EMBROIDERY_POSITIONS.map((pos) => (
          <g key={pos.id} transform={`translate(${pos.x}, ${pos.y})`}>
            <polygon points="20,0 40,20 20,40 0,20" fill="white" />
          </g>
        ))}
      </svg>
    );
  }
  if (pattern === "painting") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        opacity="0.08"
        aria-hidden="true"
      >
        {PAINTING_POSITIONS.map((pos) => (
          <circle key={pos.id} cx={pos.cx} cy={pos.cy} r="12" fill="white" />
        ))}
      </svg>
    );
  }
  if (pattern === "block") {
    return (
      <svg
        className="absolute inset-0 w-full h-full"
        opacity="0.07"
        aria-hidden="true"
      >
        {BLOCK_POSITIONS.map((pos) => (
          <rect
            key={pos.id}
            x={pos.x}
            y={pos.y}
            width="40"
            height="40"
            rx="4"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  }
  // Default: dots grid
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      opacity="0.08"
      aria-hidden="true"
    >
      {DOTS_POSITIONS.map((pos) => (
        <circle key={pos.id} cx={pos.cx} cy={pos.cy} r="3" fill="white" />
      ))}
    </svg>
  );
}

// Map hotspot with floating label
function MapHotspot({
  id,
  label,
  artForm,
  color,
  top,
  left,
  labelSide,
  selected,
  onClick,
}: {
  id: string;
  label: string;
  artForm: string;
  color: string;
  top: string;
  left: string;
  labelSide: "left" | "right";
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`heritage.${id}.map_marker`}
      onClick={onClick}
      className="absolute group"
      style={{
        top,
        left,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
      title={`${label} – ${artForm}`}
    >
      {/* Dot */}
      <span
        className={`block rounded-full transition-all duration-200 ${selected ? "w-6 h-6" : "w-4 h-4"} group-hover:w-6 group-hover:h-6`}
        style={{
          background: color,
          boxShadow: `0 0 0 ${selected ? "6px" : "4px"} ${color.replace(")", " / 0.25)")}`,
        }}
      />
      {/* Floating label */}
      <span
        className={`absolute pointer-events-none whitespace-nowrap px-2 py-0.5 rounded-full text-white font-semibold transition-opacity duration-200
          ${labelSide === "right" ? "left-full ml-2 top-1/2 -translate-y-1/2" : "right-full mr-2 top-1/2 -translate-y-1/2"}
          opacity-0 group-hover:opacity-100 ${selected ? "opacity-100" : ""}`}
        style={{
          background: color,
          fontSize: "0.6rem",
          letterSpacing: "0.04em",
          boxShadow: `0 2px 8px ${color.replace(")", " / 0.4)")}`,
        }}
      >
        {label}
        <span
          className="block font-normal"
          style={{ fontSize: "0.55rem", opacity: 0.85 }}
        >
          {artForm}
        </span>
      </span>
    </button>
  );
}

interface DraggableRegionCardProps {
  region: (typeof REGIONS)[0];
  index: number;
  selected: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

function DraggableRegionCard({
  region,
  index,
  selected,
  isLoading,
  onSelect,
  constraintsRef,
}: DraggableRegionCardProps) {
  const isSelected = selected === region.id;
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      data-ocid={`heritage.region.card.${index + 1}`}
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.08 * index,
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.12}
      dragMomentum={false}
      style={{
        x,
        y,
        zIndex: isDragging ? 50 : 1,
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onDragStart={(_e, info) => {
        dragStartPos.current = { x: info.point.x, y: info.point.y };
        setIsDragging(true);
      }}
      onDragEnd={(_e, info) => {
        setIsDragging(false);
        const dx = Math.abs(info.point.x - dragStartPos.current.x);
        const dy = Math.abs(info.point.y - dragStartPos.current.y);
        // Only treat as click if not dragged significantly
        if (dx < 6 && dy < 6 && !isLoading) {
          onSelect(region.id);
        }
      }}
      whileDrag={{ scale: 1.06 }}
      whileHover={!isDragging ? { scale: 1.03, y: -4 } : {}}
      className="select-none"
    >
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          width: "100%",
          minHeight: 200,
          background: `linear-gradient(135deg, ${region.color}, ${region.gradientTo})`,
          boxShadow: isSelected
            ? `0 20px 60px ${region.color}70, 0 4px 20px ${region.color}50, inset 0 1px 0 rgba(255,255,255,0.25)`
            : `0 8px 32px ${region.color}40, 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)`,
          border: isSelected
            ? "2px solid rgba(255,255,255,0.5)"
            : "2px solid rgba(255,255,255,0.15)",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Ethnic pattern overlay */}
        <EthnicPattern pattern={region.pattern} />

        {/* Decorative mandala ring — top right corner */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 pointer-events-none"
          style={{ opacity: 0.35 }}
        >
          <MandalRing color="rgba(255,255,255,0.9)" />
        </div>

        {/* Small decorative ring — bottom left */}
        <div
          className="absolute -bottom-6 -left-6 w-20 h-20 pointer-events-none"
          style={{ opacity: 0.2 }}
        >
          <MandalRing color="rgba(255,255,255,0.9)" />
        </div>

        {/* Drag hint icon */}
        <div
          className="absolute top-3 right-3 rounded-full p-1.5 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          <GripVertical size={14} color="rgba(255,255,255,0.8)" />
        </div>

        {/* Selected glow ring */}
        {isSelected && (
          <motion.div
            layoutId={`ring-${region.id}`}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: "3px solid rgba(255,255,255,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Card content */}
        <div
          className="relative z-10 p-5 flex flex-col h-full"
          style={{ minHeight: 200 }}
        >
          {/* Top row: emoji badge + selected indicator */}
          <div className="flex items-start justify-between mb-3">
            <div
              className="rounded-2xl px-3 py-1.5 flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.22)" }}
            >
              <span className="text-lg leading-none">{region.emoji}</span>
              {isSelected && (
                <Sparkles size={12} color="rgba(255,255,255,0.9)" />
              )}
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: region.color,
                  fontSize: "0.65rem",
                }}
              >
                SELECTED
              </motion.div>
            )}
          </div>

          {/* Region name — large serif */}
          <h3
            className="font-display font-bold leading-tight mb-1"
            style={{
              fontSize: "1.75rem",
              color: "rgba(255,255,255,0.97)",
              textShadow: "0 2px 12px rgba(0,0,0,0.2)",
              letterSpacing: "-0.01em",
            }}
          >
            {region.name}
          </h3>

          {/* Art form — pill tag */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={11} color="rgba(255,255,255,0.75)" />
            <span
              className="font-sans font-semibold tracking-wide uppercase"
              style={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.8)",
                letterSpacing: "0.08em",
              }}
            >
              {region.artForm}
            </span>
          </div>

          {/* Thin separator */}
          <div
            className="w-12 mb-3 rounded-full"
            style={{ height: 2, background: "rgba(255,255,255,0.4)" }}
          />

          {/* Description */}
          <p
            className="font-sans leading-snug italic mt-auto"
            style={{
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.55,
            }}
          >
            {region.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeritagePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const saveProfile = useSaveUserProfile();
  const constraintsRef = useRef<HTMLDivElement>(null);

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
          <p className="mt-2 text-xs text-charcoal/35 tracking-wide">
            ✦ Cards are draggable — grab and move them around
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:sticky lg:top-8"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-craft">
              <img
                src="/assets/generated/india-heritage-map.dim_900x1000.jpg"
                alt="India Heritage Map"
                className="w-full h-auto object-cover"
              />
              {/* Overlay hotspots */}
              <div className="absolute inset-0">
                {/* Kashmir — top-center teal region, crown of India */}
                <MapHotspot
                  id="kashmir"
                  label="Kashmir"
                  artForm="Pashmina"
                  color="oklch(0.55 0.14 278)"
                  top="17%"
                  left="44%"
                  labelSide="right"
                  selected={selected === "kashmir"}
                  onClick={() => handleSelect("kashmir")}
                />
                {/* Rajasthan — large golden region, center-left */}
                <MapHotspot
                  id="rajasthan"
                  label="Rajasthan"
                  artForm="Block Print"
                  color="oklch(0.62 0.17 48)"
                  top="46%"
                  left="31%"
                  labelSide="left"
                  selected={selected === "rajasthan"}
                  onClick={() => handleSelect("rajasthan")}
                />
                {/* Mithila/Bihar — upper right area where "Bihar Mithila" label appears */}
                <MapHotspot
                  id="mithila"
                  label="Mithila"
                  artForm="Madhubani"
                  color="oklch(0.65 0.15 75)"
                  top="37%"
                  left="61%"
                  labelSide="right"
                  selected={selected === "mithila"}
                  onClick={() => handleSelect("mithila")}
                />
                {/* Bengal — center-right where "West Bengal" label appears */}
                <MapHotspot
                  id="bengal"
                  label="Bengal"
                  artForm="Kantha"
                  color="oklch(0.55 0.15 145)"
                  top="50%"
                  left="64%"
                  labelSide="right"
                  selected={selected === "bengal"}
                  onClick={() => handleSelect("bengal")}
                />
                {/* Nilgiris — bottom-right of peninsula, Tamil Nadu area */}
                <MapHotspot
                  id="nilgiris"
                  label="Nilgiris"
                  artForm="Toda Emb."
                  color="oklch(0.60 0.12 185)"
                  top="84%"
                  left="54%"
                  labelSide="right"
                  selected={selected === "nilgiris"}
                  onClick={() => handleSelect("nilgiris")}
                />
                {/* Kerala — bottom-left tip of peninsula where "Keral" label appears */}
                <MapHotspot
                  id="kerala"
                  label="Kerala"
                  artForm="Kasavu"
                  color="oklch(0.58 0.16 162)"
                  top="84%"
                  left="36%"
                  labelSide="left"
                  selected={selected === "kerala"}
                  onClick={() => handleSelect("kerala")}
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-center text-charcoal/35 tracking-wide">
              Tap a dot on the map or choose a card on the right
            </p>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  data-ocid="heritage.region.button"
                  type="button"
                  onClick={() => handleSelect(r.id)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105"
                  style={{
                    background: selected === r.id ? r.color : `${r.color}18`,
                    color: selected === r.id ? "white" : r.color,
                    border: `1.5px solid ${r.color}60`,
                    fontFamily: "inherit",
                  }}
                >
                  <span>{r.emoji}</span>
                  {r.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Draggable Region Cards — 2-column grid */}
          <div ref={constraintsRef} className="relative min-h-[600px]">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-charcoal/35 tracking-wide mb-4 text-center"
            >
              Drag cards to rearrange ✦ Click to select
            </motion.p>
            <div className="grid grid-cols-2 gap-4">
              {REGIONS.map((region, i) => (
                <DraggableRegionCard
                  key={region.id}
                  region={region}
                  index={i}
                  selected={selected}
                  isLoading={isLoading}
                  onSelect={handleSelect}
                  constraintsRef={constraintsRef}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
