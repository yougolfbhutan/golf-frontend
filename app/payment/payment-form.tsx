"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Smartphone, CreditCard } from "lucide-react";
import * as Yup from "yup";
import { AmexIcon, MastercardIcon, MoreBadge, UpiIcon, VisaIcon } from "./payment-icon";

export type Method = "card" | "shop" | "phonepe";

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentPayload {
  method: Method;
  orderId: string;
  amount: number;
  currency: string;
  customer?: Customer;
  sameAsShipping: boolean;
}

export interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency?: string;
  customer?: Customer;
  /** Called when "Pay now" is clicked. Throw an Error to show a message. */
  onPay: (payload: PaymentPayload) => Promise<void>;
}

/* ---------------- validation ---------------- */

const digitsOnly = (s?: string) => (s ?? "").replace(/\D/g, "");

const luhn = (num: string) => {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const cardSchema = Yup.object({
  number: Yup.string()
    .required("Enter your card number")
    .test("length", "Card number must be 13 to 19 digits", (v) =>
      /^\d{13,19}$/.test(digitsOnly(v))
    )
    .test("luhn", "Card number is not valid", (v) => {
      const d = digitsOnly(v);
      return !/^\d{13,19}$/.test(d) || luhn(d);
    }),
  expiry: Yup.string()
    .required("Enter the expiration date")
    .test("format", "Use the format MM / YY", (v) => {
      const d = digitsOnly(v);
      const month = Number(d.slice(0, 2));
      return d.length === 4 && month >= 1 && month <= 12;
    })
    .test("future", "This card has expired", (v) => {
      const d = digitsOnly(v);
      if (d.length !== 4) return true;
      const month = Number(d.slice(0, 2));
      const year = 2000 + Number(d.slice(2));
      const now = new Date();
      return (
        year > now.getFullYear() ||
        (year === now.getFullYear() && month >= now.getMonth() + 1)
      );
    }),
  cvc: Yup.string()
    .required("Enter the security code")
    .matches(/^\d{3,4}$/, "Must be 3 or 4 digits"),
  name: Yup.string().trim().required("Enter the name on card").min(2, "Enter the full name"),
});

type CardFields = { number: string; expiry: string; cvc: string; name: string };
type CardErrors = Partial<Record<keyof CardFields, string>>;

const formatters: Record<keyof CardFields, (v: string) => string> = {
  number: (v) => digitsOnly(v).slice(0, 19).replace(/(.{4})/g, "$1 ").trim(),
  expiry: (v) => {
    const d = digitsOnly(v).slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  },
  cvc: (v) => digitsOnly(v).slice(0, 4),
  name: (v) => v,
};

/* ---------------- small UI pieces ---------------- */

const inputCls = (hasError: boolean) =>
  `h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "border-slate-300 focus:border-[#0E9F4F] focus:ring-[#0E9F4F]/15"
  }`;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function MethodTile({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-1 items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
        active
          ? "border-[#0E9F4F] bg-[#0E9F4F]/5 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active ? "bg-[#0E9F4F] text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="block truncate text-xs text-slate-500">{subtitle}</span>
      </span>
    </button>
  );
}

/* ---------------- component ---------------- */

export default function PaymentForm({
  orderId,
  amount,
  currency = "INR",
  customer,
  onPay,
}: PaymentFormProps) {
  const [method, setMethod] = useState<Method>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<CardFields>({ number: "", expiry: "", cvc: "", name: "" });
  const [errors, setErrors] = useState<CardErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (values: CardFields, m: Method = method): CardErrors => {
    if (m !== "card") return {};
    try {
      cardSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (e) {
      const out: CardErrors = {};
      (e as Yup.ValidationError).inner.forEach((err) => {
        const key = err.path as keyof CardFields;
        if (key && !out[key]) out[key] = err.message;
      });
      return out;
    }
  };

  const update = (key: keyof CardFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...card, [key]: formatters[key](e.target.value) };
    setCard(next);
    if (submitted) setErrors(validate(next));
  };

  const selectMethod = (m: Method) => {
    setMethod(m);
    setErrors({});
    setSubmitted(false);
    setError(null);
  };

  const handlePay = async () => {
    setSubmitted(true);
    const found = validate(card);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      // Card details are intentionally NOT sent: use your gateway's
      // hosted fields / SDK so raw card data never touches your server.
      await onPay({ method, orderId, amount, currency, customer, sameAsShipping: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Payment method</h2>
      <p className="mt-1 text-sm text-slate-500">Choose how you would like to pay.</p>

      {/* method tiles */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <MethodTile
          active={method === "card"}
          onClick={() => selectMethod("card")}
          icon={<CreditCard className="h-5 w-5" />}
          title="Credit / debit card"
          subtitle="Visa, Mastercard, Amex"
        />
        <MethodTile
          active={method === "phonepe"}
          onClick={() => selectMethod("phonepe")}
          icon={<Smartphone className="h-5 w-5" />}
          title="PhonePe / UPI"
          subtitle="UPI, cards, EMI, NetBanking"
        />
      </div>

      {/* card form */}
      {method === "card" && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-1.5">
            <VisaIcon /> <MastercardIcon /> <AmexIcon /> <MoreBadge count={5} />
          </div>

          <Field label="Card number" error={errors.number}>
            <div className="relative">
              <input
                className={`${inputCls(!!errors.number)} pr-11`}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                autoComplete="cc-number"
                value={card.number}
                onChange={update("number")}
              />
              <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry date" error={errors.expiry}>
              <input
                className={inputCls(!!errors.expiry)}
                placeholder="MM / YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={card.expiry}
                onChange={update("expiry")}
              />
            </Field>
            <Field label="Security code" error={errors.cvc}>
              <input
                className={inputCls(!!errors.cvc)}
                placeholder="CVC"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={card.cvc}
                onChange={update("cvc")}
              />
            </Field>
          </div>

          <Field label="Name on card" error={errors.name}>
            <input
              className={inputCls(!!errors.name)}
              placeholder="As shown on the card"
              autoComplete="cc-name"
              value={card.name}
              onChange={update("name")}
            />
          </Field>
        </div>
      )}

      {/* PhonePe info */}
      {method === "phonepe" && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <UpiIcon />
          <p className="text-sm leading-relaxed text-slate-600">
            You will be redirected to PhonePe to finish your payment securely. Come
            back here automatically once it is done.
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#2DBE6C] to-[#0E9F4F] text-base font-bold text-white shadow-[0_12px_24px_-8px_rgba(14,159,79,0.6)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0E9F4F]/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Lock className="h-4 w-4" />
        {loading ? "Processing…" : `Pay ${currency} ${amount.toLocaleString()}`}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="h-4 w-4 text-[#0E9F4F]" />
        All transactions are secure and encrypted.
      </p>
    </section>
  );
}