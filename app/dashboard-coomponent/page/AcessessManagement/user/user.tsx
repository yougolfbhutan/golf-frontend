/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserData, UserFormAttributes } from "./interface";
import { useGetPermissions } from "../permission/tanstack";
import { useGetRoles } from "../role/tanstack";
import { useGetUsers, useUserMutations } from "./tanstack";
import { showToast } from "nextjs-toast-notify";
import { UserCreatefields } from "./formdata";
import { DataTable, type ActionConfig, type Column } from "../../../table/table";
import { CustomDialog } from "../../../customDialogbox";

export default function User() {
  const [selected, setSelected] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  //   // Fetch roles, permissions, and users
  const { data: roleData } = useGetRoles();
  const { data: permissionData } = useGetPermissions();
  const { data: userData } = useGetUsers();

  //   // User mutations
  const { createUser, updateUser, deleteUser } = useUserMutations({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      setIsDialogOpen(false);
      setEditingUser(null);
    },
    onError: (error) => {
      console.log("Error", error);
      showToast.error(error?.data?.message || "Something went wrong", {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
    },
  });

  // Populate checkbox options for Roles & Permissions dynamically
  const fields = useMemo(() => {
    return UserCreatefields.map((f) => {
      if (f.name === "roles") {
        return {
          ...f,
          optionGroups: [
            {
              groupName: "Roles",
              options:
                roleData?.data.roles.map((r) => ({
                  label: r.role_name,
                  value: r.id,
                })) || [],
            },
          ],
        };
      }
      if (f.name === "permissions") {
        return {
          ...f,
          optionGroups: [
            {
              groupName: "Permissions",
              options:
                permissionData?.data.data.map((p) => ({
                  label: p.permission_name,
                  value: p.id,
                })) || [],
            },
          ],
        };
      }
      return f;
    });
  }, [roleData, permissionData]);
  const dialogFields = useMemo(() => {
    return fields.filter((f) => {
      // Hide password field when editing
      if (editingUser && f.name === "password") return false;
      return true;
    });
  }, [fields, editingUser]);

  // Table columns
  const columns: Column<UserData>[] = [
    { header: "Name", accessor: "customer_name" },
    { header: "Email", accessor: "email" },
  ];

  //   // Table actions
  const getActions = (): ActionConfig<UserData>[] => [
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

  //   // Edit user
  const handleEdit = (row: UserData) => {
    setEditingUser(row);
    setIsDialogOpen(true);
  };

  //   // Delete user
  const handleDelete = (row: UserData) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the user "${row.customer_name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteUser(row.id);
  };

  //   // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    if (editingUser?.id) {
      console.log(values, "values <><><>");
      updateUser({ id: editingUser.id, data: values as UserFormAttributes });
    } else {
      createUser(values as UserFormAttributes);
    }
  };

  //   // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!userData?.data?.data) return [];
    if (!searchQuery.trim()) return userData.data.data;

    const query = searchQuery.toLowerCase();
    return userData.data.data.filter(
      (user) =>
        user.customer_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [userData, searchQuery]);

  return (
    <div className="min-h-screen w-full p-6">
      {/* Search & Create */}
      <div className="flex justify-between items-center gap-4 pb-3">
        <div className="relative w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-12 rounded-md border-slate-200 bg-white text-sm text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        <Button
          onClick={() => {
            console.log("hy");
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 text-white hover:bg-orange-600 h-12 px-6 rounded-md shadow-md"
        >
          Create
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Edit User" : "Create User"}
        fields={dialogFields}
        defaultValues={{
          customer_name: editingUser?.customer_name || "",
          email: editingUser?.email || "",
          password: "",
          phone_number: editingUser?.phone_number || "",
          acceptTerms: false,
          roles: editingUser?.roles?.map((r) => r.id) || [],
          permissions:
            editingUser?.permissions?.map((p) => p.id) || [],
        }}
        OnSubmitTitle={editingUser ? "Update Role" : "Create Role"}
        CustomDialogBoxStyle="px-8 py-6 flex flex-col gap-5 overflow-y-auto flex-1
"
        onSubmit={handleSubmit}
      />

      {/* User Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
      />
    </div>
  );
}
