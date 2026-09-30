import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../../AcessessManagement/permission/data";
//form Data
export const CaddieFields: PermssionForm[] = [
  {
    name: "caddiename",
    label: "Caddie Name",
    type: "text",
    placeholder: "Enter your Caddie Name",
    validation: Yup.string().required("Caddie name is required"),
    Icon: RollerCoaster,
  },
    {
    name: "cidNo",
    label: "CID No",
    type: "text",
    placeholder: "Enter CID No",
    validation: Yup.string().required("CID No is required"),
    Icon: RollerCoaster,
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter Phone Number",
    validation: Yup.string().required("Phone number is required"),
    Icon: RollerCoaster,
  },
];
