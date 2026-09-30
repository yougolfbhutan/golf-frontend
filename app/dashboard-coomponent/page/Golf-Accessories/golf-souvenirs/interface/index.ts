export interface SouvenirAttributes {
    name: string;
    description:string
    categoryId: number;
    // urls?: string[]; // Optional array of strings for URLs
}

interface Category {
  id: number;
  name: string;
}

interface Variant {
  // TODO: fill in actual variant fields (e.g. id, sku, price, urls, etc.)
  // left as unknown shape since the sample array is empty
  [key: string]: unknown;
}

export interface Souvenir {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  category: Category;
  variants: Variant[];
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SouvenirsData {
  souvenirs: Souvenir[];
  meta: Meta;
}

export interface GetSouvenirsResponse {
  status: number;
  message: string;
  data: SouvenirsData;
}