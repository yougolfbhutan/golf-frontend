/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChevronLeft, ChevronRight, Search, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { showToast } from "nextjs-toast-notify";
import { formatDate } from "date-fns";
import type { Booking } from "../../Booking/interface";
import {
  isConfirmed,
  formatPhone,
  type PanelMode,
  minutesToLabel,
  BookingDetailsPanel,
} from "../booking-ui/booking-ui";
import { useApproveBookingMutations, useGetBookings } from "./tanstack";
import type { CreateBookingApprovedPayload } from "./interface";

/*
  Colours (golf course palette):
  - White + warm grey (stone) for the page, lines and text
  - Fairway green (emerald-800) for confirmed bookings and main buttons
  - Sand (amber) only for pending bookings
  - Light grey + strike-through for cancelled
*/

/* ---------- tee sheet settings (change to match your courses) ---------- */

const FIRST_TEE = 7 * 60; // 7:00 AM, in minutes
const LAST_TEE = 17 * 60; // 5:00 PM
const INTERVAL = 15; // minutes between tee times
const MAX_PLAYERS = 4; // players per tee time

const ALL_SLOTS: number[] = [];
for (let m = FIRST_TEE; m <= LAST_TEE; m += INTERVAL) ALL_SLOTS.push(m);

/*
  TEMPORARY: loads many bookings and keeps only the chosen day.
  Replace with backend calls:
  - bookings for one date:  GET /bookings?date=2026-11-14
  - search across all days: GET /bookings?search=dorji
  Until then, bookings beyond the first 500 will be missing.
*/
function useBookingData(date: string) {
  const { data, isFetching } = useGetBookings(1, 500);
  const all: Booking[] = useMemo(() => data?.data?.data ?? [], [data]);
  const bookings = useMemo(() => all.filter((b) => b.teeDate?.slice(0, 10) === date), [all, date]);
  return { all, bookings, isFetching };
}

/* ---------- helpers ---------- */

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (iso: string) => new Date(`${iso}T00:00:00`); // local time, avoids off-by-one-day
const shiftDay = (iso: string, days: number) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
};
const toMinutes = (time?: string) => {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  return Number.isNaN(h) ? null : h * 60 + (m || 0);
};
/* Put a booking into the tee slot it falls in (9:07 -> 9:00, 9:20 -> 9:15). */
const slotOf = (min: number) =>
  min < FIRST_TEE || min > LAST_TEE ? min : FIRST_TEE + Math.floor((min - FIRST_TEE) / INTERVAL) * INTERVAL;
const courseKeyOf = (b: Booking) => String((b.golfCourse as any)?.id ?? b.golfCourse?.name ?? "unknown");

const matchesQuery = (b: Booking, q: string) =>
  [b.customer?.name, b.customer?.phone_no, b.customer?.email].some((v) => v?.toLowerCase().includes(q));

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isPhone;
}

type Row =
  | { kind: "slot"; slot: number }
  | { kind: "gap"; from: number; to: number; count: number };

/* ---------- small pieces ---------- */

function BookingChip({ booking, dimmed, onOpen }: { booking: Booking; dimmed: boolean; onOpen: () => void }) {
  const cancelled = booking.status === "cancelled";
  const confirmed = isConfirmed(booking.status);

  const style = confirmed
    ? "bg-emerald-800 text-white hover:bg-emerald-900"
    : cancelled
      ? "bg-stone-50 text-stone-400 line-through hover:bg-stone-100"
      : "bg-amber-50 text-amber-950 ring-1 ring-inset ring-amber-300 hover:bg-amber-100";
  const countStyle = confirmed ? "text-emerald-100" : cancelled ? "text-stone-400" : "text-amber-800";

  return (
    <button
      type="button"
      onClick={onOpen}
      title={`${booking.customer?.name ?? ""} ${formatPhone(booking)}`}
      className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${style} ${dimmed ? "opacity-25" : ""}`}
    >
      {!confirmed && !cancelled && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-label="Pending" />}
      <span className="truncate font-medium">{booking.customer?.name || "Guest"}</span>
      <span className={`ml-auto flex shrink-0 items-center gap-1 text-xs tabular-nums ${countStyle}`}>
        <Users className="h-3 w-3" />
        {booking.numberOfGolfers ?? 0}
      </span>
    </button>
  );
}

function PlayerDots({ used }: { used: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${used} of ${MAX_PLAYERS} players`}>
      {Array.from({ length: MAX_PLAYERS }).map((_, i) => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < used ? "bg-emerald-700" : "bg-stone-200"}`} />
      ))}
    </span>
  );
}

function busyWord(pct: number) {
  if (pct >= 75) return "Busy";
  if (pct >= 40) return "Steady";
  return "Quiet";
}

/* ---------- page ---------- */

export default function TeeSheetPage() {
  const today = toISO(new Date());
  const isPhone = useIsPhone();

  const [date, setDate] = useState(today);
  const [showAll, setShowAll] = useState(false);
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [mode, setMode] = useState<PanelMode>("view");
  const [nowMin, setNowMin] = useState(() => new Date().getHours() * 60 + new Date().getMinutes());

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolledFor = useRef<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNowMin(new Date().getHours() * 60 + new Date().getMinutes()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => setExpanded(new Set()), [date]);

  const { all, bookings, isFetching } = useBookingData(date);

  /* ----- courses ----- */
  const courses = useMemo(() => {
    const map = new Map<string, string>();
    bookings.forEach((b) => map.set(courseKeyOf(b), b.golfCourse?.name ?? "Course"));
    const list = [...map.entries()].map(([key, name]) => ({ key, name }));
    return list.length ? list : [{ key: "none", name: "Tee times" }];
  }, [bookings]);

  // On a phone, show one course at a time so nothing scrolls sideways
  const visibleCourses = useMemo(() => {
    if (courseFilter !== "all") {
      const one = courses.find((c) => c.key === courseFilter);
      if (one) return [one];
    }
    return isPhone ? [courses[0]] : courses;
  }, [courses, courseFilter, isPhone]);

  useEffect(() => {
    if (courseFilter !== "all" && !courses.some((c) => c.key === courseFilter)) setCourseFilter("all");
  }, [courses, courseFilter]);

  /* ----- bookings by slot and course ----- */
  const grid = useMemo(() => {
    const g = new Map<number, Map<string, Booking[]>>();
    bookings.forEach((b) => {
      const min = toMinutes(b.teeTime);
      if (min === null) return;
      const slot = slotOf(min);
      if (!g.has(slot)) g.set(slot, new Map());
      const row = g.get(slot)!;
      const key = courseKeyOf(b);
      row.set(key, [...(row.get(key) ?? []), b]);
    });
    return g;
  }, [bookings]);

  const allSlots = useMemo(
    () => [...new Set<number>([...ALL_SLOTS, ...grid.keys()])].sort((a, b) => a - b),
    [grid],
  );

  /* ----- how busy each course is ----- */
  const occupancy = useMemo(() => {
    const out = new Map<string, { booked: number; players: number }>();
    courses.forEach((c) => {
      let booked = 0;
      let players = 0;
      ALL_SLOTS.forEach((s) => {
        const active = (grid.get(s)?.get(c.key) ?? []).filter((b) => b.status !== "cancelled");
        if (active.length) booked++;
        players += active.reduce((sum, b) => sum + (b.numberOfGolfers ?? 0), 0);
      });
      out.set(c.key, { booked, players });
    });
    return out;
  }, [courses, grid]);

  /* ----- rows: runs of free tee times fold into one line ----- */
  const rows: Row[] = useMemo(() => {
    const hasBooking = (s: number) => visibleCourses.some((c) => (grid.get(s)?.get(c.key)?.length ?? 0) > 0);
    if (showAll) return allSlots.map((slot) => ({ kind: "slot" as const, slot }));

    const out: Row[] = [];
    let run: number[] = [];
    const flush = () => {
      if (run.length >= 2 && !expanded.has(run[0])) {
        out.push({ kind: "gap", from: run[0], to: run[run.length - 1], count: run.length });
      } else {
        run.forEach((slot) => out.push({ kind: "slot", slot }));
      }
      run = [];
    };
    allSlots.forEach((s) => {
      if (hasBooking(s)) {
        flush();
        out.push({ kind: "slot", slot: s });
      } else run.push(s);
    });
    flush();
    return out;
  }, [allSlots, grid, visibleCourses, showAll, expanded]);

  const summary = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelled");
    return {
      teeTimes: active.length,
      players: active.reduce((s, b) => s + (b.numberOfGolfers ?? 0), 0),
    };
  }, [bookings]);

  const pending = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "pending")
        .sort((a, b) => (toMinutes(a.teeTime) ?? 0) - (toMinutes(b.teeTime) ?? 0)),
    [bookings],
  );

  /* ----- search across all loaded days ----- */
  const q = query.trim().toLowerCase();
  const searching = q.length >= 2;
  const results = useMemo(() => {
    if (!searching) return [];
    const t = fromISO(today).getTime();
    return all
      .filter((b) => matchesQuery(b, q))
      .sort(
        (a, b) =>
          Math.abs(fromISO(a.teeDate?.slice(0, 10) ?? today).getTime() - t) -
          Math.abs(fromISO(b.teeDate?.slice(0, 10) ?? today).getTime() - t),
      )
      .slice(0, 8);
  }, [all, q, searching, today]);

  /* ----- now / up next ----- */
  const isToday = date === today;
  const nextSlot = isToday ? allSlots.find((s) => s + INTERVAL > nowMin) : undefined;
  const rowHasNext = (r: Row) =>
    nextSlot !== undefined && (r.kind === "slot" ? r.slot === nextSlot : nextSlot >= r.from && nextSlot <= r.to);
  const rowKey = (r: Row) => (r.kind === "slot" ? `s${r.slot}` : `g${r.from}`);

  // Open today's sheet already scrolled to the next tee time
  useEffect(() => {
    if (!isToday || isFetching || scrolledFor.current === date) return;
    const target = rows.find(rowHasNext);
    const box = scrollRef.current;
    if (!target || !box) return;
    const el = box.querySelector<HTMLElement>(`[data-row="${rowKey(target)}"]`);
    if (el) {
      box.scrollTo({ top: Math.max(el.offsetTop - box.clientHeight / 3, 0), behavior: "smooth" });
      scrolledFor.current = date;
    }
  }, [rows, isToday, isFetching, date]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----- actions ----- */
  const openBooking = (b: Booking) => {
    setMode("view");
    setSelected(b);
  };
const { updateBooking, cancelBooking, isLoading: isSaving } = useApproveBookingMutations();

const toastOptions = { duration: 3000, position: "top-right" as const, transition: "topBounce" as const, icon: "", sound: true };


const errorText = (err: any, fallback: string) => err?.data?.message ?? fallback;

const handleCancel = (b: Booking) => {
  if (b.status !== "pending") {
    showToast.error("Only pending bookings can be cancelled", toastOptions);
    return;
  }
  if (!window.confirm(`Cancel ${b.customer?.name ?? "this"}'s booking? This can't be undone.`)) return;

  cancelBooking(b.id, {
    onSuccess: () => {
      showToast.success(`${b.customer?.name ?? "Booking"} cancelled`, toastOptions);
      setSelected(null);
    },
    onError: (err) => showToast.error(errorText(err, "Could not cancel the booking"), toastOptions),
  });
};

const handleApprove = (b: Booking, values: CreateBookingApprovedPayload) => {
  updateBooking(
    { id: b.id, data: { ...values, status: "completed" } },
    {
      onSuccess: () => {
        showToast.success(`${b.customer?.name ?? "Booking"} approved`, toastOptions);
        setSelected(null);
      },
      onError: (err) =>
        showToast.error(errorText(err, "Could not approve the booking"), toastOptions),
    },
  );
};

  const gridCols = {
    gridTemplateColumns: `${isPhone ? "4.75rem" : "5.75rem"} repeat(${visibleCourses.length}, minmax(${
      visibleCourses.length === 1 ? "0" : "14rem"
    }, 1fr))`,
  };

  return (
    <div className="w-full px-3 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Day header */}
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              {formatDate(fromISO(date), "EEEE, MMMM d")}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {summary.teeTimes} tee {summary.teeTimes === 1 ? "time" : "times"} booked, {summary.players} players
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center rounded-lg bg-white shadow-sm ring-1 ring-stone-200 md:flex-none">
              <button
                type="button"
                onClick={() => setDate(shiftDay(date, -1))}
                aria-label="Previous day"
                className="rounded-l-lg p-2.5 text-stone-600 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <input
                type="date"
                value={date}
                onChange={(e) => e.target.value && setDate(e.target.value)}
                aria-label="Choose a day"
                className="min-w-0 flex-1 border-x border-stone-200 bg-transparent px-2 py-2 text-sm text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              />
              <button
                type="button"
                onClick={() => setDate(shiftDay(date, 1))}
                aria-label="Next day"
                className="rounded-r-lg p-2.5 text-stone-600 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {!isToday && (
              <button
                type="button"
                onClick={() => setDate(today)}
                className="rounded-lg bg-emerald-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
              >
                Today
              </button>
            )}
          </div>
        </header>

        {/* Find a golfer */}
        <div className="relative mb-5 md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Find a golfer by name or phone"
            aria-label="Find a golfer"
            className="h-11 w-full rounded-lg border-0 bg-white pl-9 pr-9 text-sm text-stone-900 shadow-sm ring-1 ring-stone-200 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {searching && (
            <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-stone-200">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-sm text-stone-500">No bookings found for “{query.trim()}”.</p>
              ) : (
                <ul className="max-h-80 divide-y divide-stone-100 overflow-auto">
                  {results.map((b) => {
                    const d = b.teeDate?.slice(0, 10) ?? today;
                    const dot =
                      b.status === "pending" ? "bg-amber-500" : b.status === "cancelled" ? "bg-stone-300" : "bg-emerald-700";
                    return (
                      <li key={b.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setDate(d);
                            setQuery("");
                            openBooking(b);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-stone-50 focus-visible:bg-stone-50 focus-visible:outline-none"
                        >
                          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-stone-900">
                              {b.customer?.name || "Guest"}
                            </span>
                            <span className="block truncate text-xs text-stone-500">
                              {b.golfCourse?.name ?? "Course"}
                            </span>
                          </span>
                          <span className="shrink-0 text-right text-xs tabular-nums text-stone-600">
                            {formatDate(fromISO(d), "EEE d MMM")}
                            <br />
                            {minutesToLabel(toMinutes(b.teeTime) ?? 0)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Waiting for approval */}
        {pending.length > 0 && (
          <section aria-labelledby="pending-heading" className="mb-5 rounded-xl bg-amber-50/60 p-3 ring-1 ring-inset ring-amber-200 sm:p-4">
            <h2 id="pending-heading" className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-950">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Waiting for your approval
              <span className="rounded-full bg-amber-200/70 px-2 text-xs tabular-nums text-amber-900">{pending.length}</span>
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => openBooking(b)}
                    className="group flex w-full items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-left shadow-sm ring-1 ring-amber-200 transition-colors hover:ring-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <span className="w-16 shrink-0 text-sm font-semibold tabular-nums text-stone-900">
                      {minutesToLabel(toMinutes(b.teeTime) ?? 0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-stone-900">{b.customer?.name || "Guest"}</span>
                      <span className="block truncate text-xs text-stone-500">
                        {b.golfCourse?.name ?? "Course"} · {b.numberOfGolfers ?? 0}{" "}
                        {b.numberOfGolfers === 1 ? "player" : "players"}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-md bg-emerald-800 px-2.5 py-1 text-xs font-medium text-white group-hover:bg-emerald-900">
                      Review
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* View controls: course picker + show every tee time */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {courses.length > 1 ? (
            <nav className="flex gap-1 overflow-x-auto" aria-label="Choose course">
              {[...(isPhone ? [] : [{ key: "all", name: "All courses" }]), ...courses].map((c) => {
                const active =
                  c.key === courseFilter || (isPhone && courseFilter === "all" && c.key === courses[0].key);
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCourseFilter(c.key)}
                    aria-pressed={active}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      active ? "bg-emerald-800 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </nav>
          ) : (
            <span />
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-100">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="h-4 w-4 accent-emerald-800"
            />
            Show every tee time
          </label>
        </div>

        {/* Sheet */}
        <div className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <div ref={scrollRef} className="relative max-h-[70vh] overflow-auto">
            <div className={visibleCourses.length > 1 ? "min-w-fit" : ""}>
              {/* Course header with how busy it is */}
              <div className="sticky top-0 z-10 grid border-b border-stone-200 bg-stone-50" style={gridCols}>
                <div className="sticky left-0 flex items-end bg-stone-50 px-3 py-3 text-xs font-medium text-stone-500">Time</div>
                {visibleCourses.map((c) => {
                  const occ = occupancy.get(c.key) ?? { booked: 0, players: 0 };
                  const pct = Math.round((occ.booked / ALL_SLOTS.length) * 100);
                  return (
                    <div key={c.key} className="border-l border-stone-200 px-3 py-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-stone-900">{c.name}</span>
                        <span className="shrink-0 text-xs font-medium text-emerald-800">{busyWord(pct)}</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                        <div className="h-full rounded-full bg-emerald-700" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-1 text-xs tabular-nums text-stone-500">
                        {occ.booked} of {ALL_SLOTS.length} tee times · {occ.players} players
                      </p>
                    </div>
                  );
                })}
              </div>

              {rows.map((r) => {
                const isNext = rowHasNext(r);
                const end = r.kind === "slot" ? r.slot : r.to;
                const isPast = isToday && end + INTERVAL <= nowMin;
                const start = r.kind === "slot" ? r.slot : r.from;
                const onTheHour = start % 60 === 0;
                const timeCell = (
                  <div
                    className={`sticky left-0 z-[1] flex flex-col justify-center px-3 py-1.5 tabular-nums ${
                      isNext ? "border-l-2 border-emerald-700 bg-emerald-50" : "bg-white"
                    }`}
                  >
                    {r.kind === "slot" ? (
                      <span className="text-sm font-medium text-stone-900">{minutesToLabel(r.slot)}</span>
                    ) : (
                      <span className="text-xs leading-tight text-stone-400">
                        {minutesToLabel(r.from)}
                        <br />– {minutesToLabel(r.to)}
                      </span>
                    )}
                    {isNext && <span className="text-[11px] font-semibold text-emerald-800">Up next</span>}
                  </div>
                );

                if (r.kind === "gap") {
                  return (
                    <div
                      key={rowKey(r)}
                      data-row={rowKey(r)}
                      className={`grid border-t ${onTheHour ? "border-stone-200" : "border-stone-100"} ${isPast ? "opacity-45" : ""}`}
                      style={gridCols}
                    >
                      {timeCell}
                      <button
                        type="button"
                        onClick={() => setExpanded((prev) => new Set(prev).add(r.from))}
                        style={{ gridColumn: "2 / -1" }}
                        className="flex items-center gap-2 border-l border-stone-100 bg-stone-50/60 px-4 py-2 text-left text-xs text-stone-500 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400"
                      >
                        {r.count} free tee times
                        <span className="ml-auto font-medium text-emerald-800">Show</span>
                      </button>
                    </div>
                  );
                }

                const row = grid.get(r.slot);
                return (
                  <div
                    key={rowKey(r)}
                    data-row={rowKey(r)}
                    className={`grid border-t ${onTheHour ? "border-stone-200" : "border-stone-100"} ${isPast ? "opacity-45" : ""}`}
                    style={gridCols}
                  >
                    {timeCell}
                    {visibleCourses.map((c) => {
                      const list = row?.get(c.key) ?? [];
                      const used = list
                        .filter((b) => b.status !== "cancelled")
                        .reduce((s, b) => s + (b.numberOfGolfers ?? 0), 0);
                      return (
                        <div key={c.key} className="flex min-h-[3rem] items-center gap-2 border-l border-stone-100 px-2 py-1.5">
                          {list.length ? (
                            <>
                              <div className="flex min-w-0 flex-1 flex-col gap-1">
                                {list.map((b) => (
                                  <BookingChip
                                    key={b.id}
                                    booking={b}
                                    dimmed={searching && !matchesQuery(b, q)}
                                    onOpen={() => openBooking(b)}
                                  />
                                ))}
                              </div>
                              <PlayerDots used={Math.min(used, MAX_PLAYERS)} />
                            </>
                          ) : (
                            <span className="px-2.5 text-xs text-stone-300">Free</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-sm bg-emerald-800" /> Confirmed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-sm bg-amber-50 ring-1 ring-inset ring-amber-300" /> Pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-stone-400 line-through">Name</span> Cancelled
          </span>
          <span className="flex items-center gap-1.5">
            <PlayerDots used={2} /> Players in the group (max {MAX_PLAYERS})
          </span>
        </div>
      </div>

      <BookingDetailsPanel
        booking={selected}
        mode={mode}
        onModeChange={setMode}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
        onApprove={handleApprove}
      />
    </div>
  );
}