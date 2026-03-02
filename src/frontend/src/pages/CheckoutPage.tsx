import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  QrCode,
  Shield,
  Smartphone,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/Footer";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return `₹${(price / 100).toLocaleString("en-IN")}`;
}

function generateOrderId(): string {
  return `#CK-${Math.floor(100000 + Math.random() * 900000).toString()}`;
}

// ── Types ────────────────────────────────────────────────────────────────────

type CheckoutType = "course" | "kit" | "bundle";
type PaymentTab = "upi" | "card" | "netbanking" | "wallets";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  upiId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  upiId?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardName?: string;
}

// ── Validation ───────────────────────────────────────────────────────────────

function validateForm(
  data: FormData,
  checkoutType: CheckoutType,
  tab: PaymentTab,
): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = "Full name is required";
  if (!data.email.trim()) errors.email = "Email address is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email";
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^\+?[\d\s\-()]{8,}$/.test(data.phone))
    errors.phone = "Please enter a valid phone number";

  if (checkoutType === "kit" || checkoutType === "bundle") {
    if (!data.address.trim()) errors.address = "Shipping address is required";
  }

  if (tab === "upi") {
    if (!data.upiId.trim()) errors.upiId = "UPI ID is required";
    else if (!/^[\w.\-_]{2,}@[\w]{2,}$/.test(data.upiId.trim()))
      errors.upiId = "Enter a valid UPI ID (e.g. name@upi)";
  }

  if (tab === "card") {
    const cardClean = data.cardNumber.replace(/\s/g, "");
    if (!cardClean) errors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(cardClean))
      errors.cardNumber = "Please enter a valid 16-digit card number";

    if (!data.expiry) errors.expiry = "Expiry date is required";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry))
      errors.expiry = "Use MM/YY format";

    if (!data.cvv) errors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(data.cvv)) errors.cvv = "Enter 3 or 4 digits";

    if (!data.cardName.trim()) errors.cardName = "Cardholder name is required";
  }

  return errors;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs mt-1.5 text-red-500 font-medium">{message}</p>;
}

function RazorField({
  label,
  id,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium mb-1.5"
        style={{ color: "oklch(0.42 0.01 250)" }}
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300 bg-white ${
          error
            ? "border-red-400 focus:ring-red-100 text-red-900"
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 text-gray-800"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

// ── QR Code Placeholder ───────────────────────────────────────────────────────

function QRCodePattern() {
  return (
    <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden border-2 border-gray-100 p-1.5 bg-white">
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateRows: "repeat(9, 1fr)",
          gap: "1px",
        }}
      >
        {Array.from({ length: 81 }, (_, i) => ({
          idx: i,
          row: Math.floor(i / 9),
          col: i % 9,
        })).map(({ idx, row, col }) => {
          const isCornerTL = (row < 3 && col < 3) || (row === 0 && col === 0);
          const isCornerTR = row < 3 && col > 5;
          const isCornerBL = row > 5 && col < 3;
          const isData =
            !isCornerTL &&
            !isCornerTR &&
            !isCornerBL &&
            Math.abs(Math.sin(idx * 1.3 + idx * 0.7)) > 0.5;
          const isFilled = isCornerTL || isCornerTR || isCornerBL || isData;
          return (
            <div
              key={`qr-${row}-${col}`}
              className="rounded-[1px]"
              style={{ background: isFilled ? "#1a1f36" : "transparent" }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── UPI Tab ───────────────────────────────────────────────────────────────────

function UPITab({
  upiId,
  onChange,
  error,
}: {
  upiId: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const UPI_APPS = [
    { name: "PhonePe", color: "#5f259f", emoji: "📱" },
    { name: "GPay", color: "#1a73e8", emoji: "💳" },
    { name: "Paytm", color: "#002970", emoji: "🔵" },
    { name: "BHIM", color: "#f7831c", emoji: "🏛️" },
  ];

  return (
    <div className="space-y-5">
      {/* UPI ID input */}
      <div>
        <label
          htmlFor="upiId"
          className="block text-xs font-medium mb-1.5"
          style={{ color: "oklch(0.42 0.01 250)" }}
        >
          Enter UPI ID
        </label>
        <div className="flex gap-2">
          <input
            id="upiId"
            type="text"
            value={upiId}
            onChange={(e) => onChange(e.target.value)}
            placeholder="yourname@upi"
            className={`flex-1 px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300 bg-white ${
              error
                ? "border-red-400 focus:ring-red-100 text-red-900"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 text-gray-800"
            }`}
          />
          <button
            type="button"
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-white shrink-0 transition-opacity hover:opacity-90"
            style={{ background: "#528FF0" }}
          >
            Verify
          </button>
        </div>
        <FieldError message={error} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">OR</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      {/* QR Code */}
      <div className="text-center space-y-2">
        <QRCodePattern />
        <p className="text-xs text-gray-500">
          Open any UPI app and scan to pay
        </p>
      </div>

      {/* Popular UPI apps */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-2.5">
          Popular UPI Apps
        </p>
        <div className="grid grid-cols-4 gap-2">
          {UPI_APPS.map((app) => (
            <button
              key={app.name}
              type="button"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
            >
              <span className="text-xl">{app.emoji}</span>
              <span className="text-[10px] font-medium text-gray-600">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Card Tab ──────────────────────────────────────────────────────────────────

function CardTab({
  form,
  errors,
  onCardNumberChange,
  onExpiryChange,
  onFieldChange,
}: {
  form: FormData;
  errors: FormErrors;
  onCardNumberChange: (val: string) => void;
  onExpiryChange: (val: string) => void;
  onFieldChange: (name: string, val: string) => void;
}) {
  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  // Detect card type from first digit
  const firstDigit = form.cardNumber.replace(/\s/g, "")[0];
  const cardType =
    firstDigit === "4"
      ? "VISA"
      : firstDigit === "5"
        ? "MC"
        : firstDigit === "3"
          ? "AMEX"
          : null;

  return (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label
          htmlFor="cardNumber"
          className="block text-xs font-medium mb-1.5"
          style={{ color: "oklch(0.42 0.01 250)" }}
        >
          Card Number
        </label>
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            value={form.cardNumber}
            onChange={(e) =>
              onCardNumberChange(formatCardNumber(e.target.value))
            }
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
            className={`w-full px-3.5 py-2.5 pr-16 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300 bg-white font-mono tracking-wider ${
              errors.cardNumber
                ? "border-red-400 focus:ring-red-100 text-red-900"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 text-gray-800"
            }`}
          />
          {cardType && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
              {cardType}
            </span>
          )}
        </div>
        <FieldError message={errors.cardNumber} />
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="expiry"
            className="block text-xs font-medium mb-1.5"
            style={{ color: "oklch(0.42 0.01 250)" }}
          >
            Expiry (MM/YY)
          </label>
          <input
            id="expiry"
            type="text"
            value={form.expiry}
            onChange={(e) => onExpiryChange(formatExpiry(e.target.value))}
            placeholder="12/27"
            inputMode="numeric"
            autoComplete="cc-exp"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300 bg-white ${
              errors.expiry
                ? "border-red-400 focus:ring-red-100 text-red-900"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 text-gray-800"
            }`}
          />
          <FieldError message={errors.expiry} />
        </div>
        <div>
          <label
            htmlFor="cvv"
            className="block text-xs font-medium mb-1.5"
            style={{ color: "oklch(0.42 0.01 250)" }}
          >
            CVV
          </label>
          <input
            id="cvv"
            type="password"
            value={form.cvv}
            onChange={(e) => onFieldChange("cvv", e.target.value.slice(0, 4))}
            placeholder="•••"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300 bg-white ${
              errors.cvv
                ? "border-red-400 focus:ring-red-100 text-red-900"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 text-gray-800"
            }`}
          />
          <FieldError message={errors.cvv} />
        </div>
      </div>

      {/* Cardholder Name */}
      <RazorField
        label="Cardholder Name"
        id="cardName"
        name="cardName"
        type="text"
        placeholder="As on card"
        value={form.cardName}
        onChange={(e) => onFieldChange("cardName", e.target.value)}
        autoComplete="cc-name"
        error={errors.cardName}
      />
    </div>
  );
}

// ── Net Banking Tab ───────────────────────────────────────────────────────────

function NetBankingTab({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (bank: string) => void;
}) {
  const BANKS = [
    { id: "sbi", name: "SBI", color: "#2D4CA0" },
    { id: "hdfc", name: "HDFC", color: "#004C8F" },
    { id: "icici", name: "ICICI", color: "#F37329" },
    { id: "axis", name: "Axis", color: "#97144D" },
    { id: "kotak", name: "Kotak", color: "#ED1C24" },
    { id: "bob", name: "BoB", color: "#F3611B" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 font-medium">Select Your Bank</p>
      <div className="grid grid-cols-3 gap-2.5">
        {BANKS.map((bank) => (
          <button
            key={bank.id}
            type="button"
            onClick={() => onSelect(bank.id)}
            className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
              selected === bank.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-100 hover:border-gray-200 bg-white"
            }`}
            style={{
              color: selected === bank.id ? "#528FF0" : bank.color,
            }}
          >
            {bank.name}
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-green-600 font-medium px-3 py-2 bg-green-50 rounded-lg"
        >
          <CheckCircle2 size={12} />
          {BANKS.find((b) => b.id === selected)?.name} selected — you'll be
          redirected to your bank
        </motion.div>
      )}

      <div>
        <label
          htmlFor="other-bank-select"
          className="block text-xs font-medium mb-1.5"
          style={{ color: "oklch(0.42 0.01 250)" }}
        >
          Other Banks
        </label>
        <select
          id="other-bank-select"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
        >
          <option value="">Select your bank…</option>
          <option>Yes Bank</option>
          <option>IndusInd Bank</option>
          <option>Punjab National Bank</option>
          <option>Canara Bank</option>
          <option>Union Bank of India</option>
          <option>Bank of India</option>
        </select>
      </div>
    </div>
  );
}

// ── Wallets Tab ───────────────────────────────────────────────────────────────

function WalletsTab({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (wallet: string) => void;
}) {
  const WALLETS = [
    { id: "paytm", name: "Paytm Wallet", emoji: "💙", desc: "Balance: ₹0" },
    {
      id: "phonepegift",
      name: "PhonePe Wallet",
      emoji: "💜",
      desc: "Balance: ₹0",
    },
    {
      id: "amazonpay",
      name: "Amazon Pay",
      emoji: "🟠",
      desc: "Cashback offers",
    },
    {
      id: "mobikwik",
      name: "MobiKwik",
      emoji: "🔵",
      desc: "SuperCash rewards",
    },
  ];

  return (
    <div className="space-y-2.5">
      {WALLETS.map((wallet) => (
        <button
          key={wallet.id}
          type="button"
          onClick={() => onSelect(wallet.id)}
          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
            selected === wallet.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-100 hover:border-gray-200 bg-white"
          }`}
        >
          <span className="text-2xl">{wallet.emoji}</span>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium"
              style={{ color: selected === wallet.id ? "#528FF0" : "#374151" }}
            >
              {wallet.name}
            </p>
            <p className="text-xs text-gray-400">{wallet.desc}</p>
          </div>
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected === wallet.id
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300"
            }`}
          >
            {selected === wallet.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();

  // Read query params via TanStack Router
  const search = useSearch({ from: "/protected/checkout" });
  const checkoutType = ((search as Record<string, string>).type ??
    "bundle") as CheckoutType;
  const courseId = (search as Record<string, string>).courseId ?? "";
  const itemTitle =
    (search as Record<string, string>).title ||
    (checkoutType === "kit" ? "Heritage Starter Kit" : "Heritage Course");
  const priceParam = Number.parseInt(
    (search as Record<string, string>).price ?? "0",
    10,
  );

  // Prices
  const KIT_PRICE = 249900;
  const coursePrice =
    checkoutType === "bundle"
      ? priceParam - KIT_PRICE
      : checkoutType === "course"
        ? priceParam
        : 0;
  const kitPrice =
    checkoutType === "kit" || checkoutType === "bundle" ? KIT_PRICE : 0;
  const totalPrice = priceParam > 0 ? priceParam : coursePrice + kitPrice;

  const typeBadge =
    checkoutType === "bundle"
      ? "Course + Kit Bundle"
      : checkoutType === "kit"
        ? "Starter Kit"
        : "Course Only";

  // Payment state
  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  // Form state
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId] = useState(generateOrderId);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleFieldChange(name: string, val: string) {
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form, checkoutType, activeTab);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 2200));
    setIsProcessing(false);
    setIsSuccess(true);
  }

  function handleStartLearning() {
    if (courseId && checkoutType !== "kit") {
      navigate({ to: "/learn/$courseId", params: { courseId } });
    } else {
      navigate({ to: "/home" });
    }
  }

  const showShipping = checkoutType === "kit" || checkoutType === "bundle";

  const TABS: { id: PaymentTab; label: string; icon: React.ElementType }[] = [
    { id: "upi", label: "UPI", icon: Smartphone },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallets", label: "Wallets", icon: Wallet },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f5f7fa" }}
    >
      {/* ── Razorpay-style Header ────────────────────────────────────────── */}
      <div className="sticky top-0 z-20" style={{ background: "#1a1f36" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "oklch(0.60 0.12 185)" }}
            >
              CK
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">
              Choosen Kids
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span
              className="font-bold text-white text-base hidden sm:block"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatPrice(totalPrice)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Lock size={11} />
              <span className="hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              /* ── Success State ─────────────────────────────────────────── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg mx-auto text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
                  style={{ background: "oklch(0.92 0.10 165)" }}
                >
                  <CheckCircle2
                    size={36}
                    style={{ color: "oklch(0.45 0.14 165)" }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">
                    Payment Successful!
                  </h1>
                  <p className="text-charcoal/55 text-base mb-8 leading-relaxed">
                    Your order has been confirmed. You'll receive a confirmation
                    email shortly.
                  </p>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                        Order Summary
                      </p>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: "oklch(0.92 0.08 165)",
                          color: "oklch(0.40 0.12 165)",
                        }}
                      >
                        Confirmed
                      </span>
                    </div>
                    <p className="font-display text-lg font-semibold text-charcoal mb-1">
                      {itemTitle}
                    </p>
                    <p className="text-xs text-charcoal/40 mb-4">{typeBadge}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-sm text-charcoal/60">
                        Total Paid
                      </span>
                      <span className="font-display text-xl font-semibold text-charcoal">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-charcoal/40">
                        Order ID:{" "}
                        <span className="font-mono font-medium text-charcoal/60">
                          {orderId}
                        </span>
                      </p>
                    </div>
                  </div>

                  {showShipping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3 justify-center mb-6 px-4 py-3 rounded-xl"
                      style={{ background: "oklch(0.95 0.06 165)" }}
                    >
                      <Truck
                        size={16}
                        style={{ color: "oklch(0.45 0.14 165)" }}
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.40 0.12 165)" }}
                      >
                        Your starter kit ships within 24 hours
                      </p>
                    </motion.div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartLearning}
                    className="w-full py-4 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
                    style={{ background: "#528FF0" }}
                  >
                    {checkoutType === "kit" ? "Back to Home" : "Start Learning"}
                    <Star size={14} />
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Checkout Layout ───────────────────────────────────────── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-5 gap-6 items-start"
              >
                {/* ── Left: Order Summary (40%) ──────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Summary header */}
                    <div
                      className="px-6 py-5 border-b border-gray-50"
                      style={{ background: "#f8f9fc" }}
                    >
                      <p
                        className="text-xs font-semibold tracking-widest uppercase"
                        style={{ color: "#6b7280" }}
                      >
                        Order Summary
                      </p>
                    </div>

                    <div className="p-6">
                      {/* Item */}
                      <div className="pb-5 border-b border-gray-50 mb-5">
                        <h2
                          className="font-display text-lg font-semibold leading-snug mb-2"
                          style={{ color: "#1a1f36" }}
                        >
                          {itemTitle}
                        </h2>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: "oklch(0.94 0.06 185)",
                              color: "oklch(0.45 0.12 185)",
                            }}
                          >
                            {typeBadge}
                          </span>
                          {showShipping && (
                            <span
                              className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                              style={{
                                background: "oklch(0.92 0.08 165)",
                                color: "oklch(0.40 0.12 165)",
                              }}
                            >
                              <Truck size={10} />
                              Ships in 24h
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price breakdown */}
                      <div className="space-y-3 pb-5 border-b border-gray-50 mb-5">
                        {checkoutType !== "kit" && coursePrice > 0 && (
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#6b7280" }}>Course</span>
                            <span
                              className="font-medium"
                              style={{ color: "#1a1f36" }}
                            >
                              {formatPrice(coursePrice)}
                            </span>
                          </div>
                        )}
                        {kitPrice > 0 && (
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "#6b7280" }}>
                              Starter Kit
                            </span>
                            <span
                              className="font-medium"
                              style={{ color: "#1a1f36" }}
                            >
                              {formatPrice(kitPrice)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span style={{ color: "#6b7280" }}>Shipping</span>
                          <span className="text-emerald-600 font-medium text-xs">
                            Free
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-baseline">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "#374151" }}
                        >
                          Total
                        </span>
                        <span
                          className="font-display text-2xl font-bold"
                          style={{ color: "#1a1f36" }}
                        >
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <p
                      className="text-xs font-semibold tracking-widest uppercase mb-4"
                      style={{ color: "#9ca3af" }}
                    >
                      Why Trust Us
                    </p>
                    <div className="space-y-3">
                      {[
                        { icon: Shield, label: "256-bit SSL Encryption" },
                        {
                          icon: CheckCircle2,
                          label: "30-Day Money Back Guarantee",
                        },
                        { icon: Package, label: "Free Shipping Across India" },
                        { icon: QrCode, label: "Razorpay Secured Gateway" },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-3">
                          <Icon size={14} style={{ color: "#528FF0" }} />
                          <span
                            className="text-xs"
                            style={{ color: "#6b7280" }}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right: Payment Form (60%) ──────────────────────────── */}
                <div className="lg:col-span-3">
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                      <div
                        className="px-6 py-4 border-b border-gray-50"
                        style={{ background: "#f8f9fc" }}
                      >
                        <p
                          className="text-xs font-semibold tracking-widest uppercase"
                          style={{ color: "#6b7280" }}
                        >
                          Contact Details
                        </p>
                      </div>
                      <div className="p-6 space-y-4">
                        <RazorField
                          label="Full Name"
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Priya Sharma"
                          value={form.name}
                          onChange={handleChange}
                          autoComplete="name"
                          error={errors.name}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <RazorField
                            label="Email Address"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="priya@email.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            error={errors.email}
                          />
                          <RazorField
                            label="Phone Number"
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            error={errors.phone}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {showShipping && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                        <div
                          className="px-6 py-4 border-b border-gray-50"
                          style={{ background: "#f8f9fc" }}
                        >
                          <p
                            className="text-xs font-semibold tracking-widest uppercase"
                            style={{ color: "#6b7280" }}
                          >
                            Shipping Address
                          </p>
                        </div>
                        <div className="p-6">
                          <label
                            htmlFor="address"
                            className="block text-xs font-medium mb-1.5"
                            style={{ color: "oklch(0.42 0.01 250)" }}
                          >
                            Full Address
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            rows={3}
                            placeholder="House / Flat No., Street, City, State, PIN Code"
                            value={form.address}
                            onChange={handleChange}
                            autoComplete="street-address"
                            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-gray-300 bg-white resize-none ${
                              errors.address
                                ? "border-red-400 focus:ring-red-100 text-red-900"
                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-50 text-gray-800"
                            }`}
                          />
                          <FieldError message={errors.address} />
                        </div>
                      </div>
                    )}

                    {/* ── Razorpay Payment Tabs ─────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
                      {/* Tab header */}
                      <div
                        className="border-b border-gray-100"
                        style={{ background: "#f8f9fc" }}
                      >
                        <div className="flex">
                          {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-3.5 px-2 text-xs font-semibold transition-all border-b-2 relative"
                                style={{
                                  borderBottomColor: isActive
                                    ? "#528FF0"
                                    : "transparent",
                                  color: isActive ? "#528FF0" : "#9ca3af",
                                  background: isActive
                                    ? "white"
                                    : "transparent",
                                }}
                              >
                                <Icon size={13} />
                                <span className="hidden sm:inline">
                                  {tab.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tab content */}
                      <div className="p-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                          >
                            {activeTab === "upi" && (
                              <UPITab
                                upiId={form.upiId}
                                onChange={(val) =>
                                  handleFieldChange("upiId", val)
                                }
                                error={errors.upiId}
                              />
                            )}
                            {activeTab === "card" && (
                              <CardTab
                                form={form}
                                errors={errors}
                                onCardNumberChange={(val) =>
                                  handleFieldChange("cardNumber", val)
                                }
                                onExpiryChange={(val) =>
                                  handleFieldChange("expiry", val)
                                }
                                onFieldChange={handleFieldChange}
                              />
                            )}
                            {activeTab === "netbanking" && (
                              <NetBankingTab
                                selected={selectedBank}
                                onSelect={setSelectedBank}
                              />
                            )}
                            {activeTab === "wallets" && (
                              <WalletsTab
                                selected={selectedWallet}
                                onSelect={setSelectedWallet}
                              />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Pay button */}
                      <div className="px-6 pb-6">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
                          style={{ background: "#528FF0" }}
                        >
                          {isProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Processing your payment…
                            </>
                          ) : (
                            <>
                              <Lock size={15} />
                              Pay {formatPrice(totalPrice)}
                            </>
                          )}
                        </button>

                        <p
                          className="text-center text-xs mt-3 flex items-center justify-center gap-1.5"
                          style={{ color: "#9ca3af" }}
                        >
                          <Lock size={10} />
                          Secured by Razorpay · 256-bit SSL
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
