/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import {
  DataTable,
  type ActionConfig,
  type Column,
} from "../../../table/table";
import { CustomDialog } from "../../../customDialogbox";

export default function User() {
  const [selected, setSelected] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Fetch roles, permissions, and users
  const { data: roleData } = useGetRoles();
  const { data: permissionData } = useGetPermissions();
  const { data: userData } = useGetUsers();

  // User mutations
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
                roleData?.data.map((r) => ({
                  label: r.name,
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
                permissionData?.data.map((p) => ({
                  label: p.name,
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
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  // Table actions
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

  // Edit user
  const handleEdit = (row: UserData) => {
    setEditingUser(row);
    setIsDialogOpen(true);
  };

  // Delete user
  const handleDelete = (row: UserData) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the user "${row.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteUser(row.id);
  };

  // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    if (editingUser?.id) {
      updateUser({ id: editingUser.id, data: values as UserFormAttributes });
    } else {
      createUser(values as UserFormAttributes);
    }
  };

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    const users = userData?.data;
    if (!users) return [];
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
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
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
          className="h-12 gap-2 rounded-xl bg-[#1F4D36] px-6 font-semibold text-white shadow-md shadow-[#1F4D36]/25 transition hover:bg-[#173d2a] focus-visible:ring-2 focus-visible:ring-[#10B759]/40"
        >
          Create User
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
          name: editingUser?.name || "",
          email: editingUser?.email || "",
          password: "",
          phone_no: editingUser?.phone_no || "",
          country_code: editingUser?.country_code || "BT",
          is_tourism: editingUser?.is_tourism ?? false,
          tourism_name: editingUser?.tourism_name ?? null,
          acceptTerms: false,
          roles: editingUser?.roles?.map((r) => r.id) || [],
          permissions: editingUser?.permissions?.map((p) => p.id) || [],
        }}
        OnSubmitTitle={editingUser ? "Update User" : "Create User"}
        CustomDialogBoxStyle="px-8 py-6 grid grid-cols-3 gap-5 overflow-y-auto flex-1"
        onSubmit={handleSubmit}
      />

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/5">
        <DataTable
          data={filteredUsers}
          columns={columns}
          actions={getActions()}
          selectable
          onSelectionChange={setSelected}
        />
      </div>
    </div>
  );
}
