export interface CaddieFormAttributes {
    caddie_name: string;
    cidNo: string;
    phone_number: string;
}

export interface CaddieData{
  id: number;
  caddiename: string;
  cidNo: string;
  phone_number: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetCaddiesData {
  caddies: CaddieData[];
  meta: PaginationMeta;
}

export interface GetCaddiesResponse {
  status: number;
  message: string;
  data: GetCaddiesData;
}