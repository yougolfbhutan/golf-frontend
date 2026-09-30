/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSouvenirs, useSouvenirMutations } from "./tanstack";
import { showToast } from "nextjs-toast-notify";
import {
  DataTable,
  type ActionConfig,
  type Column,
} from "../../../table/table";
import { CustomDialog } from "../../../customDialogbox";
import type { Souvenir, SouvenirAttributes } from "./interface";
import { SouvenirFields } from "./data";

export default function GolfSouvenirs() {
  const [selected, setSelected] = useState<Souvenir[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Souvenir | null>(null);

  //   // Fetch roles, permissions, and users
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: souvenirData, isFetching } = useGetSouvenirs(page, limit);

  //   // User mutations
  const { createSouvenir, updateSouvenir, deleteSouvenir } =
    useSouvenirMutations({
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
  const columns: Column<Souvenir>[] = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "category",
      render: (_value, row) => row.category?.name || "N/A",
    },
  ];

  //   // Table actions
  const getActions = (): ActionConfig<Souvenir>[] => [
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
  const handleEdit = (row: Souvenir) => {
    setEditingUser(row);
    setIsDialogOpen(true);
  };

  //   // Delete user
  const handleDelete = (row: Souvenir) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the souvenir "${row.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteSouvenir(row.id);
  };

  //   // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    if (editingUser?.id) {
      console.log(values, "values <><><>");
      updateSouvenir({
        id: editingUser.id,
        data: values as SouvenirAttributes,
      });
    } else {
      createSouvenir(values as SouvenirAttributes);
    }
  };

  //   // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!souvenirData?.data?.souvenirs) return [];
    if (!searchQuery.trim()) return souvenirData.data.souvenirs;

    const query = searchQuery.toLowerCase();
    return souvenirData.data.souvenirs.filter(
      (souvenir) =>
        souvenir.name.toLowerCase().includes(query) ||
        souvenir.description.toLowerCase().includes(query),
    );
  }, [souvenirData, searchQuery]);

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
          Create Souvenir
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Edit Souvenir" : "Create Souvenir"}
        fields={SouvenirFields}
        defaultValues={{
          name: editingUser?.name || "",
          description: editingUser?.description || "",
          categoryId: editingUser?.categoryId
            ? String(editingUser.categoryId)
            : "",
        }}
        OnSubmitTitle={editingUser ? "Update Souvenir" : "Create Souvenir"}
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
        serverPagination={{
          currentPage: page,
          totalPages: souvenirData?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
