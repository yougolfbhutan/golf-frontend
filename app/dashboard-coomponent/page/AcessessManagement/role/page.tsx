/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "nextjs-toast-notify";
import type { RoleData, RoleFormValues } from "./interface";
import { useGetRoles, useRoleMutations } from "./tanstack";
import { useGetPermissions } from "../permission/tanstack";
import type { PermssionForm } from "../permission/data";
import { DataTable, type ActionConfig, type Column } from "../../../table/table";
import { RolesFields } from "./data";
import { CustomDialog } from "../../../customDialogbox";

export default function Role() {
  const [selected, setSelected] = useState<RoleData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);

  // Role mutations
  const { createRole, updateRole, deleteRole } = useRoleMutations({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      setIsDialogOpen(false);
      setEditingRole(null);
    },
    onError: (error) => {
      showToast.error(error?.data?.message || "Something went wrong", {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
    },
  });

  // Fetch roles
  const { data: roleData } = useGetRoles();

  // Fetch all available permissions
  const { data: permissionValues } = useGetPermissions();

  // Table data
  const roles: RoleData[] = roleData?.data || [];
  const allPermissions = permissionValues?.data || [];

  // Dynamically create permission fields with API data
  const dynamicPermissionFields: PermssionForm[] = useMemo(() => {
    // Get base fields (name and description)
    const baseFields = RolesFields.filter(field => field.name !== "permissions");
    
    // Find the permission field template
    const permissionFieldTemplate = RolesFields.find(field => field.name === "permissions");

    if (!permissionFieldTemplate || !allPermissions.length) {
      return baseFields;
    }

    // Map API permissions to checkbox options
    const apiPermissionOptions = allPermissions.map(permission => ({
      label: permission.name,        // "RN Export and Import"
      value: permission.id           // 1, 2, etc.
    }));

    // If you want to keep multiple groups, distribute permissions
    // For now, putting all permissions in one group
    const updatedOptionGroups = [
      {
        groupName: "Available Permissions",
        options: apiPermissionOptions
      }
    ];
    return [
      ...baseFields,
      {
        ...permissionFieldTemplate,
        optionGroups: updatedOptionGroups
      }
    ];
  }, [allPermissions]);

  // Columns definition
  const columns: Column<RoleData>[] = [
    {
      header: "Name",
      accessor: "name",
    },
 
    {
      header: "Permissions",
      render: (_, row) => {
        if (!row.permissions?.length) {
          return <span className="text-gray-400">No permissions</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {row.permissions.map((permission) => (
              <span
                key={permission.id}
                className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs"
              >
                {permission.name}
              </span>
            ))}
          </div>
        );
      },
    },
  ];

  // Search filter
  const filteredData: RoleData[] = useMemo(() => {
    if (!roles) return [];
    if (!searchQuery.trim()) return roles;

    const query = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) 
    );
  }, [roles, searchQuery]);

  // Action buttons
  const getActions = (): ActionConfig<RoleData>[] => {
    return [
      {
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <Delete className="h-4 w-4" />,
        onClick: handleDelete,
      },
    ];
  };

  // Edit function - Opens dialog with role data
  const handleEdit = (row: RoleData) => {
    setEditingRole(row);
    setIsDialogOpen(true);
  };

  // Delete function
  const handleDelete = (row: RoleData) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the role "${row.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;
    deleteRole(row.id);
  };

  // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    // values will contain: { name: "...", description: "...", permissionIds: [1, 2] }
    
    if (editingRole?.id) {
      // Update existing role
      updateRole({ 
        id: editingRole.id, 
        data: values as RoleFormValues 
      });
    } else {
      // Create new role
      createRole(values as RoleFormValues);
    }
  };

  // Prepare default values for dialog
  const dialogDefaultValues = useMemo(() => {
    if (!editingRole) {
      return {
        role_name: "",
        permission_ids: []
      };
    }
    
    // When editing, convert permissions array to array of IDs
    // From: permissions: [{id: 1, name: "..."}, {id: 2, name: "..."}]
    // To: permission_ids: [1, 2]
    return {
      role_name: editingRole.name,
      permission_ids: editingRole.permissions?.map(p => p.id) || []
    };
  }, [editingRole]);

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center gap-4 pb-3">
        {/* Search input */}
        <div className="relative w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 h-12 rounded-md border-slate-200 bg-white text-sm text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        {/* Create button */}
        <Button
          onClick={() => {
            setEditingRole(null);
            setIsDialogOpen(true);
          }}
          className="h-12 gap-2 rounded-xl bg-[#1F4D36] px-6 font-semibold text-white shadow-md shadow-[#1F4D36]/25 transition hover:bg-[#173d2a] focus-visible:ring-2 focus-visible:ring-[#10B759]/40"
        >
          Create Role
        </Button>
      </div>

      {/* Custom Dialog */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingRole(null);
        }}
        title={editingRole ? "Edit Role" : "Create Role"}
        fields={dynamicPermissionFields}
        defaultValues={dialogDefaultValues}
        onSubmit={handleSubmit}
        OnSubmitTitle={editingRole ? "Update Role" : "Create Role"}
        CustomDialogBoxStyle="px-8 py-6 grid grid-cols-3 gap-5 overflow-y-auto flex-1"
      />
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/5">
        <DataTable
        data={filteredData}
        columns={columns}
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        
      />
      </div>

      {/* Data Table */}
    
    </div>
  );
}

