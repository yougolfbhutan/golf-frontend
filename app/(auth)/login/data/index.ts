import { Lock, Mail } from "lucide-react";
import type { SignInAttributes } from "../interface";

export const formloginFields = [
  {
    type: "inputwithicon",
    name: "email",
    label: "Email",
    placeholder: "Enter your Email",

    Icon: Mail,
  },
  {
    type: "inputwithicon",
    name: "password", // Changed from "Password" to "password"
    label: "Password",
    Icon: Lock,
    placeholder: "Enter your Password",

    subType: "password",
  },
  {
    type: "checkbox",
    name: "checkbox",
    label: "Remember me", // Also consider changing this label
  },
];

export const initialValues: SignInAttributes = {
  email: "",
  password: "",
};
