export type GolfCategory = "mens" | "ladies" | "juniors";
export type GolfTier = "premium" | "regular";
// interface.ts
export interface CarrysetImage {
  url: string;
  carrysetId: number;
}

export interface Caddie {
  id: number;
  caddiename: string;
  cidNo: string;
  phone_number: string;
}

export interface Carryset {
  id: number;
  carrysetname: string;
  availability: boolean;
  caddieId: number;
  caddie: Caddie;
  urls: CarrysetImage[];
}

export interface GolfSet {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  tier: string;
  tag?: "new" | "lefty";
  image?: string;
  availability?: boolean;
}

export interface BookingStep {
  value: string;
  number: number;
  label: string;
}


export interface Caddie {
  id: number;
  caddiename: string;
  cidNo: string;
  phone_number: string;
}

export interface PeopleCategory {
  id: number;
  peoplecategoryname: string;
}

export interface RoundType {
  id: number;
  roundname: string;
}

export interface Carryset {
  id: number;
  carrysetname: string;
  availability: boolean;
  caddieId: number;
  peopleCategoryId: number;
  roundTypeId: number;
  caddie: Caddie;
  peopleCategory: PeopleCategory;
  roundType: RoundType;
  url: string | null;
}

export interface CarrysetResponse {
  status: number;
  data: Carryset[];
  message: string;
}