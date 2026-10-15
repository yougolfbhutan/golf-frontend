import type { CategoryId } from "../../Package/data";

export const MAX_GOLFERS = 4;
export type CategoryIcon = "bhutan" | "saarc" | "globe";

export type Category = {
  id: string; // backend id, sent to the API
  priceKey: CategoryId; // key used in packages[].prices and formatPrice
  label: string;
  description: string;
  price: number;
  currency: "Nu" | "USD";
  icon: CategoryIcon;
};

export const CATEGORIES: Category[] = [
  {
    id: "2",
    priceKey: "bhutanese",
    label: "Bhutanese",
    description: "Citizens with a valid CID",
    price: 3800,
    currency: "Nu",
    icon: "bhutan",
  },
  {
    id: "1",
    priceKey: "saarc",
    label: "Non-Bhutanese · SAARC",
    description:
      "India, Bangladesh, Nepal, Sri Lanka, Maldives, Pakistan, Afghanistan",
    price: 120,
    currency: "USD",
    icon: "saarc",
  },
  {
    id: "3",
    priceKey: "international",
    label: "Non-Bhutanese · Non-SAARC",
    description: "All other nationalities",
    price: 180,
    currency: "USD",
    icon: "globe",
  },
];
