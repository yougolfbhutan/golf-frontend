"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useAuth } from "@/app/context/auth-context";
import type { BookingSummary, BookingValues } from "../booking/bulk-booking/components/booking-from";

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

export type Checkout = {
  orderId: string;
  values: BookingValues;
  summary: BookingSummary;
  user: AuthUser;
};

type Ctx = {
  checkout: Checkout | null;
  setCheckout: (c: Checkout | null) => void;
};

const CheckoutContext = createContext<Ctx | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  return (
    <CheckoutContext.Provider value={{ checkout, setCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside <CheckoutProvider>");
  return ctx;
}