export interface UserFormAttributes{
    customer_name: string;
    email: string;
    password: string;
    phone_number: string;
    roles: number[];
    permissions: number[];
}
export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserData {
  id: number;
  customer_name: string;
  email: string;
  phone_number: string;
  createdAt: string; // or Date, if you parse it before use
  updatedAt: string; // or Date
  roles: Role[];
  permissions: Permission[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersData {
  data: UserData[];
  meta: PaginationMeta;
}

export interface GetUsersResponse {
  status: number;
  message: string;
  data: GetUsersData;
}