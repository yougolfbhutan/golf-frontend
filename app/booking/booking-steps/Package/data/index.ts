import type { BallAttributes } from "../interface/ball-interface";
import type { GloveAttributes } from "../interface/glove-interface";
import type { GolfSetAttributes } from "../interface/interface";

export type PackageId = "standard" | "premium" | "green-fee";
export type Tier = "standard" | "premium";
export type Gender = "men" | "women";
export type Hand = "left" | "right";
export type FilterKey = "gender" | "hand"; // tier comes from the package

/** Golfer categories. Rename the ids to match your CATEGORIES data. */
export type CategoryId = "bhutanese" | "saarc" | "international";

/** Bhutanese pay in Nu, SAARC and international golfers pay in USD */
export const currencyByCategory: Record<CategoryId, "Nu" | "USD"> = {
  bhutanese: "Nu",
  saarc: "USD",
  international: "USD",
};

export function formatPrice(
  amount: number | undefined | null,
  categoryId: CategoryId,
) {
  const value = Number.isFinite(amount) ? (amount as number) : 0;
  return currencyByCategory[categoryId] === "Nu"
    ? `Nu ${value.toLocaleString()}`
    : `$${value.toLocaleString()}`;
}

/** item id -> quantity */
export type KitState = Record<string, number>;

export type PackageOption = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  /** price per golfer, by golfer category (replace with your real numbers) */
  prices: Record<CategoryId, number>;
  /** saving per golfer, by golfer category */
  savings: Record<CategoryId, number>;
  features: string[];
  images?: string[];
};

export const packages: PackageOption[] = [
  {
    id: "standard",
    title: "Standard package",
    description: "Everything you need for a relaxed round.",
    prices: { bhutanese: 2000, saarc: 40, international: 80 },
    savings: { bhutanese: 200, saarc: 4, international: 8 },
    images: ["/golf-set.jpg", "/ball.jpg", "/glove.jpg"],
    features: [
      "Green fee · 9 holes",
      "Half golf set",
      "2 sleeves of distance balls (6 balls)",
      "1 all-weather glove",
    ],
  },
  {
    id: "premium",
    title: "Premium package",
    description: "Top gear and a caddie for serious play.",
    badge: "MOST PICKED",
    prices: { bhutanese: 4000, saarc: 80, international: 160 },
    savings: { bhutanese: 450, saarc: 9, international: 18 },
    images: ["/golf-set2.jpg", "/ball2.jpg", "/glove2.jpg"],
    features: [
      "Green fee · 9 holes",
      "Full 14-club golf set",
      "2 sleeves of tour balls (6 balls)",
      "1 leather glove",
      "Your own caddie",
    ],
  },
];

export type KitCategoryId = "sets" | "balls" | "gloves" | "caddie";

export type KitItem = {
  id: string; // UI id, e.g. "set-2" (key in kit state)
  apiId?: number; // real database id, e.g. 2
  category: KitCategoryId;
  tier?: Tier;
  gender?: Gender;
  hand?: Hand;
  tag?: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
  stepperLabel?: string;
  images?: string[];
    prices?: Partial<Record<CategoryId, number>>;

};

export const kitCategories: {
  id: KitCategoryId;
  label: string;
  mode: "single" | "quantity";
  /** which filter tabs apply to this category */
  filters: FilterKey[];
}[] = [
  { id: "sets", label: "Golf sets", mode: "quantity", filters: ["gender", "hand"] },
  { id: "balls", label: "Golf balls", mode: "quantity", filters: [] },
  { id: "gloves", label: "Gloves", mode: "quantity", filters: ["gender", "hand"] },
  // { id: "caddie", label: "Caddie & coach", mode: "quantity", filters: [] },
];

/** options for each filter's tabs */
export const filterOptions: Record<FilterKey, { value: string; label: string }[]> = {
  gender: [
    { value: "all", label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
  ],
  hand: [
    { value: "all", label: "All" },
    { value: "left", label: "Left-handed" },
    { value: "right", label: "Right-handed" },
  ],
};

export function mapGolfSets(list: GolfSetAttributes[]): KitItem[] {
  return list.map((s) => ({
    apiId: s.id,
    id: `set-${s.id}`,
    category: "sets" as const,
    tier: (s.tierName ?? "Standard").toLowerCase() as Tier,
    gender: s.audience.name.toLowerCase() as Gender,
    hand: s.handedness.toLowerCase() as Hand,
    title: s.name,
    price: s.price,
    unit: "golfer",
    images: [s.imageUrl],
  }));
}

export function mapGloves(list: GloveAttributes[]): KitItem[] {
  return list.map((g) => ({
    apiId: g.id,
    id: `glove-${g.id}`,
    category: "gloves" as const,
    tier: (g.tierName ?? "Standard").toLowerCase() as Tier,
    gender: g.audience.name.toLowerCase() as Gender,
    hand: g.handedness.toLowerCase() as Hand,
    title: g.name,
    price: g.price,
    unit: "golfer",
    images: [g.imageUrl],
  }));
}

export function mapBalls(list: BallAttributes[]): KitItem[] {
  return list.map((b) => ({
    apiId: b.id,
    id: `ball-${b.id}`,
    category: "balls" as const,
    tier: (b.tierName ?? "Standard").toLowerCase() as Tier,
    title: b.name,
    price: b.price,
    unit: "golfer",
    images: [b.imageUrl],
  }));
}

// static items (nothing right now)
export const kitItems: KitItem[] = [];