import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../../AcessessManagement/permission/data";
//form Data
export const CarrySetFields = (CaddiesOptions: { label: string; value: string }[]): PermssionForm[] => [
  {
    name: "carrysetname",
    label: "Carry Set Name",
    type: "text",
    placeholder: "Enter your Carry Set Name",
    validation: Yup.string().required("Carry Set name is required"),
    Icon: RollerCoaster,
  },

  {
    name: "peopleId",
    label: "People Category",
    type: "select",
    placeholder: "Enter People Category",
    validation: Yup.string().required("People Category is required"),
    options: [
      { label: "Mens", value: "1" },
      { label: "Ladies", value: "2" },
      { label: "Juniors", value: "3" },
    ],
  },
  {
    name: "roundId",
    label: "Round Type",
    type: "select",
    placeholder: "Enter Round Type",
    validation: Yup.string().required("Round Type is required"),
    options: [
      { label: "Regular", value: "1" },
      { label: "Premium", value: "2" },
    ],
  },
  {
    name: "caddieId",
    label: "Caddie Name",
    type: "select",
    placeholder: "Enter Caddie Name",
    validation: Yup.string().required("Caddie Name is required"),
    options:CaddiesOptions
  },
   {
    name: "availability",
    label: "Availability",
    type: "select",
    placeholder: "Enter Availability",
    validation: Yup.string().required("Availability is required"),
    options: [
      { label: "true", value: "true" },
      { label: "false", value: "false" },
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
