import { Mail, Lock, Phone, User } from "lucide-react";

export const RegisterFormFields = [
  {
    type: "inputwithicon",
    name: "customer_name",
    placeholder:'Enter your Name',
    label: "Name",
    Icon: User,
  },
  {
    type: "inputwithicon",
    name: "email",
    placeholder:'Enter your Email',
    label: "Email",
    Icon: Mail,
  },
  {
    type: "inputwithicon",
    name: "phone_number",
     placeholder:'Enter your Phone Number',
    label: "Phone Number",
    Icon: Phone,
  },
  {
    type: "inputwithicon",
    name: "password", // Changed from "Password" to "password"
    label: "Password",
    placeholder:'Enter your Password',
    Icon: Lock,
    subType: "password",
  },
  // {
  //   type: "inputwithicon",
  //   name: "confirm_password", // Changed from "Password" to "password"
  //   label: "Confirm Password",
  //   Icon: Lock,
  //   subType: "password",
  // },
];
export const initialValues = {
  customer_name: "",
  email: "",
  phone_number: "",
  password: "",
  // confirm_password: "",
};
