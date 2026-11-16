export interface Permission {
  id: number;
  name: string;
}




export interface GetPermissionResponse {
  status: number;
  message: string;
  data: Permission[];
}

//subit data 
export interface PermissionFormValues{
    name:string
}

