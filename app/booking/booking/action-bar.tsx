"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Scorecard } from "./scorecard";
import { bookingTotal, formatMoney, type BookingState } from "./booking-logic";

interface ActionBarProps {
  state: BookingState;
  nextLabel: string;
  busy: boolean;
  onBack: () => void;
  onNext: () => void;
}

/** Always-visible bar: Back, running total, Next. On phones the total opens the scorecard. */
export function ActionBar({ state, nextLabel, busy, onBack, onNext }: ActionBarProps) {
  const total = formatMoney(state.who, bookingTotal(state));
  return (
    <div className="sticky bottom-0 z-30 mt-8 border-t-2 border-border bg-background/95 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className={state.step === 1 ? "invisible" : "h-14 border-2 px-4 text-base"}
        >
          <ChevronLeft className="size-5" aria-hidden="true" /> Back
        </Button>

        <div className="ml-auto text-right lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="rounded-md px-2 py-1 text-right leading-tight">
                <span className="block text-sm text-muted-foreground">Total</span>
                <strong className="block font-heading text-2xl font-extrabold">{total}</strong>
                <span className="block text-sm font-bold underline decoration-primary decoration-2 underline-offset-2">See details</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-4">
              <SheetHeader className="p-0">
                <SheetTitle className="sr-only">Your booking summary</SheetTitle>
              </SheetHeader>
              <Scorecard state={state} className="shadow-none" />
            </SheetContent>
          </Sheet>
        </div>
        <div className="ml-auto hidden text-right leading-tight lg:block">
          <span className="block text-sm text-muted-foreground">Total</span>
          <strong className="font-heading text-3xl font-extrabold">{total}</strong>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={onNext}
          disabled={busy}
          className="h-14 min-w-0 flex-1 whitespace-nowrap px-5 text-base font-bold sm:max-w-[280px] sm:flex-none sm:min-w-[220px] sm:text-lg"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}