import * as Yup from "yup";

export const validationSignSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format") // Add email validation
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"), // Fixed the message (you said 8 but min is 6)
});

export const validationSignUpSchema = Yup.object().shape({
  customer_name: Yup.string().required("Your Name  is required"),

  email: Yup.string()
    .email("Invalid email format") // Add email validation
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 8 characters long"),
  phone_number: Yup.number()
    .required("Phone Number is required")
    .min(8, "Phone Number must be at least 8 characters log"),
});

export const ValidationForgotPassword = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format") // Add email validation
    .required("Email is required"),
});
export const ValidationResetPassword = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 8 characters long"),
  new_password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 8 characters long"),
});
