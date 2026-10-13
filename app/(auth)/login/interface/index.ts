export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone_no: string;
  country_code: string;
  is_active: boolean;
  is_verified: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  roles: { id: number; name: string; description: string }[];
  permissions: { id: number; name: string; description: string }[];
}

export interface SignInResponseAttributes {
  success: boolean;
  message: string;
  data: AuthUser; // the user, tokens are in cookies
}

export interface SignInAttributes {
  email: string;
  password: string;
}

export interface SignUpResponseAttributes {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface SignUpAttributes {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}