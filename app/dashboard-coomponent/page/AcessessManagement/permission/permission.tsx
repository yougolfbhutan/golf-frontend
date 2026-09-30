/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { fields } from "./form-data";
// import Loader from "@/common-component/loader";
// import { PermissionFormValues } from "./interface";
import { showToast } from "nextjs-toast-notify";

import { useGetPermissions, usePermissionMutations } from "./tanstack";
import type { Permission, PermissionFormValues } from "./interface";
import { fields } from "./data";
import { DataTable, type ActionConfig, type Column } from "@/app/dashboard-coomponent/table/table";
import { CustomDialog } from "@/app/dashboard-coomponent/customDialogbox";
// import type { Permission } from "./interface";



export default function PermissionPage() {
  const [selected, setSelected] = useState<Permission[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [rowValues, setRowValues] = useState<Partial<Permission>>({});

  const { createPermission, updatePermission, deletePermission, isLoading } =
    usePermissionMutations({
      onSuccess: (data) => {
        showToast.success(data.message, {
          duration: 5000,
          position: "top-right",
          transition: "topBounce",
          icon: "",
          sound: true,
        });
        setIsDialogOpen(false);
        setEditingRowId(null);
        setRowValues({});
      },
      onError: (error) => {
        showToast.error(error?.data?.message, {
          duration: 5000,
          position: "top-right",
          transition: "topBounce",
          icon: "",
          sound: true,
        });
      },
    });

  const { data: permissionData, isLoading: isPermissionLoading } =
    useGetPermissions();
    const DataOnly = permissionData?.data.data

  const filteredData: Permission[] = useMemo(() => {
    if (!DataOnly) return [];

    if (!searchQuery.trim()) return DataOnly;

    const query = searchQuery.toLowerCase();
    return DataOnly.filter(
      (permission) =>
        permission.permission_name.toLowerCase().includes(query) 
    );
  }, [DataOnly, searchQuery]);

  const handleEdit = (row: Permission) => {
    setEditingRowId(row.id);
    setRowValues({ ...row });
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setRowValues({});
  };
  const handleSave = () => {
    console.log(rowValues, "rowValues");
    updatePermission({
      id: rowValues.id as number,
      data: {
        permission_name: rowValues.permission_name || "",
        // description: rowValues.description || "",
      },
    });
  };
  const handleDelete = (row: Permission) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the permission "${row.permission_name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;
    deletePermission(row.id);
  };

  const columns: Column<Permission>[] = [
    {
      header: "S.No",
      render: (_, row) => {
        // Find index of row in filteredData
        const rowIndex = filteredData.findIndex((r) => r.id === row.id);
        return rowIndex + 1;
      },
    },
    {
      header: "Name",
      accessor: "permission_name",
      render: (_, row) =>
        editingRowId === row.id ? (
          <Input
            value={rowValues.permission_name || ""}
            onChange={(e) =>
              setRowValues({ ...rowValues, permission_name: e.target.value })
            }
            className="max-w-xs focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
            placeholder="Enter name"
          />
        ) : (
          row.permission_name
        ),
    },
  
  ];

  // Dynamic actions based on editing state
  const getActions = (): ActionConfig<Permission>[] => {
    if (editingRowId === null) {
      // Normal mode: Show Edit and Delete
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
    } else {
      // Editing mode: Show Save and Cancel for the editing row, hide for others
      return [
        {
          label: "Save",
          icon: <Save className="h-4 w-4" />,
          onClick: handleSave,
          show: (row) => row.id === editingRowId,
        },
        {
          label: "Cancel",
          icon: <X className="h-4 w-4" />,
          onClick: handleCancel,
          show: (row) => row.id === editingRowId,
        },
      ];
    }
  };
  const handleCreateSubmit = (values: Record<string, any>) => {
    createPermission(values as PermissionFormValues);
  };

  return (
    <>
      {isLoading && <h1>Hy jellp</h1>}

      <div className="min-h-screen w-full p-6">
        <div className="flex justify-between items-center gap-4 pb-3">
          {/* Search input wrapper */}
          <div className="relative w-1/3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <Input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 h-12 rounded-md border-slate-200 bg-white text-sm text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              disabled={editingRowId !== null}
            />
          </div>

          {/* Create button */}
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-orange-500 text-white hover:bg-orange-600 h-12 px-6 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={editingRowId !== null}
          >
            Create Permission
          </Button>
        </div>

        {editingRowId !== null && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 flex items-center justify-between">
            <span>
              💡 You are currently editing a permission. Save or cancel to
              enable other actions.
            </span>
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              className="text-blue-800 hover:bg-blue-100"
            >
              Cancel Editing
            </Button>
          </div>
        )}

        {isPermissionLoading ? (
          <h1>loading....</h1>
        ) : (
          <>
            <DataTable
              data={filteredData}
              columns={columns}
              actions={getActions()}
              selectable
              onSelectionChange={setSelected}
              pageSize={5}
            />

            {Array.isArray(filteredData) &&
              filteredData.length === 0 &&
              searchQuery && (
                <div className="text-center py-8 text-gray-500">
                  No permissions found matching &ldquo;{searchQuery}&ldquo;
                </div>
              )}
          </>
        )}
      </div>

      {/* Keep dialog only for creating new permissions */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Create Permission"
        fields={fields}
        onSubmit={handleCreateSubmit}
        OnSubmitTitle="Submit"
        CustomDialogBoxStyle="px-8 py-6 flex flex-col gap-5 overflow-y-auto flex-1"
      />
    </>
  );
}
