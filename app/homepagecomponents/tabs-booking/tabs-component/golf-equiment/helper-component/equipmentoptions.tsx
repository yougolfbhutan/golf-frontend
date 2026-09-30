export type Tier = "premium" | "regular";
export type Category = "mens" | "ladies" | "juniors";

export const CATEGORY_OPTIONS: { key: Category; label: string }[] = [
  { key: "mens", label: "Men's" },
  { key: "ladies", label: "Ladies'" },
  { key: "juniors", label: "Juniors'" },
];

export const TIER_OPTIONS: {
  key: Tier;
  emoji: string;
  label: string;
  // price: string;
  caption: string;
}[] = [
  {
    key: "premium",
    emoji: "✨",
    label: "Premium",
    caption: "Brand new sets",
  },
  {
    key: "regular",
    emoji: "🩶",
    label: "Regular",
    caption: "Good condition used",
  },
];

export const CATEGORY_TO_BACKEND_NAME: Record<Category, string> = {
  mens: "mens",
  ladies: "ladies",
  juniors: "juniors",
};

export const TIER_TO_BACKEND_NAME: Record<Tier, string> = {
  premium: "premium",
  regular: "regular",
};