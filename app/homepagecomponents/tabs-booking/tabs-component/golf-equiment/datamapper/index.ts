import type { Carryset, GolfSet } from "../interface";

export function mapCarrysetToGolfSet(item: Carryset): GolfSet {
  const roundName = item.roundType?.roundname?.trim().toLowerCase() ?? "";
  const categoryName = item.peopleCategory?.peoplecategoryname?.trim().toLowerCase() ?? "";

  return {
    id: String(item.id),
    name: item.carrysetname.trim(),
    brand: item.caddie?.caddiename ?? "Unknown Caddie",
    description: `Caddie: ${item.caddie?.caddiename ?? "N/A"} · CID: ${item.caddie?.cidNo ?? "N/A"}`,
    price: 0,
    category:
      categoryName === "ladies" ? "ladies" :
      categoryName === "juniors" ? "juniors" :
      "mens",
    tier: roundName.includes("premium") ? "premium" : "regular",
    image: item?.url??'',
    availability: item.availability,
  };
}

export function mapCarrysetsToGolfSets(items: Carryset[] = []): GolfSet[] {
  return items.map(mapCarrysetToGolfSet);
}