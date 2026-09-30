/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldType } from "@/app/dashboard-coomponent/customDialogbox";
import { FieldConfig } from "formik";
import {  User } from "lucide-react";
import * as Yup from "yup";
type CustomFieldConfig = FieldConfig & {
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  optionGroups?: any[];
  Icon?: React.ComponentType<any>;
  validation?: any;
  defaultValue?: any;
};
export const UserCreatefields: CustomFieldConfig[] = [
  {
    name: "customer_name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your name",
    validation: Yup.string().required("Name is required"),
    Icon: User,
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    placeholder: "Enter your email",
    validation: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    Icon: User,
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    placeholder: "Enter your password",
    validation: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    Icon: User,
  },
 {
    name: "phone_number",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter your phone number",
    validation: Yup.string()
      .min(8, "Phone number must be at least 8 characters")
      .required("Phone number is required"),
    Icon: User,
  },
  {
    name: "roles",
    label: "Roles",
    type: "checkbox-group",
    optionGroups: [],
  },
  {
    name: "permissions",
    label: "Permissions",
    type: "checkbox-group",
    optionGroups: [],
  },
];
