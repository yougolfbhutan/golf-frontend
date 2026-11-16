export interface UserFormAttributes {
  name: string;
  email: string;
  password: string;
  phone_no: string;
  country_code: string;
  is_tourism: boolean;
  tourism_name: string | null;
  roles: string[];
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone_no: string;
  country_code: string;
  is_active: boolean;
  is_verified: boolean;
  is_tourism: boolean;
  tourism_name: string | null;
  last_login: string | null;
  refresh_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: Role[];
  permissions: Permission[];
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: UserData[];
}