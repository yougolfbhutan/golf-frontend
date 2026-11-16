"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import ImageSliderCard from "../../booking-component/image-slider-component";
import AppTabs from "../../booking-component/booking-tabs";
import CardCarousel from "../../booking-component/card-carasouel";
import QuantityStepper from "../../booking-component/quantity-stepper";

import type { BookingState } from "../../interface/interface";
import {
  type KitCategoryId,
  type KitItem,
  type FilterKey,
  type Tier,
  ENABLE_TIER_FILTER,
  kitCategories,
  filterOptions,
  packages,
} from "./data";
import { useKitItems } from "./helper/useKitItems";

type Props = {
  booking: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  footer?: ReactNode;
};

type Filters = Record<FilterKey, string>;

/** one kit = a golf set plus the balls and glove that go with it */
type PairedKit = {
  set: KitItem;
  ball?: KitItem;
  glove?: KitItem;
  gender?: string;
  hand?: string;
};

/** golf set id -> how many golfers get that kit */
type Allocation = Record<string, number>;

// "left" -> "Left"
const label = (v?: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");

// does an item match the gender / hand tabs its category uses?
// items without gender/hand (unisex / unknown) show under every tab
function matchesFilters(item: KitItem, f: Filters) {
  const cat = kitCategories.find((c) => c.id === item.category);
  if (!cat) return false;
  return cat.filters.every(
    (key) => f[key] === "all" || !item[key] || item[key] === f[key],
  );
}

// the filters that apply to golf sets (gender, hand)
const filterKeys =
  kitCategories.find((c) => c.id === ("sets" as KitCategoryId))?.filters ?? [];

// tab options without "All": one value is always selected in each group
const selectableOptions = (key: FilterKey) =>
  filterOptions[key].filter((o) => o.value !== "all");

// the kit with the most golfers (optionally skipping one)
function largest(a: Allocation, except?: string) {
  let best: string | undefined;
  for (const id of Object.keys(a)) {
    if (id === except) continue;
    if (!best || a[id] > a[best]) best = id;
  }
  return best;
}

// the kit with the fewest golfers (optionally skipping one)
function smallest(a: Allocation, except?: string) {
  let best: string | undefined;
  for (const id of Object.keys(a)) {
    if (id === except) continue;
    if (!best || a[id] < a[best]) best = id;
  }
  return best;
}

export default function PackageStep({ footer, booking, onChange }: Props) {
  const { packageId } = booking;
  const kit = booking.kit ?? {};
  const golfers = Math.max(1, booking.golfers ?? 1);

  // golf sets, gloves and balls: shared cache, so this is instant if already loaded
  const { items: allItems, isLoading, isError, refetch } = useKitItems();

  // gender and hand are chosen separately; each starts on the booking's saved
  // value, or on the first real option of its group
  const [filters, setFilters] = useState<Filters>(() => {
    const init = {} as Filters;
    filterKeys.forEach((key) => {
      const opts = selectableOptions(key);
      const preset = booking[key as "gender" | "hand"];
      init[key] =
        opts.find((o) => o.value === preset)?.value ?? opts[0]?.value ?? "all";
    });
    return init;
  });

  // with one golfer, save the default gender / hand to the booking on first load
  useEffect(() => {
    if (golfers !== 1) return;
    const patch: Partial<BookingState> = {};
    if (filters.gender !== "all" && booking.gender !== filters.gender)
      patch.gender = filters.gender as BookingState["gender"];
    if (filters.hand !== "all" && booking.hand !== filters.hand)
      patch.hand = filters.hand as BookingState["hand"];
    if (Object.keys(patch).length) onChange(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the package decides the tier
  const packageTier: Tier = packageId === "premium" ? "premium" : "standard";

  // every golf set with its balls and glove (not filtered, so choices
  // made under another filter are still known)
  const paired = useMemo<PairedKit[]>(() => {
    const tierOk = (i: KitItem) =>
      !ENABLE_TIER_FILTER || !i.tier || i.tier === packageTier;
    const byCat = (cat: KitCategoryId) =>
      allItems.filter((i) => i.category === cat && tierOk(i));

    const balls = byCat("balls");
    const gloves = byCat("gloves");

    return byCat("sets").map((set) => {
      // use the set's own gender / hand, or the chosen filter when the set has none
      const gender =
        set.gender ?? (filters.gender !== "all" ? filters.gender : undefined);
      const hand =
        set.hand ?? (filters.hand !== "all" ? filters.hand : undefined);

      const ball = balls.find(
        (b) => !b.gender || !gender || b.gender === gender,
      );
      const glove = gloves.find(
        (g) =>
          (!g.gender || !gender || g.gender === gender) &&
          (!g.hand || !hand || g.hand === hand),
      );

      return { set, ball, glove, gender, hand };
    });
  }, [allItems, filters, packageTier]);

  // the kits shown as cards (must match BOTH the gender and the hand tab)
  const visibleKits = useMemo(
    () => paired.filter((p) => matchesFilters(p.set, filters)),
    [paired, filters],
  );

  // which kits are chosen, and for how many golfers (read from booking.kit)
  const allocation = useMemo<Allocation>(() => {
    const a: Allocation = {};
    paired.forEach((p) => {
      const q = kit[p.set.id];
      if (q > 0) a[p.set.id] = q;
    });
    return a;
  }, [paired, kit]);

  const chosenIds = Object.keys(allocation);
  const canAddAnother = chosenIds.length < golfers;

  // turn "set -> golfers" into booking.kit (set, balls and glove per golfer)
  function buildKit(a: Allocation) {
    const next: Record<string, number> = {};
    const add = (id: string, n: number) => {
      next[id] = (next[id] ?? 0) + n;
    };

    Object.entries(a).forEach(([setId, n]) => {
      if (n <= 0) return;
      const p = paired.find((x) => x.set.id === setId);
      if (!p) return;
      add(p.set.id, n);
      if (p.ball) add(p.ball.id, n);
      if (p.glove) add(p.glove.id, n);
    });

    return next;
  }

  const pkg = packages.find((p) => p.id === packageId) ?? packages[0];

  function commit(a: Allocation) {
    if (Object.keys(a).length === 0) {
      onChange({ kit: {} });
      return;
    }
    onChange({ packageId: pkg?.id, kit: buildKit(a) });
  }

  // if the number of golfers changes on the first step, keep the total in step
  useEffect(() => {
    const ids = Object.keys(allocation);
    if (ids.length === 0) return;

    const a = { ...allocation };
    let sum = ids.reduce((s, id) => s + a[id], 0);
    if (sum === golfers) return;

    while (sum > golfers) {
      const d = largest(a)!;
      a[d] -= 1;
      if (a[d] === 0) delete a[d];
      sum -= 1;
    }
    while (sum < golfers) {
      const d = largest(a)!;
      a[d] += 1;
      sum += 1;
    }
    commit(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfers, paired.length]);

  if (!pkg) return null;

  // picking a different package clears the chosen kits
  function selectPackage(id: string) {
    onChange({ packageId: id, kit: {} });
  }

  // tap a card: choose it / unchoose it
  function toggleKit(setId: string) {
    // one golfer: works like a radio button
    if (golfers === 1) {
      commit(allocation[setId] ? {} : { [setId]: 1 });
      return;
    }

    const a = { ...allocation };

    // already chosen -> remove it and give its golfers to the biggest other kit
    if (a[setId]) {
      const freed = a[setId];
      delete a[setId];
      const target = largest(a);
      if (target) a[target] += freed;
      commit(a);
      return;
    }

    // first kit -> every golfer gets it
    if (Object.keys(a).length === 0) {
      commit({ [setId]: golfers });
      return;
    }

    // another kit -> take one golfer from the kit with the most golfers
    const donor = largest(a);
    if (!donor || a[donor] <= 1) return; // every golfer already has their own kit
    a[donor] -= 1;
    a[setId] = 1;
    commit(a);
  }

  // +/- on a chosen kit: move golfers to / from the other chosen kits
  function setCount(setId: string, n: number) {
    const a = { ...allocation };
    let diff = n - (a[setId] ?? 0);

    while (diff > 0) {
      const d = largest(a, setId);
      if (!d || a[d] <= 1) break;
      a[d] -= 1;
      a[setId] += 1;
      diff -= 1;
    }
    while (diff < 0) {
      const r = smallest(a, setId);
      if (!r || a[setId] <= 1) break;
      a[r] += 1;
      a[setId] -= 1;
      diff += 1;
    }
    commit(a);
  }

  // change one filter on its own; the other one is left untouched.
  // chosen kits are kept so golfers can mix men's / women's kits
  function changeFilter(key: FilterKey, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (golfers === 1) {
      const patch: Partial<BookingState> = {};
      if (key === "gender") patch.gender = value as BookingState["gender"];
      if (key === "hand") patch.hand = value as BookingState["hand"];
      onChange(patch);
    }
  }

  const chosenKits = paired.filter((p) => allocation[p.set.id]);

  return (
    <div className="mt-4 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-900/10 sm:mt-8 sm:p-6 lg:p-8">
      <section>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Choose your package
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {golfers === 1
            ? "Tap the kit you want."
            : `Tap a kit to give it to all ${golfers} golfers. Want different kits? Tap more kits and split the golfers between them.`}
        </p>

        {/* package picker: only shown once there is more than one package */}
        {packages.length > 1 && (
          <div
            role="radiogroup"
            aria-label="Package"
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {packages.map((p) => {
              const on = packageId === p.id;
              const premium = p.id === "premium";
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => selectPackage(p.id)}
                  className={`relative rounded-2xl border-2 bg-white p-3 pr-10 text-left transition
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B759]
                    ${
                      on
                        ? premium
                          ? "border-amber-500"
                          : "border-[#10B759]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <span className="block text-sm font-bold text-slate-900">
                    {p.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {p.description}
                  </span>
                  {on && (
                    <span
                      className={`absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full text-white ${
                        premium ? "bg-amber-500" : "bg-[#10B759]"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------- your chosen kits (only with more than one golfer) ---------- */}
      {golfers > 1 && chosenKits.length > 0 && (
        <section className="rounded-2xl border border-[#10B759]/30 bg-[#10B759]/5 p-4">
          <p className="text-sm font-bold text-slate-900">Your kits</p>
          <p className="mt-0.5 text-xs text-slate-600">
            {chosenKits.length === 1
              ? `All ${golfers} golfers get this kit.`
              : `${golfers} golfers split between ${chosenKits.length} kits.`}
          </p>

          <ul className="mt-3 space-y-2">
            {chosenKits.map(({ set, gender, hand }) => {
              const qty = allocation[set.id];
              const others = chosenIds.filter((id) => id !== set.id);
              // most this kit can have: every other chosen kit keeps at least 1
              const max =
                qty + others.reduce((s, id) => s + (allocation[id] - 1), 0);
              const tags = [label(gender), label(hand)]
                .filter(Boolean)
                .join(", ");

              return (
                <li
                  key={set.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {set.title}
                    </p>
                    {tags && <p className="text-[11px] text-slate-500">{tags}</p>}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {chosenKits.length > 1 ? (
                      <QuantityStepper
                        size="sm"
                        variant="outline"
                        label={`Golfers for ${set.title}`}
                        value={qty}
                        min={1}
                        max={max}
                        onChange={(n) => setCount(set.id, n)}
                      />
                    ) : (
                      <span className="text-xs font-medium text-slate-600">
                        × {qty}
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${set.title}`}
                      onClick={() => toggleKit(set.id)}
                      className="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        {/* filters: gender and hand, each chosen separately, no "All" tab */}
        {filterKeys.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {filterKeys.map((key) => (
              <AppTabs
                key={key}
                variant="pill"
                items={selectableOptions(key)}
                value={filters[key]}
                onValueChange={(v) => changeFilter(key, v)}
              />
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500" aria-live="polite">
          {isLoading || isError
            ? "\u00A0"
            : golfers > 1 && !canAddAnother
              ? "Every golfer already has their own kit. Remove one to choose another."
              : `${visibleKits.length} ${visibleKits.length === 1 ? "kit" : "kits"} in the ${pkg.title.toLowerCase()}. Tap one to select it.`}
        </p>

        {/* loading */}
        {isLoading && (
          <div
            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"
            aria-busy="true"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {/* error, with a retry button */}
        {!isLoading && isError && (
          <div className="mt-3 flex items-center gap-3 text-sm text-red-600">
            <span>Could not load the kits.</span>
            <button
              type="button"
              onClick={refetch}
              className="rounded-lg border border-red-200 px-3 py-1 font-medium hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && visibleKits.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            {filters.gender === "women"
              ? "No women's golf sets yet. Try another filter."
              : "No kits for this selection. Try a different filter."}
          </p>
        )}

        {!isLoading && !isError && visibleKits.length > 0 && (
          <div className="mt-3" aria-label="Kits">
            {/* key: start from the first card when the package or a filter changes */}
            <CardCarousel key={`${packageId}-${filters.gender}-${filters.hand}`}>
              {visibleKits.map(({ set, ball, glove, gender, hand }) => {
                const qty = allocation[set.id] ?? 0;

                // slider images: golf set, then balls, then glove
                const images = [set, ball, glove].flatMap((i) =>
                  i?.images?.[0] ? [i.images[0]] : [],
                );

                return (
                  <ImageSliderCard
                    key={set.id}
                    images={images}
                    title={pkg.title}
                    description={pkg.description}
                    badge={
                      [label(gender), label(hand)].filter(Boolean).join(", ") ||
                      undefined
                    }
                    selected={qty > 0}
                    onClick={() => toggleKit(set.id)}
                  >
                    <ul className="space-y-1 text-xs">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex gap-1.5">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* what is in this kit */}
                    <dl className="mt-2 space-y-0.5 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                      <div>
                        <dt className="inline font-medium text-slate-700">
                          Golf set:{" "}
                        </dt>
                        <dd className="inline">{set.title}</dd>
                      </div>
                      {ball && (
                        <div>
                          <dt className="inline font-medium text-slate-700">
                            Balls:{" "}
                          </dt>
                          <dd className="inline">{ball.title}</dd>
                        </div>
                      )}
                      {glove && (
                        <div>
                          <dt className="inline font-medium text-slate-700">
                            Glove:{" "}
                          </dt>
                          <dd className="inline">{glove.title}</dd>
                        </div>
                      )}
                    </dl>

                    {/* how many golfers get this kit */}
                    {golfers > 1 && qty > 0 && (
                      <span className="mt-2 block w-fit rounded bg-[#10B759]/15 px-2 py-0.5 text-[11px] font-semibold text-[#0E9F4F]">
                        For {qty} of {golfers} golfers
                      </span>
                    )}
                  </ImageSliderCard>
                );
              })}
            </CardCarousel>
          </div>
        )}
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}