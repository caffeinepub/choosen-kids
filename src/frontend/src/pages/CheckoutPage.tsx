import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  Shield,
  Star,
  Truck,
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

// ── Validation ───────────────────────────────────────────────────────────────

function validateForm(data: FormData, checkoutType: CheckoutType): FormErrors {
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

  const cardClean = data.cardNumber.replace(/\s/g, "");
  if (!cardClean) errors.cardNumber = "Card number is required";
  else if (!/^\d{16}$/.test(cardClean))
    errors.cardNumber = "Please enter a valid 16-digit card number";

  if (!data.expiry) errors.expiry = "Expiry date is required";
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry))
    errors.expiry = "Use MM/YY format";

  if (!data.cvv) errors.cvv = "CVV is required";
  else if (!/^\d{3,4}$/.test(data.cvv)) errors.cvv = "Enter 3 or 4 digits";

  return errors;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TrustBadge({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} style={{ color: "oklch(0.60 0.12 185)" }} />
      <span className="text-xs text-charcoal/60">{label}</span>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs mt-1" style={{ color: "oklch(0.50 0.20 25)" }}>
      {message}
    </p>
  );
}

function InputField({
  label,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
}) {
  const { error, ...inputProps } = props as typeof props & { error?: string };
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-charcoal/60 mb-1.5 tracking-wide uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-charcoal bg-white transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-charcoal/25 ${
          error
            ? "border-red-300 focus:ring-red-100"
            : "border-gray-200 focus:border-teal focus:ring-teal/10"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();

  // Read query params
  const params = new URLSearchParams(window.location.search);
  const checkoutType = (params.get("type") ?? "bundle") as CheckoutType;
  const courseId = params.get("courseId") ?? "";
  const itemTitle =
    params.get("title") ??
    (checkoutType === "kit" ? "Heritage Starter Kit" : "Heritage Course");
  const priceParam = Number.parseInt(params.get("price") ?? "0", 10);

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

  // Form state
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
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

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form, checkoutType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }
    setIsProcessing(true);
    // Simulate payment processing
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.99 0.004 80)" }}
    >
      {/* Header bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <p className="font-display text-lg font-semibold text-charcoal tracking-tight">
            Choosen Kids
          </p>
          <div className="flex items-center gap-1.5 text-xs text-charcoal/40">
            <Lock size={12} />
            Secure Checkout
          </div>
        </div>
      </div>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto">
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

                  {/* Order Summary */}
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
                    className="w-full py-4 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: "oklch(0.65 0.12 85)" }}
                  >
                    {checkoutType === "kit" ? "Back to Home" : "Start Learning"}
                    <Star size={14} />
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Checkout Form ─────────────────────────────────────────── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-5 gap-10 items-start"
              >
                {/* ── Left: Order Summary ─────────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Order Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <p className="text-xs uppercase tracking-widest text-charcoal/40 font-medium mb-5">
                      Order Summary
                    </p>

                    {/* Item */}
                    <div className="pb-5 border-b border-gray-50">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="font-display text-lg font-semibold text-charcoal leading-snug">
                            {itemTitle}
                          </h2>
                          <span
                            className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium"
                            style={{
                              background: "oklch(0.94 0.06 185)",
                              color: "oklch(0.45 0.12 185)",
                            }}
                          >
                            {typeBadge}
                          </span>
                        </div>
                        {showShipping && (
                          <div
                            className="flex-shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: "oklch(0.92 0.08 165)",
                              color: "oklch(0.40 0.12 165)",
                            }}
                          >
                            <Truck size={10} />
                            24h Ship
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className="py-5 space-y-3 border-b border-gray-50">
                      {checkoutType !== "kit" && coursePrice > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal/55">Course</span>
                          <span className="font-medium text-charcoal">
                            {formatPrice(coursePrice)}
                          </span>
                        </div>
                      )}
                      {kitPrice > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal/55">Starter Kit</span>
                          <span className="font-medium text-charcoal">
                            {formatPrice(kitPrice)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/55">Shipping</span>
                        <span className="text-emerald-600 font-medium text-xs">
                          Free
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-5 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-charcoal">
                        Total
                      </span>
                      <span className="font-display text-2xl font-semibold text-charcoal">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="space-y-3">
                      <TrustBadge icon={Shield} label="Secure Payment" />
                      <TrustBadge
                        icon={CheckCircle2}
                        label="30-Day Guarantee"
                      />
                      <TrustBadge icon={Package} label="Free Shipping" />
                      <TrustBadge icon={Star} label="4.9 Rated Platform" />
                    </div>
                  </div>
                </div>

                {/* ── Right: Payment Form ─────────────────────────────── */}
                <div className="lg:col-span-3">
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                      <p className="text-xs uppercase tracking-widest text-charcoal/40 font-medium mb-5">
                        Personal Information
                      </p>
                      <div className="space-y-4">
                        <InputField
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
                          <InputField
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
                          <InputField
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
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                        <p className="text-xs uppercase tracking-widest text-charcoal/40 font-medium mb-5">
                          Shipping Address
                        </p>
                        <div>
                          <label
                            htmlFor="address"
                            className="block text-xs font-medium text-charcoal/60 mb-1.5 tracking-wide uppercase"
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
                            className={`w-full px-4 py-3 rounded-xl border text-sm text-charcoal bg-white transition-all outline-none focus:ring-2 focus:ring-offset-0 placeholder:text-charcoal/25 resize-none ${
                              errors.address
                                ? "border-red-300 focus:ring-red-100"
                                : "border-gray-200 focus:border-teal focus:ring-teal/10"
                            }`}
                          />
                          <FieldError message={errors.address} />
                        </div>
                      </div>
                    )}

                    {/* Card Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-xs uppercase tracking-widest text-charcoal/40 font-medium">
                          Card Details
                        </p>
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={14} className="text-charcoal/30" />
                          <span className="text-xs text-charcoal/30">
                            Visa / MC / Amex
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <InputField
                          label="Card Number"
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={form.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setForm((prev) => ({
                              ...prev,
                              cardNumber: formatted,
                            }));
                            if (errors.cardNumber)
                              setErrors((prev) => ({
                                ...prev,
                                cardNumber: undefined,
                              }));
                          }}
                          inputMode="numeric"
                          autoComplete="cc-number"
                          error={errors.cardNumber}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="Expiry (MM/YY)"
                            id="expiry"
                            name="expiry"
                            type="text"
                            placeholder="12/27"
                            value={form.expiry}
                            onChange={(e) => {
                              const formatted = formatExpiry(e.target.value);
                              setForm((prev) => ({
                                ...prev,
                                expiry: formatted,
                              }));
                              if (errors.expiry)
                                setErrors((prev) => ({
                                  ...prev,
                                  expiry: undefined,
                                }));
                            }}
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            error={errors.expiry}
                          />
                          <InputField
                            label="CVV"
                            id="cvv"
                            name="cvv"
                            type="text"
                            placeholder="123"
                            value={form.cvv}
                            onChange={handleChange}
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            maxLength={4}
                            error={errors.cvv}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 rounded-full text-base font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-3 shadow-md"
                      style={{ background: "oklch(0.65 0.12 85)" }}
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
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Processing payment...
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          Complete Purchase — {formatPrice(totalPrice)}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-charcoal/35 flex items-center justify-center gap-1.5">
                      <Lock size={10} />
                      Secured by Stripe · SSL Encrypted
                    </p>
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
