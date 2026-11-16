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
  isTourism: boolean;      // NEW
  tourism_name: string;    // NEW
}

/** Shape of one entry in the field config arrays (passed to FormikController as fieldConfig). */
export interface AuthField {
  type?: string;
  subType?: string;
  name: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  // NEW: only render this field when this Formik value is truthy
  showWhen?: string;
}