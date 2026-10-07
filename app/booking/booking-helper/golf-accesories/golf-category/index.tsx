/**
 * category-tabs.tsx
 * -----------------
 * Pill tabs for accessory categories, built from the data:
 *   ( All 8 ) ( Golf ball 3 ) ( Glove 4 ) ( Tee 1 )
 */
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ALL_CATEGORIES = "all";

/** "golf-ball" → "Golf ball" */
export function categoryLabel(name: string): string {
  if (name === ALL_CATEGORIES) return "All";
  const text = name.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type CategoryTabsProps = {
  categories: { name: string; count: number }[]; // without "all"
  value: string;
  onChange: (category: string) => void;
};

export function CategoryTabs({ categories, value, onChange }: CategoryTabsProps) {
  // Only one category? Nothing to choose.
  if (categories.length <= 1) return null;

  const total = categories.reduce((sum, c) => sum + c.count, 0);
  const tabs = [{ name: ALL_CATEGORIES, count: total }, ...categories];

  return (
    <Tabs value={value} onValueChange={onChange} className="mb-4">
      <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
        {tabs.map((c) => (
          <TabsTrigger
            key={c.name}
            value={c.name}
            className="rounded-full border-2 px-4 py-1.5 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
          >
            {categoryLabel(c.name)}
            <span className="ml-1.5 text-xs text-muted-foreground">{c.count}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}