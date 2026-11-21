"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Oswald } from "next/font/google";
import PaymentForm, { type PaymentPayload } from "./payment-form";
import { useCheckout } from "@/app/context/checkout-context";
import { golfBooking } from "@/app/booking/bulk-booking/data"; // adjust path
import OrderSummary from "../booking/bulk-booking/components/order-summary";

const condensed = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });

const STEPS = ["Booking", "Payment", "Done"];

export default function Page() {
  const { checkout } = useCheckout();
  const router = useRouter();

  // refreshed or opened directly: no booking data, so go back
  useEffect(() => {
    if (!checkout) router.replace("/");
  }, [checkout, router]);

  const handlePay = async (payload: PaymentPayload) => {
    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Could not start payment");
    window.location.href = data.redirectUrl;
  };

  if (!checkout) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9ECEF] to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* top bar */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-[#0E9F4F]"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit booking
            </button>
            <h1
              className={`${condensed.className} text-4xl font-bold uppercase leading-none tracking-tight text-slate-900 sm:text-5xl`}
            >
              Secure <span className="text-[#0E9F4F]">checkout</span>
            </h1>
          </div>

          {/* progress */}
          <ol className="flex items-center gap-2 text-xs font-semibold">
            {STEPS.map((s, i) => {
              const done = i < 1;
              const current = i === 1;
              return (
                <li key={s} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                      done || current
                        ? "bg-[#0E9F4F] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={current || done ? "text-slate-900" : "text-slate-400"}>
                    {s}
                  </span>
                  {i < STEPS.length - 1 && <span className="h-px w-6 bg-slate-300" />}
                </li>
              );
            })}
          </ol>
        </div>

        {/* summary first on mobile, right column on desktop */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="order-2 lg:order-1">
            <PaymentForm
              orderId={checkout.orderId}
              amount={checkout.summary.total}
              currency="USD"
              customer={{
                name: checkout.user.name ?? "",
                email: checkout.user.email ?? "",
                phone: checkout.user.phone_no ?? "",
              }}
              onPay={handlePay}
            />
          </div>

          <div className="order-1 lg:order-2">
            <OrderSummary
              cfg={golfBooking}
              values={checkout.values}
              summary={checkout.summary}
            />
          </div>
        </div>
      </div>
    </main>
  );
}