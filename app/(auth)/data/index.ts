import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type {
  SignInAttributes,
  AuthField,
  RegisterAttributes,
} from "../interface";

/* ---------- Countries ---------- */
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const flagEmoji = (iso: string) =>
  iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

export const COUNTRY_CODES = getCountries()
  .map((iso) => ({
    iso, // "BT", "IN", "US"...
    dial: `+${getCountryCallingCode(iso)}`,
    name: regionNames.of(iso) ?? iso,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/* ---------- Sign in ---------- */
export const signInInitialValues: SignInAttributes = {
  email: "",
  password: "",
};

export const formloginFields: AuthField[] = [
  {
    type: "input",
    subType: "email",
    name: "email",
    label: "Email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Your password",
    autoComplete: "current-password",
  },
];

/* ---------- Register ---------- */
export const registerInitialValues: RegisterAttributes = {
  name: "",
  email: "",
  country_code: "BT", // ISO country, not "+975"
  phone_no: "",
  // identification_no: "",
  password: "",
  is_active: true,
  is_verified: false, // let the server verify the account
  permission: [],
  roles: [],
};

export const registerTopFields: AuthField[] = [
  {
    type: "input",
    name: "name",
    label: "Full name",
    placeholder: "Karma Wangchuk",
    autoComplete: "name",
  },
  // {
  //   type: "input",
  //   name: "identification_no",
  //   label: "CID number",
  //   placeholder: "11 digit CID",
  //   inputMode: "numeric",
  // },
  {
    type: "phone",
    name: "phone_no", // the number; the country is stored in "country_code"
    label: "Mobile number",
    placeholder: "17 123 456",
  },
];

export const registerBottomFields: AuthField[] = [
  {
    type: "input",
    subType: "email",
    name: "email",
    label: "Email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "At least 8 characters",
    autoComplete: "new-password",
  },
];