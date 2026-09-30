/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useFormikContext } from "formik";
import type { BookingFormValues } from "../../booking-form-values";
import { useAccessories } from "./tanstack";
import AccessoryCard from "./helperfunction/accessories-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function AccessoriesGrid({
  onNext,
  onBack,
}: {
  onNext?: () => void;
  onBack?: () => void;
}) {
  const { data, isLoading, isError } = useAccessories();
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();
  const accessories = values.accessories; // AccessoryItem[]

  const groupedByCategory = React.useMemo(() => {
    if (!data?.data) return new Map<string, any[]>();
    const flat = Object.values(data.data).flat();
    const groups = new Map<string, any[]>();
    for (const variant of flat) {
      const categoryName = variant.item?.category?.name ?? "Other";
      const list = groups.get(categoryName) ?? [];
      list.push(variant);
      groups.set(categoryName, list);
    }
    return groups;
  }, [data]);

  const getQty = (variantId: number) =>
    accessories.find((a) => a.itemId === variantId)?.quantity ?? 0;

  const updateQty = (variantId: number, delta: number, maxStock?: number) => {
    const current = getQty(variantId);
    let next = current + delta;
    next = Math.max(0, next);
    if (typeof maxStock === "number") next = Math.min(next, maxStock);

    const withoutThis = accessories.filter((a) => a.itemId !== variantId);
    const nextAccessories =
      next === 0
        ? withoutThis
        : [...withoutThis, { itemId: variantId, quantity: next }];

    setFieldValue("accessories", nextAccessories);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading accessories…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-red-600">
          Couldn&apos;t load accessories. Try again.
        </p>
      </div>
    );
  }

  if (groupedByCategory.size === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No accessories available right now.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-900 mb-1">
          Accessories
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add items to your round. Use the arrows to browse each category.
        </p>

        <div className="space-y-8">
          {Array.from(groupedByCategory.entries()).map(
            ([category, variants]) => (
              <div key={category}>
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-base font-semibold text-emerald-950">
                    {category}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {variants.length} item{variants.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="relative max-w-full">
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent className="-ml-4">
                      {variants.map((item) => (
                        <CarouselItem
                          key={item.id}
                          className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                          <AccessoryCard
                            item={item}
                            qty={getQty(item.id)}
                            onUpdateQty={(delta: number) =>
                              updateQty(item.id, delta, item.stockQty)
                            }
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {variants.length > 3 && (
                      <>
                        <CarouselPrevious className="h-9 w-9 -left-4 border-emerald-200 bg-white shadow-sm hover:bg-emerald-50" />
                        <CarouselNext className="h-9 w-9 -right-4 border-emerald-200 bg-white shadow-sm hover:bg-emerald-50" />
                      </>
                    )}
                  </Carousel>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          className="bg-emerald-950 text-amber-50 hover:bg-emerald-900"
        >
          Next: Confirm →
        </Button>
      </div>
    </>
  );
}

export default AccessoriesGrid;
