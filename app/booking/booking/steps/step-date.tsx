"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup } from "@/components/ui/radio-group";
import { MAX_PLAYERS, SLOTS, type SlotId } from "../booking-data";
import { earliestDate, toISODate, type StepProps } from "../booking-logic";
import { FieldError, Question, RadioCard, StepHeading } from "../ui-parts";

// Parse "YYYY-MM-DD" as a local date (avoids timezone shifts)
function fromISODate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function StepDate({ state, update, errors }: StepProps) {
  // Built after mount so server and browser render the same HTML.
  const [minDate, setMinDate] = useState<Date | null>(null);

  useEffect(() => {
    setMinDate(earliestDate());
  }, []);

  const selected = fromISODate(state.date);

  return (
    <>
      <StepHeading>When would you like to play?</StepHeading>

      <Question id="date-label" label="Pick a date">
        {minDate && (
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => d && update({ date: toISODate(d) })}
            defaultMonth={selected ?? minDate}
            disabled={{ before: minDate }}
            className="rounded-xl border-2 border-border bg-card"
          />
        )}
        <FieldError message={errors.date} />
      </Question>

      <Question id="slot-label" label="Tee time">
        <RadioGroup
          aria-labelledby="slot-label"
          value={state.slot}
          onValueChange={(v) => update({ slot: v as SlotId })}
          className="grid gap-3 sm:grid-cols-3"
        >
          {SLOTS.map((s) => (
            <RadioCard
              key={s.id}
              id={`slot-${s.id}`}
              value={s.id}
              title={s.id}
              description={
                <>
                  {s.time}
                  <br />
                  {s.description}
                </>
              }
            />
          ))}
        </RadioGroup>
      </Question>

    </>
  );
}