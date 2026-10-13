"use client";

import { createContext, useContext, useState } from "react";

/** What the home-page search hands over to the booking page. */
export type BookingDraft = {
  courseId: string;
  categoryId: string;
  golfers: number;
  date: string; // "yyyy-MM-dd"
  time?: string; // only if the search ever picks a tee time
  step: number; // the step to open on (it's capped to what's filled in)
};

type BookingDraftContextValue = {
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft | null) => void;
};

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  return (
    <BookingDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </BookingDraftContext.Provider>
  );
}

export function useBookingDraft() {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) {
    throw new Error("useBookingDraft must be used inside <BookingDraftProvider>");
  }
  return ctx;
}