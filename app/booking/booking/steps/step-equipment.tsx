/**
 * step-equipment.tsx
 * ------------------
 *   Number of golfers  [ - 3 + ]
 *   Package            [ Standard | Premium ]
 *   [ ] Golf sets         any mix of sets, total ≤ number of golfers
 *   [ ] Golf accessories  gloves, balls…, each ≤ number of golfers
 *   Extras                coaching / companion
 *
 * Everything is optional. Unticking clears what was picked inside it.
 *
 * REQUIRED in booking-logic.ts (BookingState + initialState):
 *   setQuantities: Record<string, number>; // initial {}   (golf set id → how many)
 *   accessoryIds: string[];               // initial []
 *   accessoryQuantities: Record<string, number>; // initial {}
 * and price golf sets as: sum of (unit price × quantity) over setQuantities.
 */
"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADDONS, NEWBIE_ADDONS, type AddonKey, type ExtraKey } from "../booking-data";
import {
  addonList,
  addonPrice,
  formatMoney,
  type StepProps,
} from "../booking-logic";
import { CheckCard, Question, StepHeading } from "../ui-parts";

// Golf sets
import { useGolfSets } from "../../booking-helper/golf-sets/tanstack-function";
import {
  ALL_AUDIENCES,
  AudienceTabs,
} from "../../booking-helper/golf-sets/helper-function/audience-tabs";
import { GolfSetsSection } from "../../booking-helper/golf-sets/helper-function/golf-sets-section";
import { TierTabs } from "../../booking-helper/golf-sets/helper-function/tier-tabs";
import type { Tier, GolfSet } from "../../booking-helper/golf-sets/interface";
import { AccessoriesSection } from "../../booking-helper/golf-accesories/golf-accessories-section";
import type { ItemGroup } from "../../booking-helper/golf-accesories/golf-options";
import type { ItemVariant } from "../../booking-helper/golf-accesories/interface";
import { useGolfAccessories } from "../../booking-helper/golf-accesories/tanstack";

/** The booking add-on key that golf sets are saved under. */
const SET_KEY: AddonKey = "clubs";

/** Most golfers in one booking. */
const MAX_GOLFERS = 4;

const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

/* ------------------------------------------------------------------ */
/* Small +/- stepper                                                    */
/* ------------------------------------------------------------------ */
function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const btn =
    "flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green-600/40";
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className={btn}
        aria-label={`Fewer ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-5 text-center text-base font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        aria-label={`More ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CheckCard + the panel it opens                                       */
/* ------------------------------------------------------------------ */
function TickSection({
  id,
  title,
  description,
  summary,
  checked,
  onCheckedChange,
  expanded,
  onToggleExpanded,
  children,
}: {
  id: string;
  title: string;
  description: string;
  summary?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <CheckCard
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        title={title}
        description={checked && !expanded && summary ? summary : description}
      />

      {checked && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-expanded={expanded}
            aria-controls={`${id}-panel`}
            className="flex items-center gap-1 rounded-lg px-1 py-1 text-sm font-medium text-green-700 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-green-600/40"
          >
            {expanded ? "Hide options" : "Show options"}
            <ChevronDown
              className={cn("size-4 transition-transform", expanded && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <div
              id={`${id}-panel`}
              className="mt-2 rounded-xl border border-border bg-card p-4 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Extras: coaching (new golfers) and companion (visitors)              */
/* ------------------------------------------------------------------ */
function Extras({ state, update }: Pick<StepProps, "state" | "update">) {
  const extras = addonList(state);
  if (extras.length === 0) return null;

  const toggle = (key: ExtraKey, checked: boolean) => {
    const without = state.addons.filter((a) => a !== key);
    update({ addons: checked ? [...without, key] : without });
  };

  return (
    <Question id="extras-label" label="Extras (optional)">
      <div role="group" aria-labelledby="extras-label" className="grid gap-3 sm:grid-cols-2">
        {extras.map((key) => (
          <CheckCard
            key={key}
            id={`extra-${key}`}
            checked={state.addons.includes(key)}
            onCheckedChange={(checked) => toggle(key, checked)}
            title={ADDONS[key].name}
            description={ADDONS[key].description}
            price={`${formatMoney(state.who, addonPrice(state, key))} per golfer`}
          />
        ))}
      </div>
    </Question>
  );
}

export function StepEquipment({ state, update }: StepProps) {
  // ---------- 1. Load data ----------
  const golfSetsQuery = useGolfSets();
  const accessoriesQuery = useGolfAccessories();

  const golfSets = useMemo<GolfSet[]>(
    () => golfSetsQuery.data?.data?.golfSets ?? [],
    [golfSetsQuery.data],
  );
  const accessories: ItemVariant[] = useMemo(
    () => accessoriesQuery.data?.data.Souvenirs ?? [],
    [accessoriesQuery.data],
  );

  // ---------- 2. What is chosen right now? ----------
  // Uses the booking's existing `players` count, so the scorecard and totals agree
  const golfers = state.players ?? 1;

  // Golf sets: id → how many. The total can never exceed `golfers`.
  const setQuantities: Record<string, number> = state.setQuantities ?? {};
  const totalSets = sum(Object.values(setQuantities));

  const selectedAccessoryIds = state.accessoryIds ?? [];
  const accessoryQuantities: Record<string, number> = state.accessoryQuantities ?? {};
  const quantityOf = (id: string) => accessoryQuantities[id] ?? 1;
  const totalAccessoryQty = sum(selectedAccessoryIds.map(quantityOf));

  // Accessories may or may not carry a tier. If they do, we filter by it.
  const tierOfAccessory = (v: ItemVariant) => (v as unknown as { tier?: string }).tier;
  const setName = (s: GolfSet) =>
    (s as unknown as { name?: string }).name ?? `Golf set ${s.id}`;

  // ---------- 3. Tick + open state ----------
  const [wantSet, setWantSet] = useState(totalSets > 0);
  const [setExpanded, setSetExpanded] = useState(totalSets === 0);
  const [wantAcc, setWantAcc] = useState(selectedAccessoryIds.length > 0);
  const [accExpanded, setAccExpanded] = useState(selectedAccessoryIds.length === 0);

  // The package (Standard / Premium), restored from earlier picks.
  const [tier, setTier] = useState<Tier>(() => {
    const firstSet = golfSets.find((s) => setQuantities[String(s.id)] > 0);
    if (firstSet?.tier) return firstSet.tier;
    const firstAcc = accessories.find((v) => String(v.id) === selectedAccessoryIds[0]);
    return (firstAcc && (tierOfAccessory(firstAcc) as Tier)) || "standard";
  });
  const [setAudience, setSetAudience] = useState<string>(ALL_AUDIENCES);

  const setAudiences = useMemo(() => {
    const found = new Set<string>();
    golfSets.forEach((s) => s.audience && found.add(s.audience));
    return [ALL_AUDIENCES, ...found];
  }, [golfSets]);

  // ---------- 4. Show only the chosen package ----------
  const visibleSets = golfSets.filter(
    (set) =>
      set.tier === tier && (setAudience === ALL_AUDIENCES || set.audience === setAudience),
  );

  // ---------- 5. Price labels ----------
  const unitPrice = (item: { price?: unknown; priceNu?: unknown; priceUsd?: unknown }): number => {
    const specific = state.who === "Bhutanese" ? item.priceNu : item.priceUsd;
    return Number(specific ?? item.price ?? 0) || 0;
  };
  const getSetPrice = (set: GolfSet): string =>
    state.who ? formatMoney(state.who, unitPrice(set as never)) : "";
  const getAccessoryPrice = (variant: ItemVariant): string =>
    state.who ? formatMoney(state.who, unitPrice(variant as never)) : `Nu ${variant.price}`;

  // ---------- 6. Save choices into booking state ----------
  /** Saves golf set quantities, and keeps the "clubs" add-on in step with them. */
  const saveSets = (next: Record<string, number>) => {
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, q]) => q > 0));
    const ids = Object.keys(cleaned);
    const withoutSet = state.addons.filter((a) => a !== SET_KEY);
    const variantWithoutSet = Object.fromEntries(
      Object.entries(state.variant).filter(([key]) => key !== SET_KEY),
    );

    update({
      setQuantities: cleaned,
      addons: ids.length ? [...withoutSet, SET_KEY] : withoutSet,
      // first chosen set, so any code still reading variant.clubs keeps working
      variant: ids.length ? { ...variantWithoutSet, [SET_KEY]: ids[0] } : variantWithoutSet,
    });
  };

  /** Make the total equal `n`: extra golfers join the biggest group, fewer take from it. */
  const rebalance = (q: Record<string, number>, n: number) => {
    const next = { ...q };
    let diff = n - sum(Object.values(next));
    while (diff !== 0) {
      const ids = Object.keys(next)
        .filter((k) => next[k] > 0)
        .sort((x, y) => next[y] - next[x]);
      if (!ids.length) break;
      if (diff > 0) {
        next[ids[0]] += 1;
        diff -= 1;
      } else {
        next[ids[0]] -= 1;
        diff += 1;
      }
    }
    return next;
  };

  /** Change how many of one set. The total can never go above the number of golfers. */
  const changeSetQuantity = (id: string, qty: number) => {
    const others = totalSets - (setQuantities[id] ?? 0);
    const allowed = Math.max(0, Math.min(qty, golfers - others));
    saveSets({ ...setQuantities, [id]: allowed });
  };

  const selectAccessory = (group: ItemGroup, variantId: string | undefined) => {
    const idsOfThisItem = group.variants.map((v) => String(v.id));
    const previousId = selectedAccessoryIds.find((id) => idsOfThisItem.includes(id));
    const carriedQty = previousId ? quantityOf(previousId) : 1;
    const others = selectedAccessoryIds.filter((id) => !idsOfThisItem.includes(id));

    const nextQuantities = Object.fromEntries(
      Object.entries(accessoryQuantities).filter(([id]) => !idsOfThisItem.includes(id)),
    );
    if (variantId) nextQuantities[variantId] = Math.min(carriedQty, golfers);

    update({
      accessoryIds: variantId ? [...others, variantId] : others,
      accessoryQuantities: nextQuantities,
    });
  };

  const changeAccessoryQuantity = (variantId: string, qty: number) => {
    if (qty < 1) {
      const { [variantId]: _removed, ...rest } = accessoryQuantities;
      update({
        accessoryIds: selectedAccessoryIds.filter((id) => id !== variantId),
        accessoryQuantities: rest,
      });
      return;
    }
    update({
      accessoryQuantities: { ...accessoryQuantities, [variantId]: Math.min(qty, golfers) },
    });
  };

  const toggleSet = (checked: boolean) => {
    setWantSet(checked);
    setSetExpanded(checked);
    if (!checked) saveSets({});
  };

  const toggleAccessories = (checked: boolean) => {
    setWantAcc(checked);
    setAccExpanded(checked);
    if (!checked) update({ accessoryIds: [], accessoryQuantities: {} });
  };

  /** Fewer golfers? Trim everything so nothing exceeds the new number. */
  const changeGolfers = (n: number) => {
    const cleanedSets = Object.fromEntries(
      Object.entries(rebalance(setQuantities, Math.min(n, totalSets))).filter(([, q]) => q > 0),
    );
    const ids = Object.keys(cleanedSets);
    const withoutSet = state.addons.filter((a) => a !== SET_KEY);
    const variantWithoutSet = Object.fromEntries(
      Object.entries(state.variant).filter(([key]) => key !== SET_KEY),
    );

    update({
      players: n,
      setQuantities: cleanedSets,
      addons: ids.length ? [...withoutSet, SET_KEY] : withoutSet,
      variant: ids.length ? { ...variantWithoutSet, [SET_KEY]: ids[0] } : variantWithoutSet,
      accessoryQuantities: Object.fromEntries(
        Object.entries(accessoryQuantities).map(([id, q]) => [id, Math.min(q, n)]),
      ),
    });
  };

  /** Switching package drops picks that belong to the other package. */
  const changeTier = (next: Tier) => {
    if (next === tier) return;
    setTier(next);

    // keep only golf sets of the new package
    const keptSets = Object.fromEntries(
      Object.entries(setQuantities).filter(([id]) => {
        const s = golfSets.find((x) => String(x.id) === id);
        return s?.tier === next;
      }),
    );
    if (Object.keys(keptSets).length !== Object.keys(setQuantities).length) {
      saveSets(keptSets);
    }

    // keep accessories with no tier, or in the new package
    const keepIds = selectedAccessoryIds.filter((id) => {
      const v = accessories.find((x) => String(x.id) === id);
      const t = v && tierOfAccessory(v);
      return !t || t === next;
    });
    if (keepIds.length !== selectedAccessoryIds.length) {
      update({
        accessoryIds: keepIds,
        accessoryQuantities: Object.fromEntries(
          Object.entries(accessoryQuantities).filter(([id]) => keepIds.includes(id)),
        ),
      });
    }
  };

  // ---------- 7. Render ----------
  const isNewbie = state.level === "newbie";
  const hint = isNewbie
    ? "Most new golfers rent a set. Choose what you need, or skip this step."
    : "Choose what you'd like us to provide. Skip anything you'll bring yourself.";

  const setSummary =
    totalSets > 0
      ? `${totalSets} golf ${totalSets === 1 ? "set" : "sets"} selected`
      : "Nothing picked yet";
  const accSummary =
    totalAccessoryQty > 0
      ? `${totalAccessoryQty} ${totalAccessoryQty === 1 ? "item" : "items"} selected`
      : "Nothing picked yet";

  return (
    <>
      <StepHeading hint={hint}>What do you need for your round?</StepHeading>

      {/* Number of golfers */}
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-green-600/10 text-green-700">
            <Users className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Number of golfers</p>
            <p className="text-xs text-muted-foreground">
              You can choose up to one of each item per golfer.
            </p>
          </div>
        </div>
        <Stepper label="golfers" value={golfers} min={1} max={MAX_GOLFERS} onChange={changeGolfers} />
      </div>

      {/* Package */}
      <div className="mb-6">
        <p id="package-label" className="mb-2 text-sm font-medium">
          Package
        </p>
        <TierTabs value={tier} onChange={changeTier} />
      </div>

      <Question id="gear-label" label={`Rent from us · ${tier === "premium" ? "Premium" : "Standard"}`}>
        <div role="group" aria-labelledby="gear-label" className="flex flex-col gap-3">
          {/* ---------- Golf sets (any mix, total ≤ golfers) ---------- */}
          <TickSection
            id="need-golf-set"
            title="Golf sets"
            description="Rent a full set of clubs for each golfer who needs one."
            summary={setSummary}
            checked={wantSet}
            onCheckedChange={toggleSet}
            expanded={setExpanded}
            onToggleExpanded={() => setSetExpanded((o) => !o)}
          >
            <div className="mb-4">
              <AudienceTabs audiences={setAudiences} value={setAudience} onChange={setSetAudience} />
            </div>

            <GolfSetsSection
              sets={visibleSets}
              isPending={golfSetsQuery.isPending}
              isError={golfSetsQuery.isError}
              onRetry={() => golfSetsQuery.refetch()}
              getPrice={getSetPrice}
              isRecommended={isNewbie && NEWBIE_ADDONS.includes(SET_KEY)}
              // pick MANY: one tick per golfer, the rest lock once everyone has a set
              selectedIds={Object.keys(setQuantities).filter((id) => setQuantities[id] > 0)}
              onToggle={(id) => changeSetQuantity(id, (setQuantities[id] ?? 0) > 0 ? 0 : 1)}
              isDisabled={(set) => totalSets >= golfers && !(setQuantities[String(set.id)] > 0)}
            />
          </TickSection>

          {/* ---------- Golf accessories ---------- */}
          <TickSection
            id="need-golf-accessories"
            title="Golf accessories"
            description="Gloves, balls and other golf items."
            summary={accSummary}
            checked={wantAcc}
            onCheckedChange={toggleAccessories}
            expanded={accExpanded}
            onToggleExpanded={() => setAccExpanded((o) => !o)}
          >
            <AccessoriesSection
              variants={accessories}
              tier={tier}
              isPending={accessoriesQuery.isPending}
              isError={accessoriesQuery.isError}
              onRetry={() => accessoriesQuery.refetch()}
              selectedIds={selectedAccessoryIds}
              onSelect={selectAccessory}
              getPrice={getAccessoryPrice}
              quantities={accessoryQuantities}
              maxQuantity={golfers}
              onQuantityChange={changeAccessoryQuantity}
            />
          </TickSection>
        </div>
      </Question>

    </>
  );
}