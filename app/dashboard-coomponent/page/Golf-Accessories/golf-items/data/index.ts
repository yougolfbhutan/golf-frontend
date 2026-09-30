import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../../AcessessManagement/permission/data";
//form Data
export const ItemVariantFields = (itemOptions:{label: string, value: string}[]): PermssionForm[] => [
   {
    name: "itemId",
    label: "Item",
    type: "select",
    placeholder: "Enter Item",
    validation: Yup.string().required("Item is required"),
    options: itemOptions,
  },
    {
    name: "color",
    label: "Color",
    type: "text",
    placeholder: "Enter your Item Name",
    validation: Yup.string().required("Item name is required"),
    Icon: RollerCoaster,
  },

  {
    name: "size",
    label: "Size",
    type: "select",
    placeholder: "Enter Item Size",
    validation: Yup.string().required("Item Size is required"),
    options: [
      { label: "XXL", value: "XXL" },
      { label: "Medium", value: "Medium" },
      { label: "Small", value: "Small" },
      { label: "Large", value: "Large" },
    ],
  },
  {
    name: "packQuantity",
    label: "Pack Quantity",
    type: "number",
    placeholder: "Enter Pack Quantity",
    validation: Yup.number().required("Pack quantity is required").positive("Pack quantity must be a positive number"),
    Icon: RollerCoaster,
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "Enter Price",
    validation: Yup.number().required("Price is required").positive("Price must be a positive number"),
    Icon: RollerCoaster,
  },
    {
    name: "stockQty",
    label: "Stock Quantity",
    type: "number",
    placeholder: "Enter Stock Quantity",
    validation: Yup.number().required("Stock quantity is required").positive("Stock quantity must be a positive number"),
    Icon: RollerCoaster,
  },
   {
    name: "availability",
    label: "Availability",
    type: "select",
    placeholder: "Enter Item Availability",
    validation: Yup.string().required("Item availability is required"),
    options: [
      { label: "In Stock", value: "true" },
      { label: "Out of Stock", value: "false" },
    ],
  },
   {
    name: "urls",
    label: "Upload Images",
    type: "image",
    placeholder: "Upload Images",

    Icon: RollerCoaster,
  },
];
