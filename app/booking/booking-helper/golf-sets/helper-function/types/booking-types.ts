import type { AddonKey } from "../booking/booking-data";

export type Tier = "standard" | "premium";

export const TIERS: { id: Tier; label: string }[] = [
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
];

export type FetchStatus = "loading" | "ready" | "error";

/** What every card in the UI works with. */
export type EquipmentCard = {
  /** Variant id – must match the id used in PRICES for this addonKey */
  id: string;
  addonKey: AddonKey;
  name: string;
  description: string;
  imageUrl?: string;
  /** undefined = shown under both tabs */
  tier?: Tier;
  /** empty = suitable for everyone */
  audience: string[];
  /** from the API; falls back to local PRICES if missing */
  price?: number;
};

const AUDIENCE_LABELS: Record<string, string> = {
  all: "Everyone",
  men: "Men",
  women: "Women",
  junior: "Junior",
};

export const audienceLabel = (a: string) =>
  AUDIENCE_LABELS[a] ?? a.charAt(0).toUpperCase() + a.slice(1);

export const matchesFilters = (
  c: EquipmentCard,
  tier: Tier,
  audience: string,
) =>
  (!c.tier || c.tier === tier) &&
  (audience === "all" || c.audience.length === 0 || c.audience.includes(audience));