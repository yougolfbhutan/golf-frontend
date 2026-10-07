"use client";

import { Button } from "@/components/ui/button";
import { bookingTotal, courseOf, formatDate, formatMoney, type BookingState } from "../booking-logic";

export function Confirmation({ state, reference, onNewBooking }: { state: BookingState; reference: string; onNewBooking: () => void }) {
  return (
    <div role="status" className="py-6 text-center">
      <svg viewBox="0 0 96 96" className="mx-auto mb-4 size-24" aria-hidden="true">
        <circle cx="48" cy="48" r="44" fill="var(--accent)" />
        <path d="M40 70V22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M42 24l26 9-26 9z" fill="var(--primary)" />
        <ellipse cx="48" cy="72" rx="20" ry="4" fill="currentColor" opacity=".25" />
      </svg>
      <h2 id="step-heading" tabIndex={-1} className="font-heading text-4xl font-extrabold outline-none">
        You&apos;re booked
      </h2>
      <p className="mt-3">Your booking reference</p>
      <p className="mx-auto mt-2 inline-block rounded-lg border-2 border-dashed border-primary px-4 py-1 text-xl font-bold tracking-wider">{reference}</p>
      <p className="mx-auto mt-4 max-w-md">
        {state.players} golfer{state.players > 1 ? "s" : ""} at {courseOf(state)?.name} on {formatDate(state.date, true)}, {state.slot.toLowerCase()}. Paid{" "}
        {formatMoney(state.who, bookingTotal(state))}
        {state.payment.method === "dk" ? " with DK Bank" : " by card"}.
      </p>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">We&apos;ll email your booking and call you the day before to confirm your tee time.</p>
      <Button type="button" variant="outline" size="lg" className="mt-6 h-14 border-2 px-6 text-base" onClick={onNewBooking}>
        Book another round
      </Button>
    </div>
  );
}
