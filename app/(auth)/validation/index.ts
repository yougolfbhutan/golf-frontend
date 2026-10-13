import * as yup from "yup";

export const validationSignSchema = yup.object({
  email: yup.string().email("Enter a valid email address.").required("Enter your email."),
  password: yup.string().required("Enter your password."),
});

import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";

export const validationRegisterSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .required("Enter your full name."),



  country_code: yup.string().required("Select a country."),

  phone_no: yup
    .string()
    .trim()
    .required("Enter your mobile number.")
    .test(
      "valid-phone",
      "Enter a valid mobile number for the selected country.",
      function (value) {
        if (!value) return false;
        return isValidPhoneNumber(value, this.parent.country_code as CountryCode);
      },
    ),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Enter your email."),

  password: yup
    .string()
    .min(8, "Use at least 8 characters.")
    .required("Enter a password."),
});