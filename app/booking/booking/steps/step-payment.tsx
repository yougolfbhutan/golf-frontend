"use client";

import { useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// FUTURE (banking): bring these back together with the payment block below
// import { RadioGroup } from "@/components/ui/radio-group";
import {
  bookingLines,
  bookingTotal,
  courseOf,
  formatDate,
  formatMoney,
  type BookingState,
  type StepProps,
} from "../booking-logic";
import { FieldError, Question, StepHeading } from "../ui-parts";
// FUTURE (banking): import { RadioCard } from "../ui-parts";
import type { Step } from "../booking-data";
import { useEquipmentLines } from "../../booking-helper/use-euipment-lines";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** Longest special request we accept */
const MAX_REQUEST = 500;

export function StepPayment({
  state,
  update,
  errors,
  goTo,
}: StepProps & { goTo: (step: Step) => void }) {
  const setDetails = (patch: Partial<BookingState["details"]>) =>
    update({ details: { ...state.details, ...patch } });

  // FUTURE (banking):
  // const setPayment = (patch: Partial<BookingState["payment"]>) =>
  //   update({ payment: { ...state.payment, ...patch } });

  // Equipment (set + accessories x quantity) comes from the same hook as the Scorecard
  const { lines: equipmentLines, total: equipmentTotal } =
    useEquipmentLines(state);

  let kit = [
    ...bookingLines(state)
      .slice(1)
      .map((l) => l.label),
    ...equipmentLines.map((l) => (l.qty > 1 ? `${l.label} ×${l.qty}` : l.label)),
  ].join(", ");
  if (state.ownGear)
    kit = `Bringing my own equipment${kit ? `, plus ${kit}` : ""}`;

  const grandTotal = bookingTotal(state) + equipmentTotal;
  const request = state.details.specialRequests ?? "";

  const review: { label: string; value: string; step: Step }[] = [
    {
      label: "Course",
      value: courseOf(state)?.name ?? "Course not selected",
      step: 1,
    },
    {
      label: "Experience",
      value: state.level === "newbie" ? "New to golf" : "Plays regularly",
      step: 2,
    },
    { label: "Equipment and add-ons", value: kit || "Nothing extra", step: 3 },
    {
      label: "When",
      value: `${formatDate(state.date, true)}, ${state.slot.toLowerCase()}, ${state.players} golfer${state.players > 1 ? "s" : ""}`,
      step: 4,
    },
  ];

  return (
    <>
      <StepHeading>Check and confirm</StepHeading>

      <div className="mt-5 overflow-hidden rounded-xl border-2 border-border">
        {review.map((r) => (
          <div
            key={r.label}
            className="flex items-start justify-between gap-4 border-b border-border px-4 py-3"
          >
            <div>
              <p className="text-sm font-bold text-muted-foreground">
                {r.label}
              </p>
              <p>{r.value}</p>
            </div>
            <button
              type="button"
              onClick={() => goTo(r.step)}
              className="shrink-0 rounded px-1 py-1 font-bold underline decoration-primary decoration-2 underline-offset-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
            >
              Change<span className="sr-only"> {r.label.toLowerCase()}</span>
            </button>
          </div>
        ))}
        <div className="flex items-baseline justify-between bg-accent px-4 py-3">
          <p className="font-bold">Total</p>
          <p className="font-heading text-2xl font-extrabold">
            {formatMoney(state.who, grandTotal)}
          </p>
        </div>
      </div>

      <Question id="details-label" label="Your details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Full name" error={errors.name}>
            <Input
              id="name"
              autoComplete="name"
              value={state.details.name}
              onChange={(e) => setDetails({ name: e.target.value })}
              aria-invalid={!!errors.name}
              className="h-12 border-2 text-base"
            />
          </Field>

          <Field id="phone" label="Mobile number" error={errors.phone}>
            <PhoneInput
              id="phone"
              value={state.details.phone}
              onChange={(phone) => setDetails({ phone })}
              invalid={!!errors.phone}
            />
          </Field>

          <Field
            id="email"
            label="Email"
            error={errors.email}
            className="sm:col-span-2"
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={state.details.email}
              onChange={(e) => setDetails({ email: e.target.value })}
              aria-invalid={!!errors.email}
              className="h-12 border-2 text-base"
            />
          </Field>

          {/* Special requests: long text */}
          <Field
            id="specialRequests"
            label="Special requests (optional)"
            className="sm:col-span-2"
          >
            <Textarea
              id="specialRequests"
              rows={5}
              maxLength={MAX_REQUEST}
              placeholder="Tell us anything that helps: early tee-off, a caddie who speaks your language, mobility needs, a birthday or group celebration…"
              value={request}
              onChange={(e) => setDetails({ specialRequests: e.target.value })}
              aria-describedby="specialRequests-hint"
              className="min-h-32 resize-y border-2 text-base leading-relaxed"
            />
            <div
              id="specialRequests-hint"
              className="mt-1.5 flex items-center justify-between gap-3 text-sm text-muted-foreground"
            >
              <span>We&apos;ll do our best to arrange it. Not guaranteed.</span>
              <span
                className={
                  request.length >= MAX_REQUEST ? "font-semibold text-destructive" : ""
                }
                aria-live="polite"
              >
                {request.length}/{MAX_REQUEST}
              </span>
            </div>
          </Field>
        </div>
      </Question>

      {/* ------------------------------------------------------------------
          FUTURE (banking): payment block kept for later. To turn it on:
          1. uncomment the imports and setPayment above
          2. uncomment this block
          3. stop filtering dk/card errors in BookYourRound's pay()
          ------------------------------------------------------------------ */}
      {/* <Question id="pay-label" label="How would you like to pay?">
        <RadioGroup
          aria-labelledby="pay-label"
          value={state.payment.method}
          onValueChange={(v) => setPayment({ method: v as BookingState["payment"]["method"] })}
          className="grid gap-3 sm:grid-cols-2"
        >
          <RadioCard
            id="pay-dk"
            value="dk"
            title={
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-md bg-foreground text-xs font-bold text-background">DK</span>
                DK Bank
              </span>
            }
            description="Approve in the DK Bank mobile app"
          />
          {state.who === "visitor" && <RadioCard id="pay-card" value="card" title="Visa or Mastercard" description="For international visitors" />}
        </RadioGroup>

        <div className="mt-4 rounded-xl bg-accent p-4">
          {state.payment.method === "dk" ? (
            <Field id="dk" label="DK Bank account or registered mobile number" error={errors.dk}>
              <Input id="dk" inputMode="numeric" placeholder="e.g. 17 123 456" value={state.payment.dkAccount} onChange={(e) => setPayment({ dkAccount: e.target.value })} aria-invalid={!!errors.dk} className="h-12 border-2 bg-card text-base" />
              <p className="mt-2 text-muted-foreground">After you tap Pay, approve the request in your DK Bank app.</p>
            </Field>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="card-number" label="Card number" className="sm:col-span-2">
                <Input id="card-number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={state.payment.cardNumber} onChange={(e) => setPayment({ cardNumber: e.target.value })} aria-invalid={!!errors.card} className="h-12 border-2 bg-card text-base" />
              </Field>
              <Field id="card-exp" label="Expiry">
                <Input id="card-exp" autoComplete="cc-exp" placeholder="MM/YY" value={state.payment.cardExpiry} onChange={(e) => setPayment({ cardExpiry: e.target.value })} className="h-12 border-2 bg-card text-base" />
              </Field>
              <Field id="card-cvc" label="Security code">
                <Input id="card-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={state.payment.cardCvc} onChange={(e) => setPayment({ cardCvc: e.target.value })} className="h-12 border-2 bg-card text-base" />
              </Field>
              <FieldError message={errors.card} />
            </div>
          )}
        </div>
      </Question> */}
    </>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 text-base font-bold">
        {label}
      </Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Phone number with searchable country code
   Stores one string in state, e.g. "+975 17 123 456"
   ------------------------------------------------------------------ */

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/** Every country libphonenumber knows, sorted by name */
const COUNTRY_CODES = getCountries()
  .map((iso) => ({
    iso,
    dial: `+${getCountryCallingCode(iso)}`,
    name: regionNames.of(iso) ?? iso,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

type Country = (typeof COUNTRY_CODES)[number];

const DEFAULT_COUNTRY: CountryCode = "BT";
/** Shown at the top of the list when not searching */
const PINNED: CountryCode[] = ["BT", "IN"];

const countryOf = (iso: CountryCode) =>
  COUNTRY_CODES.find((c) => c.iso === iso)!;
const dialOf = (iso: CountryCode) => `+${getCountryCallingCode(iso)}`;

/**
 * Split a stored "+975 17 123 456" into country + local number.
 * Several countries share a code (+1, +7, +44…), so prefer the one already selected.
 */
function splitPhone(value: string, prefer: CountryCode = DEFAULT_COUNTRY) {
  const v = value ?? "";
  const matches = COUNTRY_CODES.filter((c) => v.startsWith(`${c.dial} `));
  if (!matches.length) return { iso: prefer, number: v };
  const hit = matches.find((c) => c.iso === prefer) ?? matches[0];
  return { iso: hit.iso, number: v.slice(hit.dial.length + 1) };
}

function PhoneInput({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const [iso, setIso] = useState<CountryCode>(() => splitPhone(value).iso);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const numberRef = useRef<HTMLInputElement>(null);
  const justPicked = useRef(false);

  const { number } = splitPhone(value, iso);
  const current = countryOf(iso);

  const emit = (nextIso: CountryCode, nextNumber: string) => {
    const clean = nextNumber.replace(/[^\d\s]/g, "").replace(/^\s+/, "");
    onChange(clean ? `${dialOf(nextIso)} ${clean}` : "");
  };

  const pick = (next: CountryCode) => {
    setIso(next);
    emit(next, number);
    justPicked.current = true;
    setOpen(false);
  };

  const item = (c: Country, prefix = "") => (
    <CommandItem
      key={prefix + c.iso}
      // What the search matches against: name, dial code and ISO code
      value={`${prefix}${c.name} ${c.dial} ${c.dial.slice(1)} ${c.iso}`}
      onSelect={() => pick(c.iso)}
      className="gap-2"
    >
      <span className="w-7 shrink-0 text-xs font-semibold text-muted-foreground">
        {c.iso}
      </span>
      <span className="flex-1 truncate">{c.name}</span>
      <span className="tabular-nums text-muted-foreground">{c.dial}</span>
      <Check
        className={`size-4 shrink-0 ${c.iso === iso ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );

  return (
    <div className="flex gap-2">
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label={`Country code: ${current.name} ${current.dial}`}
            aria-invalid={invalid}
            className={`flex h-12 w-28 shrink-0 items-center justify-between gap-1 rounded-md border-2 bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${
              invalid ? "border-destructive" : "border-input"
            }`}
          >
            <span className="truncate">
              <span className="text-muted-foreground">{iso}</span> {current.dial}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-60" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[min(20rem,calc(100vw-2rem))] p-0"
          // After picking a country, jump straight to the number field
          onCloseAutoFocus={(e) => {
            if (justPicked.current) {
              e.preventDefault();
              justPicked.current = false;
              numberRef.current?.focus();
            }
          }}
        >
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search country or code…"
              className="text-base"
            />
            <CommandList className="max-h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              {!search && (
                <CommandGroup heading="Suggested">
                  {COUNTRY_CODES.filter((c) => PINNED.includes(c.iso)).map((c) =>
                    item(c, "pinned "),
                  )}
                </CommandGroup>
              )}
              <CommandGroup heading={search ? undefined : "All countries"}>
                {COUNTRY_CODES.map((c) => item(c))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        ref={numberRef}
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={iso === "BT" ? "17 123 456" : "Phone number"}
        value={number}
        onChange={(e) => emit(iso, e.target.value)}
        aria-invalid={invalid}
        className="h-12 min-w-0 flex-1 border-2 text-base"
      />
    </div>
  );
}