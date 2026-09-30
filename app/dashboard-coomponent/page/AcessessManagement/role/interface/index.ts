export interface RoleFormValues {
role_name: string;
permission_ids: number[]; // Define the structure of permission IDs here
  // Define the structure of permission form values here
}
interface Permission {
  id: number;
  permission_name: string;
}
 
interface RolePermission {
  roleId: number;
  permissionId: number;
  permission: Permission;
}

export interface RoleData {
  id: number;
  role_name: string;
  permissions: RolePermission[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RolesData {
  roles: RoleData[];
  pagination: Pagination;
}

export interface GetRolesResponse {
  status: number;
  message: string;
  data: RolesData;
}