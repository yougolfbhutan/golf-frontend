import * as Yup from "yup";
import { RollerCoaster } from "lucide-react";
import type { PermssionForm } from "../../permission/data";
//form Data
export const RolesFields: PermssionForm[] = [
  {
    name: "role_name",
    label: "Role Name",
    type: "text",
    placeholder: "Enter your Role Name",
    validation: Yup.string().required("Role is required"),
    Icon: RollerCoaster,
  },
  {
    name: "permission_ids",
    label: "Permissions",
    type: "checkbox-group",
    optionGroups: [],
  },
];
