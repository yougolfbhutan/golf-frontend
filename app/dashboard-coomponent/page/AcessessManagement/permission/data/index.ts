/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Dessert, RollerCoaster } from "lucide-react";
// import { PermssionForm } from "../interface";
import * as Yup from "yup";
import type { FieldConfig, FieldType } from "@/app/dashboard-coomponent/customDialogbox";
import { RollerCoaster } from "lucide-react";
export interface PermssionForm extends FieldConfig {
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  Icon?: React.ComponentType<any>;
  validation?: any;
  defaultValue?: any;
}

export const fields: PermssionForm[] = [
    {
      name: "permission_name",
      label: "Permission Name",
      type: "text",
      placeholder: "Enter your name",
      validation: Yup.string().required("Name is required"),
      Icon: RollerCoaster,
    },
    //   {
    //   name: "description",
    //   label: "Description",
    //   type: "text",
    //   placeholder: "Enter your Description",
    //   validation: Yup.string().required("Name is required"),
    //   Icon: Dessert,
    // },
  
  ];


  