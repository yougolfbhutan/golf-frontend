/**
 * tier-tabs.tsx
 * -------------
 * The big "Standard | Premium" tabs at the top of the page.
 */
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tier } from "../interface";

const TIERS: { value: Tier; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

type TierTabsProps = {
  value: Tier;
  onChange: (tier: Tier) => void;
};

export function TierTabs({ value, onChange }: TierTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Tier)}>
      <TabsList className="grid h-12 w-full grid-cols-2 sm:w-96">
        {TIERS.map((tier) => (
          <TabsTrigger key={tier.value} value={tier.value} className="text-base">
            {tier.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}