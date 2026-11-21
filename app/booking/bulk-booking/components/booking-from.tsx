/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Form, Formik, getIn, useFormikContext } from "formik";
import * as Yup from "yup";
import { Oswald } from "next/font/google";
import FormikController from "@/custom-components/formik/formik-controller";

const condensed = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });

/* =====================================================================
   CONFIG TYPES: this is everything you define to reuse the form
   ===================================================================== */

/** One bookable tee time, exactly as the backend returns it */
export type TeeTime = {
  id: number | null;
  teeDate: string; // "2026-11-28"
  teeTime: string; // "07:15"
  maxGolfers: number;
  bookedGolfers: number;
  placesLeft: number;
  status?: string; // optional, the backend only sends available slots
};

/** A group that pays a different price, e.g. SAARC / Non-SAARC, Adult / Child */
export type Tier = { id: string; label: string };

/** Something charged per person. `perTier` = price per person for each tier id. */
export type Charge = {
  id: string;
  label: string;
  perTier: Record<string, number>;
  /** Optional: people can opt out of this charge (bring own kit) and get it deducted */
  waivable?: {
    title: string;
    label: string;
    summaryLabel: string;
  };
};

/** A breakdown that must add up to the total people, e.g. right / left handed */
export type Split = {
  id: string;
  title: string;
  summaryLabel: string;
  parts: { id: string; label: string; summaryLabel: string }[]; // first part gets the remainder
};

/** Extra contact/info fields */
export type ExtraField = {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
  pattern?: RegExp;
  patternMessage?: string;
  fullWidth?: boolean;
};

export type BookingConfig = {
  summaryTitle: string;
  currency: string; // e.g. "Nu. "
  noun: string; // plural, e.g. "players"
  tiers: Tier[];
  maxPerTier?: number; // default 40
  dateLabel?: string;
  timeLabel?: string;
  maxAdvanceDays?: number;
  minAdvanceDays?: number;
  /** Return the tee-time array (already unwrapped from the `data` field). Omit for forms without a time. */
  fetchTimeSlots?: (date: string) => Promise<TeeTime[]>;
  charges: Charge[];
  splits?: Split[];
  extras?: ExtraField[];
  submitLabel?: string;
};

/* =====================================================================
   VALUES + CALCULATION
   ===================================================================== */

export type BookingValues = {
  date: string;
  time: string;
  counts: Record<string, number>;
  waived: Record<string, Record<string, number>>;
  splits: Record<string, Record<string, number>>;
  extras: Record<string, string>;
};

export type BookingSummary = {
  people: number;
  lines: { key: string; label: string; amount: number; deduction?: boolean }[];
  total: number;
};

const sum = (o: Record<string, number> | undefined) =>
  Object.values(o ?? {}).reduce((a, n) => a + (Number(n) || 0), 0);

// local-date helpers (toISOString() is UTC and can give the wrong day early morning in Bhutan, UTC+6)
const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isoInDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  return toISO(new Date(y, m - 1, d + n));
};
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const dateWindow = (cfg: BookingConfig) => ({
  min: isoInDays(cfg.minAdvanceDays ?? 0),
  max:
    cfg.maxAdvanceDays !== undefined
      ? isoInDays(cfg.maxAdvanceDays)
      : undefined,
});
const windowLabel = (days: number) =>
  days % 7 === 0 ? `${days / 7} week${days === 7 ? "" : "s"}` : `${days} days`;
const hasTime = (cfg: BookingConfig) => !!cfg.fetchTimeSlots;

// tee-time helpers
const MAX_SKIP_DAYS = 14; // how many days ahead to look when a date is empty
const hasSpace = (s: TeeTime) => (s.placesLeft ?? 1) > 0;
// on today's date, hide times that have already passed (uses the device clock)
const isUpcoming = (date: string, time: string) => {
  if (date !== toISO(new Date())) return true;
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  return h * 60 + m > now.getHours() * 60 + now.getMinutes();
};

function calculate(v: BookingValues, cfg: BookingConfig): BookingSummary {
  const lines: BookingSummary["lines"] = [];
  let total = 0;

  for (const c of cfg.charges) {
    for (const t of cfg.tiers) {
      const n = Number(v.counts[t.id]) || 0;
      if (n > 0) {
        const amount = n * (c.perTier[t.id] ?? 0);
        total += amount;
        lines.push({
          key: `${c.id}-${t.id}`,
          label: `${c.label}, ${t.label} (${n} × ${c.perTier[t.id] ?? 0})`,
          amount,
        });
      }
    }
  }
  for (const c of cfg.charges.filter((x) => x.waivable)) {
    for (const t of cfg.tiers) {
      const n = Math.min(
        Number(v.waived?.[c.id]?.[t.id]) || 0,
        Number(v.counts[t.id]) || 0,
      );
      if (n > 0) {
        const amount = n * (c.perTier[t.id] ?? 0);
        total -= amount;
        lines.push({
          key: `${c.id}-${t.id}-waived`,
          label: `${c.waivable!.summaryLabel}, ${t.label} (${n} × ${c.perTier[t.id] ?? 0})`,
          amount,
          deduction: true,
        });
      }
    }
  }
  return { people: sum(v.counts), lines, total };
}

// everything starts at 0
function buildInitialValues(cfg: BookingConfig): BookingValues {
  return {
    date: dateWindow(cfg).min, // today (or the earliest allowed date)
    time: "",
    counts: Object.fromEntries(cfg.tiers.map((t) => [t.id, 0])),
    waived: Object.fromEntries(
      cfg.charges
        .filter((c) => c.waivable)
        .map((c) => [
          c.id,
          Object.fromEntries(cfg.tiers.map((t) => [t.id, 0])),
        ]),
    ),
    splits: Object.fromEntries(
      (cfg.splits ?? []).map((s) => [
        s.id,
        Object.fromEntries(s.parts.map((p) => [p.id, 0])),
      ]),
    ),
    extras: Object.fromEntries((cfg.extras ?? []).map((f) => [f.name, ""])),
  };
}

/* =====================================================================
   YUP SCHEMA (built from the config)
   ===================================================================== */

function buildSchema(cfg: BookingConfig) {
  const max = cfg.maxPerTier ?? 40;
  const cnt = (m?: number) => {
    let s = Yup.number()
      .typeError("Enter a number")
      .integer()
      .min(0)
      .required("Required");
    if (m !== undefined) s = s.max(m, `Maximum is ${m}`);
    return s;
  };
  const shape = (ids: string[], m?: number) =>
    Object.fromEntries(ids.map((id) => [id, cnt(m)]));

  const tierIds = cfg.tiers.map((t) => t.id);
  const waivables = cfg.charges.filter((c) => c.waivable);

  const extras = Yup.object(
    Object.fromEntries(
      (cfg.extras ?? []).map((f) => {
        let s = Yup.string().trim();
        if (f.type === "email") s = s.email("Enter a valid email");
        if (f.pattern)
          // excludeEmptyString: an empty optional field must not fail the pattern
          s = s.matches(f.pattern, {
            message: f.patternMessage ?? "Invalid format",
            excludeEmptyString: true,
          });
        if (f.required) s = s.required(`${f.label} is required`);
        return [f.name, s];
      }),
    ),
  );

  return Yup.object({
    date: Yup.string()
      .required("Please pick a date")
      .test("window", function (v) {
        if (!v) return true;
        const w = dateWindow(cfg);
        if (v < w.min) {
          return this.createError({
            message: cfg.minAdvanceDays
              ? "That date is too soon"
              : "Date cannot be in the past",
          });
        }
        if (w.max && v > w.max) {
          return this.createError({
            message: `Bookings open up to ${windowLabel(cfg.maxAdvanceDays!)} ahead. Pick a date on or before ${formatDate(w.max)}.`,
          });
        }
        return true;
      }),
    ...(hasTime(cfg)
      ? { time: Yup.string().required("Please pick a time") }
      : {}),
    counts: Yup.object(shape(tierIds, max)),
    waived: Yup.object(
      Object.fromEntries(
        waivables.map((c) => [c.id, Yup.object(shape(tierIds))]),
      ),
    ),
    splits: Yup.object(
      Object.fromEntries(
        (cfg.splits ?? []).map((s) => [
          s.id,
          Yup.object(shape(s.parts.map((p) => p.id))),
        ]),
      ),
    ),
    extras,
  }).test("relations", function (v: any) {
    const total = sum(v.counts);
    if (total <= 0) {
      return this.createError({
        path: `counts.${tierIds[0]}`,
        message: `Add at least one of ${cfg.noun}`,
      });
    }
    for (const c of waivables) {
      for (const t of cfg.tiers) {
        if ((v.waived?.[c.id]?.[t.id] ?? 0) > (v.counts?.[t.id] ?? 0)) {
          return this.createError({
            path: `waived.${c.id}.${t.id}`,
            message: `Cannot exceed ${t.label} ${cfg.noun} (${v.counts[t.id]})`,
          });
        }
      }
    }
    for (const s of cfg.splits ?? []) {
      if (sum(v.splits?.[s.id]) !== total) {
        return this.createError({
          path: `splits.${s.id}.${s.parts[s.parts.length - 1].id}`,
          message: `${s.title.replace(/\?$/, "")} must add up to ${total}`,
        });
      }
    }
    return true;
  });
}

/* =====================================================================
   UI PIECES
   ===================================================================== */

function NumberField({
  id,
  value,
  min,
  max,
  onChange,
  onBlur,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  onBlur: () => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText((prev) => (prev === "" && value === min ? prev : String(value)));
  }, [value, min]);

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={text}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        if (digits === "") {
          setText("");
          onChange(min);
          return;
        }
        const n = Math.min(max, Math.max(min, parseInt(digits, 10)));
        setText(String(n));
        onChange(n);
      }}
      onBlur={() => {
        setText(String(value));
        onBlur();
      }}
      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-left text-lg font-semibold text-slate-900 outline-none transition focus:border-[#0E9F4F] focus:ring-2 focus:ring-[#0E9F4F]/20"
    />
  );
}

/* ---------- tee times for the chosen date; skips forward when a date is empty ---------- */
function TimeSlotPicker({ cfg, formik }: { cfg: BookingConfig; formik: any }) {
  const date: string = formik.values.date;
  const time: string = formik.values.time;
  const { setFieldValue, setFieldTouched } = formik;

  const [slots, setSlots] = useState<TeeTime[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const cache = useRef<Record<string, TeeTime[]>>({});
  const autoDate = useRef<string | null>(null); // date we moved to automatically

  useEffect(() => {
    // a new date means the old time may not exist
    setFieldValue("time", "");

    // keep the notice only when this date change was our own auto-skip
    if (date !== autoDate.current) {
      setNotice(null);
      autoDate.current = null;
    }

    if (!date || !cfg.fetchTimeSlots) {
      setSlots([]);
      setStatus("ready");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const load = async (): Promise<void> => {
      const { max } = dateWindow(cfg);
      let current = date; // today on first load

      try {
        for (let i = 0; i <= MAX_SKIP_DAYS; i++) {
          let list = cache.current[current];
          if (!list) {
            const res = await cfg.fetchTimeSlots!(current);
            // null / undefined -> [], then drop full and already-passed slots
            list = (Array.isArray(res) ? res : []).filter(
              (s) => hasSpace(s) && isUpcoming(current, s.teeTime),
            );
            cache.current[current] = list;
          }
          if (cancelled) return;

          if (list.length > 0) {
            if (current !== date) {
              autoDate.current = current;
              setNotice(
                `No tee times on ${formatDate(date)}. Moved to ${formatDate(current)}.`,
              );
              setFieldValue("date", current); // effect re-runs, served from cache
            }
            setSlots(list);
            setStatus("ready");
            return;
          }

          const next = addDays(current, 1);
          if (max && next > max) break; // stay inside the booking window
          current = next;
        }

        // nothing found in the whole range
        setSlots([]);
        setStatus("ready");
      } catch {
        // a network/CORS error is not an empty day, so don't skip dates
        if (!cancelled) {
          setSlots([]);
          setStatus("error");
        }
      }
    };

    load();

    return () => {
      cancelled = true; // ignore stale responses when the date changes quickly
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, retry]);

  const box = "rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500";

  if (!date) {
    return <p className={box}>Select a date to see available times.</p>;
  }

  if (status === "loading") {
    return (
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5" aria-busy="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-red-50 px-3 py-3 text-sm text-red-600">
        <span>Could not load times for this date.</span>
        <button
          type="button"
          onClick={() => {
            cache.current = {};
            setRetry((n) => n + 1);
          }}
          className="rounded-lg border border-red-200 bg-white px-3 py-1 font-medium hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className={box}>
        No tee times available in the next {MAX_SKIP_DAYS} days. Please try
        later.
      </p>
    );
  }

  return (
    <div>
      {notice && (
        <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {notice}
        </p>
      )}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {slots.map((s) => {
          const active = time === s.teeTime;
          return (
            <button
              key={s.teeTime}
              type="button"
              onClick={() => {
                setFieldValue("time", s.teeTime);
                setFieldTouched("time", true, false);
              }}
              className={`rounded-lg border py-2 text-sm transition ${
                active
                  ? "border-[#0E9F4F] bg-[#0E9F4F] font-semibold text-white"
                  : "border-slate-300 text-slate-700 hover:border-[#0E9F4F]"
              }`}
            >
              {s.teeTime}
              <span
                className={`block text-[10px] ${active ? "text-white/80" : "text-slate-400"}`}
              >
                {s.placesLeft} left
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const INPUT =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0E9F4F] focus:ring-2 focus:ring-[#0E9F4F]/20";
const SMALL_LABEL =
  "[&>label]:mb-1.5 [&>label]:block [&>label]:text-xs [&>label]:font-semibold [&>label]:uppercase [&>label]:tracking-wide [&>label]:text-slate-500";
const BIG_LABEL =
  "[&>label]:mb-2 [&>label]:block [&>label]:text-sm [&>label]:font-semibold [&>label]:text-slate-900";
const LEGEND = `${condensed.className} mb-3 text-xl uppercase text-slate-900`;

/* ---------- all the fieldsets ---------- */
function Fields({ cfg }: { cfg: BookingConfig }) {
  const { values } = useFormikContext<BookingValues>();
  const max = cfg.maxPerTier ?? 40;
  const total = sum(values.counts);
  const window_ = dateWindow(cfg);

  // clamped number input wired to Formik by dotted path, e.g. "counts.saarc"
  const num = (
    path: string,
    maxValue: number,
    after?: (n: number, set: (k: string, v: unknown) => void) => void,
  ) => ({
    type: "custom",
    render: (formik: any) => (
      <NumberField
        id={path}
        value={Number(getIn(formik.values, path)) || 0}
        min={0}
        max={maxValue}
        onChange={(n) => {
          formik.setFieldValue(path, n);
          after?.(n, formik.setFieldValue);
        }}
        onBlur={() => formik.setFieldTouched(path, true)}
      />
    ),
  });

  // when a tier count changes: clamp opt-outs and re-balance the first part of each split
  const onTierChange = (
    tierId: string,
    n: number,
    set: (k: string, v: unknown) => void,
  ) => {
    cfg.charges
      .filter((c) => c.waivable)
      .forEach((c) => {
        const cur = Number(values.waived?.[c.id]?.[tierId]) || 0;
        set(`waived.${c.id}.${tierId}`, Math.min(cur, n));
      });
    const newTotal = total - (Number(values.counts[tierId]) || 0) + n;
    (cfg.splits ?? []).forEach((s) => {
      const [first, ...rest] = s.parts;
      const others = rest.reduce(
        (a, p) => a + (Number(values.splits[s.id]?.[p.id]) || 0),
        0,
      );
      set(`splits.${s.id}.${first.id}`, Math.max(0, newTotal - others));
    });
  };

  // when a split part changes, keep the parts adding up to the total
  const onSplitChange = (
    s: Split,
    partId: string,
    n: number,
    set: (k: string, v: unknown) => void,
  ) => {
    const [first, ...rest] = s.parts;
    const cur = values.splits[s.id] ?? {};

    if (partId === first.id) {
      // edited the first part: with two parts, the other one takes the rest
      if (rest.length === 1) {
        set(`splits.${s.id}.${rest[0].id}`, Math.max(0, total - n));
      }
      return;
    }

    // edited another part: the first part becomes total minus all the others
    const others = rest.reduce(
      (a, p) => a + (p.id === partId ? n : Number(cur[p.id]) || 0),
      0,
    );
    set(`splits.${s.id}.${first.id}`, Math.max(0, total - others));
  };

  return (
    <div className="space-y-8 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8 lg:col-span-2">
      {/* date and time */}
      <fieldset>
        <legend className={LEGEND}>
          {hasTime(cfg) ? "Date and time" : "Date"}
        </legend>
        <div className="max-w-xs">
          <FormikController
            name="date"
            label={cfg.dateLabel ?? "Date"}
            className={SMALL_LABEL}
            fieldstyle={INPUT}
            fieldConfig={{
              type: "input",
              subType: "date",
              inputProps: { min: window_.min, max: window_.max },
            }}
          />
          {window_.max && (
            <p className="mt-1.5 text-xs text-slate-500">
              Bookings open up to {windowLabel(cfg.maxAdvanceDays!)} ahead
              (until {formatDate(window_.max)}).
            </p>
          )}
        </div>
        {hasTime(cfg) && (
          <div className="mt-4">
            <FormikController
              name="time"
              label={cfg.timeLabel ?? "Time"}
              className={SMALL_LABEL}
              fieldConfig={{
                type: "custom",
                render: (formik: any) => (
                  <TimeSlotPicker cfg={cfg} formik={formik} />
                ),
              }}
            />
          </div>
        )}
      </fieldset>

      {/* people per tier */}
      <fieldset>
        <legend className={LEGEND}>{`How many ${cfg.noun}?`}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {cfg.tiers.map((t) => (
            <FormikController
              key={t.id}
              name={`counts.${t.id}`}
              label={`Number of ${t.label} ${cfg.noun}`}
              className={BIG_LABEL}
              fieldConfig={num(`counts.${t.id}`, max, (n, set) =>
                onTierChange(t.id, n, set),
              )}
            />
          ))}
        </div>
      </fieldset>

      {/* splits (must add up to total) */}
      {(cfg.splits ?? []).map((s) => {
        const got = sum(values.splits?.[s.id]);
        return (
          <fieldset key={s.id}>
            <legend className={LEGEND}>{s.title}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {s.parts.map((p) => (
                <FormikController
                  key={p.id}
                  name={`splits.${s.id}.${p.id}`}
                  label={p.label}
                  className={BIG_LABEL}
                  fieldConfig={num(`splits.${s.id}.${p.id}`, total, (n, set) =>
                    onSplitChange(s, p.id, n, set),
                  )}
                />
              ))}
            </div>
            {got !== total && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
              >
                The numbers do not match. They add up to {got} but the total
                number of {cfg.noun} is {total}.
              </p>
            )}
          </fieldset>
        );
      })}

      {/* extra info */}
      {!!cfg.extras?.length && (
        <fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            {cfg.extras.map((f) => (
              <div
                key={f.name}
                className={
                  f.fullWidth || f.type === "textarea" ? "sm:col-span-2" : ""
                }
              >
                <FormikController
                  name={`extras.${f.name}`}
                  label={f.required ? f.label : `${f.label} (optional)`}
                  className={SMALL_LABEL}
                  fieldstyle={INPUT}
                  fieldConfig={{
                    type: "input",
                    subType: f.type === "textarea" ? "text" : f.type,
                    placeholder: f.placeholder,
                    inputProps:
                      f.type === "textarea"
                        ? { as: "textarea", rows: 3 }
                        : undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

/* ---------- summary card: date, time, players per tier, total ---------- */
function SummaryCard({ cfg }: { cfg: BookingConfig }) {
  const { values, isValid, isSubmitting, submitCount } =
    useFormikContext<BookingValues>();
  const s = calculate(values, cfg);
  const fmt = (n: number) => `${cfg.currency}${n.toLocaleString()}`;

  const row = (label: string, value: string) => (
    <div key={label} className="flex justify-between gap-3">
      <dt className="text-white/80">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#2DBE6C] to-[#0E9F4F] p-6 text-white shadow-[0_25px_50px_-12px_rgba(14,159,79,0.55)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
          Your booking
        </p>
        <h3
          className={`${condensed.className} mt-1 text-2xl uppercase leading-tight`}
        >
          {cfg.summaryTitle}
        </h3>

        <dl className="mt-5 space-y-2 border-t border-white/25 pt-4 text-sm">
          {row(
            cfg.dateLabel ?? "Date",
            values.date ? formatDate(values.date) : "—",
          )}
          {hasTime(cfg) && row(cfg.timeLabel ?? "Time", values.time || "—")}
          {cfg.tiers.map((t) =>
            row(`${t.label} ${cfg.noun}`, String(values.counts[t.id] ?? 0)),
          )}
        </dl>

        <div className="mt-4 flex items-end justify-between border-t border-white/25 pt-4">
          <span className="text-sm text-white/80">Total</span>
          <span className={`${condensed.className} text-3xl`}>
            {fmt(s.total)}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-bold uppercase tracking-wide text-[#0E9F4F] shadow-lg transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cfg.submitLabel ?? "Book now"}
        </button>

        {/* only after they've tried to submit */}
        {submitCount > 0 && !isValid && (
          <p role="alert" className="mt-2 text-center text-xs text-white/90">
            Please fix the highlighted fields to continue.
          </p>
        )}
      </div>
    </aside>
  );
}

/* =====================================================================
   THE REUSABLE COMPONENT
   ===================================================================== */

export default function BookingForm({
  config,
  onSubmit,
}: {
  config: BookingConfig;
  onSubmit: (
    values: BookingValues,
    summary: BookingSummary,
  ) => void | Promise<void>;
}) {
  return (
    <Formik<BookingValues>
      initialValues={buildInitialValues(config)}
      validationSchema={buildSchema(config)}
      validateOnMount
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values, calculate(values, config));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form className="grid gap-6 lg:grid-cols-3">
        <Fields cfg={config} />
        <SummaryCard cfg={config} />
      </Form>
    </Formik>
  );
}