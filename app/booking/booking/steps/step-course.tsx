"use client";

import { RadioGroup } from "@/components/ui/radio-group";
import type { Passport, Who } from "../booking-data";
import { formatMoney, roundPrice, type StepProps } from "../booking-logic";
import { Question, RadioCard } from "../ui-parts";

export function StepCourse({ state, update }: StepProps) {
  const price =
    state.who && roundPrice(state) > 0
      ? `${formatMoney(state.who, roundPrice(state))} per golfer`
      : "";

  function handleWhoChange(value: string) {
    const who = value as Who;

    update({
      who,
      // Bhutanese don't need a passport. Visitors must choose SAARC / non-SAARC,
      // so start them with nothing selected.
      passport: who === state.who ? state.passport : "",
      payment: {
        ...state.payment,
        // Bhutanese pay with DK Bank; visitors can't keep that method.
        method:
          who === "Bhutanese"
            ? "dk"
            : state.payment.method === "dk"
              ? "card"
              : state.payment.method,
      },
    });
  }

  return (
    <>
      <Question id="who-label" label="Who's playing?">
        <RadioGroup
          aria-labelledby="who-label"
          value={state.who}
          onValueChange={handleWhoChange}
          className="grid gap-3 sm:grid-cols-2"
        >
          <RadioCard
            id="who-local"
            value="Bhutanese"
            title="Bhutanese"
            description="Prices in Ngultrum"
          />
          <RadioCard
            id="who-visitor"
            value="Non-Bhutanese"
            title="Non-Bhutanese"
            description="Prices in US dollars"
          />
        </RadioGroup>
      </Question>

      {state.who === "Non-Bhutanese" && (
        <Question id="passport-label" label="Are you from a SAARC country?">
          <RadioGroup
            aria-labelledby="passport-label"
            value={state.passport}
            onValueChange={(v) => update({ passport: v as Passport })}
            className="grid gap-3 sm:grid-cols-2"
          >
            <RadioCard
              id="pass-saarc"
              value="saarc"
              title="SAARC"
              description="India, Bangladesh, Nepal, Sri Lanka, Maldives, Pakistan, Afghanistan"
            />
            <RadioCard
              id="pass-intl"
              value="intl"
              title="Non-SAARC"
              description="All other countries"
            />
          </RadioGroup>
        </Question>
      )}

      {price && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {price}
        </p>
      )}
    </>
  );
}