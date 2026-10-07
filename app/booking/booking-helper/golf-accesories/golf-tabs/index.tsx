/**
 * option-tabs.tsx
 * ---------------
 * One row of small tabs for a single option, e.g.
 *
 *   Hand   [ Left-handed | Right-handed ]
 *   Size   [ S | M | L | XL ]
 *
 * Values with no stock at all are shown greyed out.
 */
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ItemVariant } from "../interface";
import { type OptionKey, optionValue, isInStock, optionLabel } from "../golf-options";

type OptionTabsProps = {
  optionKey: OptionKey;
  label: string;
  values: string[];
  value?: string;
  variants: ItemVariant[]; // used to check stock per value
  onChange: (value: string) => void;
};

export function OptionTabs({
  optionKey,
  label,
  values,
  value,
  variants,
  onChange,
}: OptionTabsProps) {
  // A value is available if at least one variant with it is in stock
  const hasStock = (v: string) =>
    variants.some((variant) => optionValue(variant, optionKey) === v && isInStock(variant));

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <Tabs value={value} onValueChange={onChange}>
        <TabsList className="h-auto flex-wrap justify-start gap-1">
          {values.map((v) => (
            <TabsTrigger
              key={v}
              value={v}
              disabled={!hasStock(v)}
              className="px-3 py-1 text-sm"
            >
              {optionLabel(optionKey, v)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}