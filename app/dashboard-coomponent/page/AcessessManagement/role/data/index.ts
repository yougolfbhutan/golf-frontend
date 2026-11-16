import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../permission/data";
//form Data
export const RolesFields: PermssionForm[] = [
  {
    name: "name",
    label: "Role Name",
    type: "text",

    validation: Yup.string().required("Role is required"),
    Icon: RollerCoaster,
  },
  {
    name: "permissions",
    label: "Permissions",
    type: "checkbox-group",
    optionGroups: [],
  },
];
