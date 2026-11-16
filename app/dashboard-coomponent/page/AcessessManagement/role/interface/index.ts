export interface RoleFormValues {
name: string;
permissions: string[]; // Define the structure of permission IDs here
  // Define the structure of permission form values here
}
export interface Permission {
  id: string;
  name: string;
  description: string | null;
}

export interface RoleData {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
}

export interface RolesGetResponse {
  success: boolean;
  message: string;
  data: RoleData[];
}