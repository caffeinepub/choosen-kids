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
import { Clock, Gavel, Heart, Package, TrendingUp, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

function formatBid(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// ── Bid Dialog ───────────────────────────────────────────────────────────────

interface BidDialogProps {
  item: AuctionItem | null;
  open: boolean;
  onClose: () => void;
}

function BidDialog({ item, open, onClose }: BidDialogProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const minBid = item.currentBid + 100;

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
      setBidAmount("");
      onClose();
      toast.success(`Bid of ${formatBid(amount)} placed successfully!`);
    }, 800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setBidAmount("");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-white border border-gray-100">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-charcoal leading-tight">
            {item.title}
          </DialogTitle>
          <p className="text-xs text-charcoal/50 tracking-widest uppercase mt-1">
            {item.region} · {item.category}
          </p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Current bid display */}
          <div className="bg-teal-light/40 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-charcoal/50 tracking-widest uppercase">
                Current Bid
              </p>
              <p
                className="font-display text-2xl font-semibold mt-0.5"
                style={{ color: "oklch(0.60 0.12 185)" }}
              >
                {formatBid(item.currentBid)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-charcoal/50 tracking-widest uppercase">
                Bids
              </p>
              <p className="text-xl font-semibold text-charcoal/70 mt-0.5">
                {item.bidCount}
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label
              htmlFor="bid-input"
              className="text-xs text-charcoal/60 tracking-widest uppercase"
            >
              Your Bid (₹)
            </Label>
            <Input
              id="bid-input"
              type="number"
              placeholder={`Min. ${formatBid(minBid)}`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="border-gray-200 focus-visible:ring-teal text-charcoal placeholder:text-charcoal/30"
            />
            <p className="text-xs text-charcoal/40">
              Minimum bid: {formatBid(minBid)} (₹100 above current)
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              setBidAmount("");
              onClose();
            }}
            className="border-gray-200 text-charcoal/60 hover:text-charcoal hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-white font-medium hover:opacity-90 transition-opacity"
            style={{ background: "oklch(0.60 0.12 185)" }}
          >
            {isSubmitting ? "Placing bid…" : "Submit Bid"}
          </Button>
        </DialogFooter>
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
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-charcoal/40">
                Current Bid
              </p>
              <p
                className="font-display text-xl font-semibold mt-0.5"
                style={{ color: "oklch(0.60 0.12 185)" }}
              >
                {formatBid(item.currentBid)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-charcoal/40 justify-end">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs">{item.bidCount} bids</span>
              </div>
              <div className="flex items-center gap-1 text-charcoal/40 justify-end mt-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{item.timeLeft}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            className="w-full text-white font-medium text-sm hover:opacity-90 transition-opacity"
            style={{ background: "oklch(0.60 0.12 185)" }}
            onClick={() => onBid(item)}
          >
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

  const openBidDialog = (item: AuctionItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const closeBidDialog = () => {
    setDialogOpen(false);
    // keep selectedItem briefly for exit animation
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.60 0.12 185) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.72 0.14 80) 0%, transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-8 py-20 relative">
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
            <p className="text-sm text-charcoal/45 mt-1">
              6 artworks currently accepting bids
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
          />
        )}
      </AnimatePresence>
    </main>
  );
}
