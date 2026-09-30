export interface CarrySetAttributes {
  carrysetname: string;
  peopleId: number;
  roundId: number;
  availability: boolean;
  urls?: string[];
  caddieId: number;
}
export interface Caddie {
  id: number;
  caddiename: string;
  cidNo: string;
  phone_number: string;
}
export interface peopleCategory {
  id: number;
  peoplecategoryname: string;
}
export interface roundType {
  id: number;
  roundname: string;
}

export interface CarrySet {
  id: number;
  carrysetname: string;
  availability: boolean;
  caddie: Caddie | null;
  peopleCategory: peopleCategory | null;
  roundType: roundType | null;
  urls: string[];
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CarrySetData {
  carrySets: CarrySet[];
  meta: Meta;
}

export interface GetCarrySetsResponse {
  status: number;
  message: string;
  data: CarrySetData;
}