"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import QuantityStepper from "../../booking-component/quantity-stepper";
import ImageSliderCard from "../../booking-component/image-slider-component";

import type { BookingState } from "../../interface/interface";
import {
  type CategoryId,
  type KitCategoryId,
  type KitItem,
  type FilterKey,
  type Tier,
  kitCategories,
  filterOptions,
  packages,
  formatPrice,
} from "./data";
import AppTabs from "../../booking-component/booking-tabs";
import { useKitItems } from "./helper/useKitItems";
import CardCarousel from "../../booking-component/card-carasouel";

type Props = {
  booking: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  footer?: ReactNode;
};

type Filters = Record<FilterKey, string>;

export default function PackageStep({ footer, booking, onChange }: Props) {
  const { packageId, kit, golfers } = booking;
  // falls back to Bhutanese until a category is picked on the first step
  const category = (booking.categoryId ?? "bhutanese") as CategoryId;

  const [activeCategory, setActiveCategory] = useState<KitCategoryId>("sets");
  const { items: allItems, isLoading, isError } = useKitItems();

  // only gender and hand are tabs ("all" = no filtering)
  const [filters, setFilters] = useState<Filters>({
    gender: "all",
    hand: "all",
  });
  const current = filters;

  // the package decides the tier
  const packageTier: Tier = packageId === "premium" ? "premium" : "standard";

  // does an item match the package tier and the tabs its category uses?
  function matches(item: KitItem, f: Filters, tier: Tier = packageTier) {
    const cat = kitCategories.find((c) => c.id === item.category)!;
    const tierOk = !item.tier || item.tier === tier; // no tier = always show
    const tabsOk = cat.filters.every(
      (key) => f[key] === "all" || item[key] === f[key],
    );
    return tierOk && tabsOk;
  }

  const itemsFor = (cat: KitCategoryId) =>
    allItems.filter((i) => i.category === cat && matches(i, current));

  // how many kits of a category are already chosen, optionally excluding one item
  const usedInCategory = (cat: KitCategoryId, exceptId?: string) =>
    allItems
      .filter((i) => i.category === cat && i.id !== exceptId)
      .reduce((sum, i) => sum + (kit[i.id] ?? 0), 0);

  // one kit per golfer: never allow more than the number of golfers
  function setQty(itemId: string, cat: KitCategoryId, qty: number) {
    const next = { ...kit };

    // a single golfer behaves like a radio button (swap the item)
    if (golfers === 1) {
      allItems
        .filter((i) => i.category === cat)
        .forEach((i) => delete next[i.id]);
    }

    const max = golfers === 1 ? 1 : golfers - usedInCategory(cat, itemId);
    const clamped = Math.max(0, Math.min(qty, max));

    if (clamped > 0) next[itemId] = clamped;
    else delete next[itemId];

    onChange({ kit: next });
  }

  // when golfers are reduced on the first step, trim the kit to match
  useEffect(() => {
    if (isLoading || allItems.length === 0) return;
    const next: Record<string, number> = { ...kit };
    let changed = false;

    kitCategories.forEach((cat) => {
      let remaining = golfers;
      allItems
        .filter((i) => i.category === cat.id && next[i.id])
        .forEach((i) => {
          const keep = Math.min(next[i.id], remaining);
          remaining -= keep;
          if (keep !== next[i.id]) {
            changed = true;
            if (keep > 0) next[i.id] = keep;
            else delete next[i.id];
          }
        });
    });

    if (changed) onChange({ kit: next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [golfers, allItems, isLoading]);

  // pick a package and drop selected items from the other tier
  function selectPackage(id: string) {
    const tier: Tier = id === "premium" ? "premium" : "standard";

    const nextKit: Record<string, number> = {};
    Object.entries(kit).forEach(([itemId, qty]) => {
      const item = allItems.find((i) => i.id === itemId);
      if (item && matches(item, filters, tier)) nextKit[itemId] = qty;
    });

    onChange({ packageId: id, kit: nextKit });
  }

  // change a filter and drop selected items that no longer match it
  function changeFilter(key: FilterKey, value: string) {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);

    const nextKit: Record<string, number> = {};
    Object.entries(kit).forEach(([id, qty]) => {
      const item = allItems.find((i) => i.id === id);
      if (item && matches(item, nextFilters)) nextKit[id] = qty;
    });

    const patch: Partial<BookingState> = { kit: nextKit };
    if (value !== "all") {
      if (key === "gender") patch.gender = value as BookingState["gender"];
      if (key === "hand") patch.hand = value as BookingState["hand"];
    }
    onChange(patch);
  }

  const activeCat = kitCategories.find((c) => c.id === activeCategory)!;
  const visibleItems = itemsFor(activeCat.id);
  const usedActive = usedInCategory(activeCat.id);
  const selectedPackageIndex = packages.findIndex((p) => p.id === packageId);

  return (
    <div className="mt-4 space-y-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-900/10 sm:mt-8 sm:p-6 lg:p-8">
      {/* ---------- Packages (static data, renders instantly) ---------- */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Choose your package
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Tap a package to select it. Swipe or use the arrows to compare.
        </p>

        <div role="radiogroup" aria-label="Package" className="mt-4">
          <CardCarousel mobileOnly scrollToIndex={selectedPackageIndex}>
            {packages.map((p) => (
              <ImageSliderCard
                key={p.id}
                images={p.images}
                title={p.title}
                description={p.description}
                badge={p.badge}
                selected={packageId === p.id}
                onClick={() => selectPackage(p.id)}
              >
                <ul className="space-y-1 text-xs">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-1.5">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700" />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-xs text-slate-500">
                  Total for {golfers} {golfers === 1 ? "golfer" : "golfers"}:{" "}
                  <span className="font-semibold text-slate-800">
                    {formatPrice(p.prices[category] * golfers, category)}
                  </span>
                </p>
                {p.savings[category] > 0 && (
                  <span className="mt-1 block w-fit rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    Save {formatPrice(p.savings[category], category)}
                  </span>
                )}
              </ImageSliderCard>
            ))}
          </CardCarousel>
        </div>
      </section>

      {/* ---------- Customise ---------- */}
      <section>
        <h2 className="text-lg font-bold text-slate-900">Customise your kit</h2>
        <p className="mt-1 text-sm text-slate-600">
          Optional. See what&lsquo;s included, upgrade items, or add a caddie or
          coach. You can have one per golfer in each group.
        </p>

        {isLoading ? (
          // skeleton: tabs and counts only appear once all data is ready
          <div className="mt-4 space-y-4" aria-busy="true">
            <div className="flex gap-2 overflow-hidden">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 shrink-0 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* category tabs */}
            <div className="mt-4">
              <AppTabs
                variant="pill"
                className="flex-wrap gap-2 border-0 bg-transparent p-0 backdrop-blur-none dark:bg-transparent"
                triggerClassName="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-600 shadow-none
      hover:border-[#10B759]/50 hover:bg-[#10B759]/5 hover:text-[#0E9F4F]
      data-[state=active]:border-[#10B759]/30 data-[state=active]:bg-none data-[state=active]:bg-[#10B759]/[0.15]
      data-[state=active]:text-[#0E9F4F] data-[state=active]:shadow-none
      dark:border-white/10 dark:bg-white/5 dark:text-slate-300
      dark:data-[state=active]:border-[#10B759]/40 dark:data-[state=active]:bg-[#10B759]/20 dark:data-[state=active]:text-[#4ADE80]"
                items={kitCategories.map((c) => ({
                  value: c.id,
                  label: c.label,
                }))}
                value={activeCategory}
                onValueChange={setActiveCategory}
              />
            </div>

            <div className="mt-4 space-y-4">
              {/* filter tabs: only the ones this category needs */}
              {activeCat.filters.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {activeCat.filters.map((key) => (
                    <AppTabs
                      key={key}
                      variant="pill"
                      items={filterOptions[key]}
                      value={current[key]}
                      onValueChange={(v) => changeFilter(key, v)}
                    />
                  ))}
                </div>
              )}

              {/* progress: one kit per golfer */}
              <p
                className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600"
                aria-live="polite"
              >
                <span className="font-semibold text-slate-800">
                  {usedActive} of {golfers}
                </span>{" "}
                {activeCat.label.toLowerCase()} chosen
                {usedActive < golfers && " · one per golfer"}
              </p>

              {isError && (
                <p className="text-sm text-red-600">
                  Could not load some items. Please refresh the page.
                </p>
              )}
              {visibleItems.length === 0 && (
                <p className="text-sm text-slate-500">
                  Nothing available for this selection. Try a different filter.
                </p>
              )}

              {visibleItems.length > 0 && (
                <div role="radiogroup" aria-label={activeCat.label}>
                  {/* key: start from the first card when the tab or filter changes */}
                  <CardCarousel
                    key={`${activeCategory}-${filters.gender}-${filters.hand}-${packageTier}`}
                  >
                    {visibleItems.map((item) => {
                      const qty = kit[item.id] ?? 0;
                      // most this item can reach: its own qty plus what's still free
                      const maxForItem =
                        golfers === 1 ? 1 : qty + (golfers - usedActive);

                      return (
                        <ImageSliderCard
                          key={item.id}
                          images={item.images}
                          title={item.title}
                          description={item.description}
                          badge={item.tag}
                          selected={qty > 0}
                          onClick={() =>
                            setQty(item.id, activeCat.id, qty > 0 ? 0 : 1)
                          }
                        >
                          <div
                            className="flex items-center justify-between gap-3"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            <span className="text-xs text-slate-500">
                              {qty > 0 ? `${qty} added` : "Tap card to add"}
                            </span>
                            <QuantityStepper
                              size="sm"
                              variant="outline"
                              label={item.title}
                              value={qty}
                              min={0}
                              max={maxForItem}
                              onChange={(n) =>
                                setQty(item.id, activeCat.id, n)
                              }
                            />
                          </div>
                        </ImageSliderCard>
                      );
                    })}
                  </CardCarousel>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {footer && <div className="border-t border-slate-200 pt-6">{footer}</div>}
    </div>
  );
}