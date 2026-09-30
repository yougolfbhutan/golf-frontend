import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../../AcessessManagement/permission/data";
//form Data
export const SouvenirFields: PermssionForm[] = [
  {
    name: "name",
    label: "Souvenir Name",
    type: "text",
    placeholder: "Enter your Souvenir Name",
    validation: Yup.string().required("Souvenir name is required"),
    Icon: RollerCoaster,
  },

  {
    name: "categoryId",
    label: "Souvenir Category",
    type: "select",
    placeholder: "Enter Souvenir Category",
    validation: Yup.string().required("Souvenir Category is required"),
    options: [
      { label: "Golf Ball", value: "1" },
      { label: "Cap", value: "2" },
      { label: "T-shirts", value: "3" },
    ],
  },
  {
    name: "description",
    label: "Souvenir Description",
    type: "text",
    placeholder: "Enter your Souvenir Description",
    validation: Yup.string().required("Souvenir description is required"),
    Icon: RollerCoaster,
  },
];
