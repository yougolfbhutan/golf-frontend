import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { FieldConfig } from "@/app/dashboard-coomponent/customDialogbox";

export const GlovesFields: FieldConfig[] = [
  {
    name: "name",
    label: "Glove Name",
    type: "text",
    placeholder: "Enter glove name",
    validation: Yup.string().required("Glove name is required"),
    Icon: RollerCoaster,
  },
  {
    name: "audienceId",
    label: "Audience Category",
    type: "select",
    placeholder: "Select audience category",
    validation: Yup.string().required("Audience category is required"),
    options: [
      { label: "Mens", value: "1" },
      { label: "Ladies", value: "2" },
    ],
  },
  {
    name: "size",
    label: "Size",
    type: "select",
    placeholder: "Select size",
    validation: Yup.string().required("Size is required"),
    options: [
      { label: "Small", value: "Small" },
      { label: "Medium", value: "Medium" },
      { label: "Large", value: "Large" },
    ],
  },
  {
    name: "handedness",
    label: "Handedness",
    type: "select",
    placeholder: "Select handedness",
    validation: Yup.string().required("Handedness is required"),
    options: [
      { label: "Left", value: "Left" },
      { label: "Right", value: "Right" },
    ],
  },
  {
    name: "tierName",
    label: "Tier",
    type: "select",
    placeholder: "Select tier",
    validation: Yup.string().required("Tier is required"),
    options: [
      { label: "Standard", value: "standard" },
      { label: "Premium", value: "premium" },
    ],
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    placeholder: "Enter quantity",
    validation: Yup.number().min(0).required("Quantity is required"),
    Icon: RollerCoaster,
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "Enter price",
    validation: Yup.number().min(0).required("Price is required"),
    Icon: RollerCoaster,
  },
  {
    name: "image",
    label: "Upload Image",
    type: "image",
    placeholder: "Upload image",
    Icon: RollerCoaster,
  },
];