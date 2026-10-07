/**
 * audience-tabs.tsx
 * -----------------
 * Small pill-shaped tabs: Everyone | Men | Women | Junior ...
 * The list of audiences comes from the data, so new ones appear automatically.
 */
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ALL_AUDIENCES = "all";

/** Nice labels for known audience values. Unknown ones get capitalised. */
const LABELS: Record<string, string> = {
  // all: "Everyone",
  men: "Men",
  women: "Women",
  junior: "Junior",
};

function labelFor(audience: string) {
  return LABELS[audience] ?? audience.charAt(0).toUpperCase() + audience.slice(1);
}

type AudienceTabsProps = {
  audiences: string[]; // should include ALL_AUDIENCES as the first item
  value: string;
  onChange: (audience: string) => void;
};

export function AudienceTabs({ audiences, value, onChange }: AudienceTabsProps) {
  // Nothing to choose between → don't show the tabs at all
  if (audiences.length <= 1) return null;

  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
        {audiences.map((audience) => (
          <TabsTrigger
            key={audience}
            value={audience}
            className="rounded-full border-2 px-4 py-1.5 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
          >
            {labelFor(audience)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}