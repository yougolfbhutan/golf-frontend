import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../../AcessessManagement/permission/data";
import type { FieldConfig } from "@/app/dashboard-coomponent/customDialogbox";
//form Data
export const GolfSetFields: FieldConfig[] = [
  {
    name: "name",
    label: "GolfSet Name",
    type: "text",
    placeholder: "Enter your GolfSet Name",
    validation: Yup.string().required("GolfSet Name is required"),
    Icon: RollerCoaster,
  },

  {
    name: "audienceId",
    label: "Audience Category",
    type: "select",
    placeholder: "Enter People Category",
    validation: Yup.string().required("People Category is required"),
    options: [
      { label: "Mens", value: "1" },
      { label: "Ladies", value: "2" },
      // { label: "Juniors", value: "3" },
    ],
  },
  {
    name: "handedness",
    label: "Handness",
    type: "select",
    placeholder: "Enter handedness",
    validation: Yup.string().required("handedness is required"),
    options: [
      { label: "Left", value: "1" },
      { label: "Right", value: "2" },
    ],
  },

  {
    name: "tierName",
    label: "tierName",
    type: "select",
    placeholder: "Enter tierName",
    validation: Yup.string().required("tierName is required"),
    options: [
       { label: "Standard", value: "standard" },
      { label: "Premium", value: "premium" },
    ],
  },
  {
    name: "quantity",
    label: "quantity",
    type: "number",
    placeholder: "Enter your quantity",
    validation: Yup.number().required("quantity is required"),
    Icon: RollerCoaster,
  },
  {
    name: "price",
    label: "price",
    type: "number",
    placeholder: "Enter your price",
    validation: Yup.number().required("price is required"),
    Icon: RollerCoaster,
  },
  {
    name: "image",
    label: "Upload Images",
    type: "image",
    placeholder: "Upload Images",

    Icon: RollerCoaster,
  },
];
