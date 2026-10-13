export interface User {
  id: string;
  name: string;
  email: string;
  phone_no: string;
  identification_no: string;
  is_active: boolean;
  is_verified: boolean;
  last_login: string | null;
  refresh_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: string[];
  permissions: string[];
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}