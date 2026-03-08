import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  Gavel,
  Heart,
  Package,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Footer } from "../components/Footer";

// ── Types ────────────────────────────────────────────────────────────────────

interface AuctionItem {
  id: string;
  title: string;
  artist: string;
  region: string;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
  image: string;
  category: string;
}

interface PastAuction {
  id: string;
  title: string;
  artist: string;
  region: string;
  finalPrice: number;
  winner: string;
  image: string;
}

interface CoinData {
  id: number;
  left: number; // percent
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  wobble: number; // px
  rotateEnd: number; // degrees
}

// ── Static Data ──────────────────────────────────────────────────────────────

const ACTIVE_AUCTIONS: AuctionItem[] = [
  {
    id: "1",
    title: "Toda Embroidery Panel No. 7",
    artist: "Kavya R.",
    region: "Nilgiris",
    currentBid: 12500,
    bidCount: 18,
    timeLeft: "2h 14m remaining",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
    category: "Embroidery",
  },
  {
    id: "2",
    title: "Mithila Madhubani Triptych",
    artist: "Priya D.",
    region: "Mithila",
    currentBid: 38000,
    bidCount: 31,
    timeLeft: "Ends today",
    image: "/assets/generated/madhubani-painting.dim_800x600.jpg",
    category: "Painting",
  },
  {
    id: "3",
    title: "Warli Village Scene",
    artist: "Arjun M.",
    region: "Maharashtra",
    currentBid: 8200,
    bidCount: 12,
    timeLeft: "1d 6h remaining",
    image: "/assets/generated/warli-art.dim_800x600.jpg",
    category: "Tribal Art",
  },
  {
    id: "4",
    title: "Kalamkari Sacred Lotus",
    artist: "Meera S.",
    region: "Andhra Pradesh",
    currentBid: 22750,
    bidCount: 24,
    timeLeft: "4h 38m remaining",
    image: "/assets/generated/kalamkari-art.dim_800x600.jpg",
    category: "Kalamkari",
  },
  {
    id: "5",
    title: "Mandala of the Nilgiris",
    artist: "Ravi T.",
    region: "Nilgiris",
    currentBid: 4200,
    bidCount: 9,
    timeLeft: "3d 2h remaining",
    image: "/assets/generated/mandala-art.dim_800x600.jpg",
    category: "Mandala",
  },
  {
    id: "6",
    title: "Rajasthani Mirror Work Dupatta",
    artist: "Sunita P.",
    region: "Rajasthan",
    currentBid: 16800,
    bidCount: 21,
    timeLeft: "Ends today",
    image: "/assets/generated/toda-embroidery.dim_800x600.jpg",
    category: "Textile",
  },
];

const PAST_AUCTIONS: PastAuction[] = [
  {
    id: "p1",
    title: "Bengal Kantha Quilt Fragment",
    artist: "Diya B.",
    region: "Bengal",
    finalPrice: 29500,
    winner: "Anonymous Bidder",
    image: "/assets/generated/madhubani-painting.dim_800x600.jpg",
  },
  {
    id: "p2",
    title: "Kerala Mural Study",
    artist: "Arun N.",
    region: "Kerala",
    finalPrice: 45000,
    winner: "Anonymous Bidder",
    image: "/assets/generated/kalamkari-art.dim_800x600.jpg",
  },
  {
    id: "p3",
    title: "Warli Harvest Ceremony",
    artist: "Leela G.",
    region: "Maharashtra",
    finalPrice: 11200,
    winner: "Anonymous Bidder",
    image: "/assets/generated/warli-art.dim_800x600.jpg",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Gavel,
    step: "01",
    title: "Browse Artworks",
    desc: "Explore authenticated original pieces crafted by young artisans trained in dying heritage arts.",
  },
  {
    icon: Heart,
    step: "02",
    title: "Place Your Bid",
    desc: "Submit competitive bids in real time. Every rupee directly supports the young artist.",
  },
  {
    icon: Package,
    step: "03",
    title: "Win & Receive",
    desc: "Highest bidder receives the hand-crafted original piece, securely packaged and delivered.",
  },
];

const BID_TICKER_MESSAGES = [
  "Priya D. just bid ₹39,500 on Mithila Triptych",
  "Arjun M. just bid ₹8,700 on Warli Scene",
  "Meera S. just bid ₹23,000 on Kalamkari Lotus",
  "Ravi T. just bid ₹4,800 on Nilgiris Mandala",
  "Sunita P. just bid ₹17,200 on Mirror Dupatta",
  "Kavya R. just bid ₹13,400 on Toda Panel No. 7",
  "Deepa N. just bid ₹41,200 on Mithila Triptych",
];

const AMBIENT_BID_AMOUNTS = [
  "₹12,500",
  "₹38,000",
  "₹8,200",
  "₹22,750",
  "₹4,200",
];
const BID_COUNTER_VALUES = [2, 3, 5, 2, 4];

function formatBid(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ── Coin Rain ────────────────────────────────────────────────────────────────

function generateCoins(count: number): CoinData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 96 + 2, // 2–98% of viewport width
    size: Math.random() * 20 + 42, // 42–62px
    duration: Math.random() * 1.8 + 1.8, // 1.8–3.6s
    delay: Math.random() * 1.4, // 0–1.4s
    wobble: Math.random() * 22 + 8, // ±8–30px sway
    rotateEnd: Math.random() > 0.5 ? 360 : -360,
  }));
}

function CoinRain({ active }: { active: boolean }) {
  const coins = useMemo(() => generateCoins(22), []);

  return (
    <AnimatePresence>
      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ y: -90, x: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: "110vh",
                x: [0, coin.wobble, 0, -coin.wobble, coin.wobble * 0.5, 0],
                rotate: coin.rotateEnd,
                opacity: [1, 1, 1, 0.8, 0],
              }}
              transition={{
                duration: coin.duration,
                delay: coin.delay,
                ease: "easeIn",
                x: {
                  duration: coin.duration,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                },
                opacity: {
                  duration: coin.duration,
                  times: [0, 0.5, 0.7, 0.85, 1],
                },
              }}
              style={{
                position: "absolute",
                left: `${coin.left}%`,
                top: 0,
                width: coin.size,
                height: coin.size,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 35%, oklch(0.90 0.20 88), oklch(0.82 0.21 82) 45%, oklch(0.65 0.22 75))",
                border: "2px solid oklch(0.75 0.20 78)",
                boxShadow: `
                  inset 0 2px 4px oklch(0.92 0.12 90 / 0.7),
                  inset 0 -2px 5px oklch(0.50 0.18 72 / 0.5),
                  0 3px 10px oklch(0.65 0.20 80 / 0.55),
                  0 1px 3px oklch(0.40 0.16 70 / 0.4)
                `,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  fontSize: coin.size * 0.42,
                  fontWeight: 800,
                  color: "oklch(0.35 0.12 60)",
                  textShadow: "0 1px 2px oklch(0.85 0.15 88 / 0.8)",
                  lineHeight: 1,
                  fontFamily: "serif",
                }}
              >
                ₹
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Bid Activity Ticker ──────────────────────────────────────────────────────

function BidActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % BID_TICKER_MESSAGES.length);
        setVisible(true);
      }, 350);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        left: 32,
        zIndex: 10,
        width: 300,
        background: "rgba(255,255,255,0.97)",
        borderRadius: 14,
        boxShadow:
          "0 4px 20px oklch(0.60 0.12 185 / 0.18), 0 1px 4px oklch(0.20 0.05 185 / 0.12)",
        borderLeft: "3px solid oklch(0.60 0.12 185)",
        padding: "10px 14px",
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 5,
        }}
      >
        {/* Pulsing live dot */}
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            width: 8,
            height: 8,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "oklch(0.55 0.20 145)",
              animation: "ping 1.2s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
          <span
            style={{
              position: "relative",
              borderRadius: "50%",
              width: 8,
              height: 8,
              background: "oklch(0.55 0.20 145)",
              display: "inline-block",
            }}
          />
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "oklch(0.55 0.20 145)",
          }}
        >
          Live Bids
        </span>
      </div>
      {/* Ticker message */}
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{
              margin: 0,
              fontSize: 12.5,
              fontWeight: 500,
              color: "oklch(0.28 0.05 185)",
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {BID_TICKER_MESSAGES[currentIndex]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Ambient Floating Bid Bubbles ─────────────────────────────────────────────

function AmbientBidBubbles() {
  const bubbles = useMemo(
    () =>
      AMBIENT_BID_AMOUNTS.map((amount, i) => ({
        id: i,
        amount,
        left: 60 + i * 8, // right side of hero, 60–92%
        bottom: 10 + i * 14, // staggered vertical start
        delay: i * 0.9,
      })),
    [],
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-10, -90, -10],
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{
            duration: 5.5,
            delay: b.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1.2,
            ease: "easeInOut",
            opacity: { times: [0, 0.15, 0.85, 1] },
          }}
          style={{
            position: "absolute",
            bottom: `${b.bottom}%`,
            left: `${b.left}%`,
            background: "oklch(0.60 0.12 185 / 0.18)",
            backdropFilter: "blur(2px)",
            border: "1px solid oklch(0.60 0.12 185 / 0.22)",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 13,
            fontWeight: 700,
            color: "oklch(0.42 0.12 185)",
            whiteSpace: "nowrap",
          }}
        >
          {b.amount}
        </motion.div>
      ))}
    </div>
  );
}

// ── Bid Counter Pulse ────────────────────────────────────────────────────────

function BidCounterPulse() {
  const [countIndex, setCountIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountIndex((prev) => (prev + 1) % BID_COUNTER_VALUES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        marginLeft: 10,
        fontSize: 11.5,
        fontWeight: 600,
        color: "oklch(0.50 0.14 185)",
      }}
    >
      {/* Pulsing dot */}
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          width: 7,
          height: 7,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "oklch(0.58 0.18 145)",
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <span
          style={{
            position: "relative",
            borderRadius: "50%",
            width: 7,
            height: 7,
            background: "oklch(0.58 0.18 145)",
            display: "inline-block",
          }}
        />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={countIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          style={{ display: "inline-block" }}
        >
          {BID_COUNTER_VALUES[countIndex]} new bids in last minute
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ── Bid Dialog ───────────────────────────────────────────────────────────────

interface BidDialogProps {
  item: AuctionItem | null;
  open: boolean;
  onClose: () => void;
  onBidSuccess: () => void;
}

function BidDialog({ item, open, onClose, onBidSuccess }: BidDialogProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!item) return null;

  const minBid = item.currentBid + 100;
  const quickBids = [
    minBid,
    item.currentBid + 500,
    item.currentBid + 1000,
    item.currentBid + 2500,
  ];

  const handleSubmit = () => {
    const amount = Number(bidAmount.replace(/,/g, ""));
    if (!bidAmount || Number.isNaN(amount)) {
      toast.error("Please enter a valid bid amount.");
      return;
    }
    if (amount < minBid) {
      toast.error(`Minimum bid is ${formatBid(minBid)}`);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setBidAmount("");
        onBidSuccess();
        onClose();
        toast.success(`Bid of ${formatBid(amount)} placed successfully!`);
      }, 1200);
    }, 900);
  };

  const handleClose = () => {
    setBidAmount("");
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-white border border-gray-100 p-0 overflow-hidden rounded-2xl">
        {/* Top image strip */}
        <div className="relative h-36 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-medium">
              {item.region} · {item.category}
            </p>
            <h2 className="font-display text-lg font-semibold text-white leading-tight mt-0.5">
              {item.title}
            </h2>
          </div>
          {/* Time left chip */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <Clock className="w-3 h-3 text-charcoal/60" />
            <span className="text-xs font-medium text-charcoal/70">
              {item.timeLeft}
            </span>
          </div>
        </div>

        <div className="px-6 pt-5 pb-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: "oklch(0.96 0.03 185)" }}
            >
              <p className="text-[10px] tracking-widest uppercase text-charcoal/45 font-medium">
                Current
              </p>
              <p
                className="font-display text-xl font-bold mt-0.5"
                style={{ color: "oklch(0.50 0.14 185)" }}
              >
                {formatBid(item.currentBid)}
              </p>
            </div>
            <div className="rounded-xl px-4 py-3 text-center bg-gray-50">
              <p className="text-[10px] tracking-widest uppercase text-charcoal/45 font-medium">
                Bids
              </p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-charcoal/50" />
                <p className="font-display text-xl font-bold text-charcoal/70">
                  {item.bidCount}
                </p>
              </div>
            </div>
            <div className="rounded-xl px-4 py-3 text-center bg-gray-50">
              <p className="text-[10px] tracking-widest uppercase text-charcoal/45 font-medium">
                Minimum
              </p>
              <p className="font-display text-xl font-bold text-charcoal/70 mt-0.5">
                {formatBid(minBid)}
              </p>
            </div>
          </div>

          {/* Quick bid buttons */}
          <div>
            <p className="text-[10px] tracking-widest uppercase text-charcoal/45 font-medium mb-2">
              Quick Bid
            </p>
            <div className="grid grid-cols-4 gap-2">
              {quickBids.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBidAmount(String(amount))}
                  className={`rounded-lg py-2 px-1 text-xs font-semibold border transition-all duration-150 ${
                    bidAmount === String(amount)
                      ? "border-transparent text-white"
                      : "border-gray-200 text-charcoal/60 bg-white hover:border-teal/40 hover:text-charcoal"
                  }`}
                  style={
                    bidAmount === String(amount)
                      ? { background: "oklch(0.60 0.12 185)" }
                      : {}
                  }
                >
                  {formatBid(amount)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom bid input */}
          <div className="space-y-2">
            <Label
              htmlFor="bid-input"
              className="text-[10px] text-charcoal/50 tracking-widest uppercase font-medium"
            >
              Or Enter Custom Bid (₹)
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 font-medium text-sm">
                ₹
              </span>
              <Input
                id="bid-input"
                type="number"
                placeholder={`e.g. ${(item.currentBid + 1500).toLocaleString("en-IN")}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="pl-8 border-gray-200 focus-visible:ring-1 focus-visible:ring-teal/40 text-charcoal placeholder:text-charcoal/25 rounded-lg h-11"
              />
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 py-3 border-y border-gray-100">
            <div className="flex items-center gap-1.5 text-charcoal/45">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs">Secure Bidding</span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal/45">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs">Verified Artwork</span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal/45">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs">Instant Confirmation</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-200 text-charcoal/55 hover:text-charcoal hover:bg-gray-50 rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess}
              className="flex-[2] text-white font-semibold rounded-xl h-11 transition-all duration-200"
              style={{
                background: isSuccess
                  ? "oklch(0.55 0.15 145)"
                  : "oklch(0.60 0.12 185)",
              }}
            >
              {isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Bid Placed!
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Placing bid…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Place Bid
                  {bidAmount &&
                    !Number.isNaN(Number(bidAmount)) &&
                    Number(bidAmount) >= minBid && (
                      <span className="opacity-80">
                        · {formatBid(Number(bidAmount))}
                      </span>
                    )}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Auction Card ─────────────────────────────────────────────────────────────

interface AuctionCardProps {
  item: AuctionItem;
  index: number;
  onBid: (item: AuctionItem) => void;
}

function AuctionCard({ item, index, onBid }: AuctionCardProps) {
  const isEndingToday = item.timeLeft === "Ends today";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Card className="bg-white border border-gray-100 overflow-hidden group hover:shadow-luxury transition-shadow duration-300 rounded-2xl">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Region badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/90 text-charcoal font-medium tracking-wide shadow-xs">
              {item.region}
            </span>
          </div>
          {/* Urgency badge */}
          {isEndingToday && (
            <div className="absolute top-3 right-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold text-white tracking-wide"
                style={{ background: "oklch(0.58 0.20 27)" }}
              >
                Ends Today
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Category */}
          <p className="text-[10px] tracking-[0.18em] uppercase text-charcoal/40 font-medium">
            {item.category}
          </p>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-charcoal leading-tight mt-1">
            {item.title}
          </h3>
          <p className="text-sm text-charcoal/50 mt-0.5">{item.artist}</p>

          <Separator className="my-4 bg-gray-50" />

          {/* Bid info row */}
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between"
            style={{ background: "oklch(0.97 0.02 185)" }}
          >
            <div>
              <p className="text-[10px] tracking-widest uppercase text-charcoal/40 font-medium">
                Current Bid
              </p>
              <p
                className="font-display text-2xl font-bold mt-0.5"
                style={{ color: "oklch(0.50 0.14 185)" }}
              >
                {formatBid(item.currentBid)}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="flex items-center gap-1.5 text-charcoal/45 justify-end">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {item.bidCount} bids
                </span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Clock
                  className={`w-3 h-3 ${isEndingToday ? "" : "text-charcoal/40"}`}
                  style={
                    isEndingToday ? { color: "oklch(0.58 0.20 27)" } : undefined
                  }
                />
                <span
                  className={`text-xs font-medium ${isEndingToday ? "font-semibold" : "text-charcoal/45"}`}
                  style={isEndingToday ? { color: "oklch(0.58 0.20 27)" } : {}}
                >
                  {item.timeLeft}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            className="w-full text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 rounded-xl h-10 gap-2"
            style={{ background: "oklch(0.60 0.12 185)" }}
            onClick={() => onBid(item)}
          >
            <Gavel className="w-4 h-4" />
            Place Bid
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Past Auction Card ────────────────────────────────────────────────────────

function PastAuctionCard({
  item,
  index,
}: { item: PastAuction; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
    >
      <Card className="bg-white border border-gray-100 overflow-hidden rounded-2xl">
        <div className="relative h-40 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover grayscale-[30%] opacity-80"
          />
          <div className="absolute inset-0 bg-black/20" />
          {/* SOLD badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-charcoal text-white font-semibold tracking-widest uppercase">
              SOLD
            </span>
          </div>
        </div>
        <CardContent className="p-5">
          <h4 className="font-display text-base font-semibold text-charcoal/70 leading-tight">
            {item.title}
          </h4>
          <p className="text-sm text-charcoal/40 mt-0.5">
            {item.artist} · {item.region}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-charcoal/35">
                Final Price
              </p>
              <p
                className="font-display text-lg font-semibold mt-0.5"
                style={{ color: "oklch(0.72 0.14 80)" }}
              >
                {formatBid(item.finalPrice)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-charcoal/35 justify-end">
                <Users className="w-3 h-3" />
                <span className="text-xs">{item.winner}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 text-sm border-gray-200 text-charcoal/50 hover:text-charcoal hover:bg-gray-50"
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AuctionPage() {
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCoins, setShowCoins] = useState(false);

  const openBidDialog = (item: AuctionItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const closeBidDialog = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleBidSuccess = () => {
    setShowCoins(true);
    setTimeout(() => setShowCoins(false), 4500);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ── Coin Rain Overlay ─────────────────────────────────────────── */}
      <CoinRain active={showCoins} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Ambient floating bubbles (behind text) */}
        <AmbientBidBubbles />

        {/* Subtle background gradient */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.60 0.12 185) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.72 0.14 80) 0%, transparent 50%)",
            zIndex: 0,
          }}
        />

        <div
          className="max-w-7xl mx-auto px-8 py-20 relative"
          style={{ zIndex: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "oklch(0.60 0.12 185)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5"
                  style={{ background: "oklch(0.60 0.12 185)" }}
                />
              </span>
              <span
                className="text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{ color: "oklch(0.60 0.12 185)" }}
              >
                Live Now
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-bold text-charcoal leading-none tracking-tight">
              Live Auction
            </h1>

            {/* Teal underline accent */}
            <div
              className="mt-3 h-0.5 w-16 rounded-full"
              style={{ background: "oklch(0.60 0.12 185)" }}
            />

            <p className="mt-5 text-lg text-charcoal/55 leading-relaxed max-w-lg">
              Bid on original heritage artworks by young Indian artisans. Every
              piece is hand-crafted, certified, and one-of-a-kind.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-8">
              {[
                { label: "Active Lots", value: "6" },
                { label: "Bidders Today", value: "142" },
                { label: "Total Raised", value: "₹8.4L" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-semibold text-charcoal">
                    {stat.value}
                  </p>
                  <p className="text-xs text-charcoal/40 tracking-widest uppercase mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live bid ticker — positioned at bottom-left of hero */}
        <BidActivityTicker />
      </section>

      {/* ── Active Auctions ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-baseline justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal">
              Active Lots
            </h2>
            <p className="text-sm text-charcoal/45 mt-1 flex items-center flex-wrap gap-1">
              6 artworks currently accepting bids
              <BidCounterPulse />
            </p>
          </div>
          <Badge
            className="text-xs tracking-widest uppercase px-3 py-1"
            style={{
              background: "oklch(0.92 0.05 185)",
              color: "oklch(0.42 0.12 185)",
              border: "none",
            }}
          >
            Bidding Open
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIVE_AUCTIONS.map((item, i) => (
            <AuctionCard
              key={item.id}
              item={item}
              index={i}
              onBid={openBidDialog}
            />
          ))}
        </div>
      </section>

      <Separator className="bg-gray-100" />

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-charcoal">
              How It Works
            </h2>
            <p className="text-sm text-charcoal/45 mt-2">
              Three simple steps to own a piece of living heritage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center group"
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-0 h-px"
                    style={{ background: "oklch(0.88 0.04 185)" }}
                  />
                )}

                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ background: "oklch(0.92 0.05 185)" }}
                >
                  <step.icon
                    className="w-7 h-7"
                    style={{ color: "oklch(0.60 0.12 185)" }}
                  />
                </div>

                <p
                  className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-2"
                  style={{ color: "oklch(0.72 0.14 80)" }}
                >
                  Step {step.step}
                </p>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-charcoal/50 leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-gray-100" />

      {/* ── Past Auctions ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-charcoal">
            Recently Closed
          </h2>
          <p className="text-sm text-charcoal/45 mt-1">
            Artworks that found their forever homes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAST_AUCTIONS.map((item, i) => (
            <PastAuctionCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Bid Dialog ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {dialogOpen && (
          <BidDialog
            item={selectedItem}
            open={dialogOpen}
            onClose={closeBidDialog}
            onBidSuccess={handleBidSuccess}
          />
        )}
      </AnimatePresence>

      {/* Ping animation keyframe */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </main>
  );
}
