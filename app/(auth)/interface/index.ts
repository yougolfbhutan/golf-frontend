/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SignInAttributes {
  email: string;
  password: string;
}

export interface RegisterAttributes {
   name: string;
  email: string;
  phone_no: string;
  // identification_no: string;
  password: string;
  is_active: boolean;
  is_verified: boolean;
  roles: string[];
  country_code?:any
  permission: string[];
}

/** Shape of one entry in the field config arrays (passed to FormikController as fieldConfig). */
export interface AuthField {
  type: "input" | "password" | "select" | "inputwithicon" | "switch" | "phone";
  name: string;
  label: string;
  placeholder?: string;
  subType?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
  values?: readonly string[];
}