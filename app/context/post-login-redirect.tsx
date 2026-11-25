"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useCheckout } from "@/app/context/checkout-context";
import { isSystemUser } from "@/app/src/lib/auth/auth-roles";

export const PENDING_KEY = "pendingCheckout";
const MAX_AGE = 10 * 60 * 1000; // ignore saved bookings older than 10 minutes

export function PostLoginRedirect() {
  const { user } = useAuth();
  const { setCheckout } = useCheckout();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_KEY);

    try {
      const { orderId, values, summary, ts } = JSON.parse(raw);
      if (Date.now() - ts > MAX_AGE) return;

      if (isSystemUser(user)) {
        router.replace("/dashboard");
        return;
      }

      setCheckout({ orderId, values, summary, user });
      router.replace("/payment");
    } catch {
      /* corrupted data: ignore */
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}