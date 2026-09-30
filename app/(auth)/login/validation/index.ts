import * as Yup from "yup";

export const validationSignSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format") // Add email validation
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"), // Fixed the message (you said 8 but min is 6)
});
