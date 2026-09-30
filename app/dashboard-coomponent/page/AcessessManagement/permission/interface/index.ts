export interface Permission {
  id: number;
  permission_name: string;
}

interface PermissionMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PermissionData {
  data: Permission[];
  meta: PermissionMeta;
}



export interface GetPermissionResponse {
  status: number;
  message: string;
  data: PermissionData;
}

//subit data 
export interface PermissionFormValues{
    permission_name:string
}

