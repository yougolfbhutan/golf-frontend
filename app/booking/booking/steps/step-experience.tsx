"use client";

import { RadioGroup } from "@/components/ui/radio-group";
import { ADDONS, type ExtraKey } from "../booking-data";
import { addonPrice, formatMoney, type StepProps } from "../booking-logic";
import { Question, RadioCard } from "../ui-parts";

export function StepExperience({ state, update }: StepProps) {
  const isNew = state.level === "newbie";
  const isVisitor = state.who === "Non-Bhutanese";

  const has = (key: ExtraKey) => state.addons.includes(key);

  function setAddon(key: ExtraKey, on: boolean) {
    const without = state.addons.filter((a) => a !== key);
    update({ addons: on ? [...without, key] : without });
  }

  function handleNewChange(value: string) {
    const level = value === "yes" ? "newbie" : "established";

    update({
      level,
      ownGear: level === "established", // regular players usually bring clubs
      // Coaching is only offered to new golfers, so drop it if they say no.
      // Their golf set, accessories and companion are left untouched.
      addons:
        level === "newbie"
          ? state.addons
          : state.addons.filter((a) => a !== "coaching"),
    });
  }

  function priceText(key: ExtraKey) {
    return state.who
      ? ` ${formatMoney(state.who, addonPrice(state, key))} per golfer.`
      : "";
  }

  return (
    <>
      <Question id="new-label" label="Are you new to golf?">
        <RadioGroup
          aria-labelledby="new-label"
          value={state.level === "newbie" ? "yes" : state.level ? "no" : ""}
          onValueChange={handleNewChange}
          className="grid gap-3 sm:grid-cols-2"
        >
          <RadioCard
            id="new-yes"
            value="yes"
            title="Yes"
            description="First time, or just a few rounds."
          />
          <RadioCard
            id="new-no"
            value="no"
            title="No"
            description="I play regularly."
          />
        </RadioGroup>
      </Question>

      {isNew && (
        <Question id="coaching-label" label="Would you like coaching?">
          <RadioGroup
            aria-labelledby="coaching-label"
            value={has("coaching") ? "yes" : "no"}
            onValueChange={(v) => setAddon("coaching", v === "yes")}
            className="grid gap-3 sm:grid-cols-2"
          >
            <RadioCard
              id="coaching-yes"
              value="yes"
              title="Yes"
              description={`${ADDONS.coaching.description}.${priceText("coaching")}`}
            />
            <RadioCard
              id="coaching-no"
              value="no"
              title="No"
              description="I'll play without a coach."
            />
          </RadioGroup>
        </Question>
      )}

      {isVisitor && (
        <Question id="companion-label" label="Will a companion join you?">
          <RadioGroup
            aria-labelledby="companion-label"
            value={has("companion") ? "yes" : "no"}
            onValueChange={(v) => setAddon("companion", v === "yes")}
            className="grid gap-3 sm:grid-cols-2"
          >
            <RadioCard
              id="companion-yes"
              value="yes"
              title="Yes"
              description={`${ADDONS.companion.description}.${priceText("companion")}`}
            />
            <RadioCard
              id="companion-no"
              value="no"
              title="No"
              description="Just the golfers."
            />
          </RadioGroup>
        </Question>
      )}
    </>
  );
}