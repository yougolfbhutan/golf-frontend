/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCaddieMutations, useGetCaddies } from "./tanstack";
import { showToast } from "nextjs-toast-notify";
import {
  DataTable,
  type ActionConfig,
  type Column,
} from "../../../table/table";
import { CustomDialog } from "../../../customDialogbox";
import type { CaddieData, CaddieFormAttributes } from "./interface";
import { CaddieFields } from "./data";

export default function Caddie() {
  const [selected, setSelected] = useState<CaddieData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CaddieData | null>(null);

  //   // Fetch roles, permissions, and users
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: caddieData, isFetching } = useGetCaddies(page, limit);

  //   // User mutations
  const { createCaddie, updateCaddie, deleteCaddie } = useCaddieMutations({
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
  const columns: Column<CaddieData>[] = [
    { header: "Name", accessor: "caddiename" },
    { header: "CID No", accessor: "cidNo" },
    { header: "Phone Number", accessor: "phone_number" },
  ];

  //   // Table actions
  const getActions = (): ActionConfig<CaddieData>[] => [
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
  const handleEdit = (row: CaddieData) => {
    setEditingUser(row);
    setIsDialogOpen(true);
  };

  //   // Delete user
  const handleDelete = (row: CaddieData) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the caddie "${row.caddiename}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteCaddie(row.id);
  };

  //   // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    if (editingUser?.id) {
      console.log(values, "values <><><>");
      updateCaddie({
        id: editingUser.id,
        data: values as CaddieFormAttributes,
      });
    } else {
      createCaddie(values as CaddieFormAttributes);
    }
  };

  //   // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!caddieData?.data?.caddies) return [];
    if (!searchQuery.trim()) return caddieData.data.caddies;

    const query = searchQuery.toLowerCase();
    return caddieData.data.caddies.filter(
      (caddie) =>
        caddie.caddiename.toLowerCase().includes(query) ||
        caddie.cidNo.toLowerCase().includes(query),
    );
  }, [caddieData, searchQuery]);

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
          Create Caddie
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Edit Caddie" : "Create Caddie"}
        fields={CaddieFields}
        defaultValues={{
          caddiename: editingUser?.caddiename || "",
          cidNo: editingUser?.cidNo || "",
          phone_number: editingUser?.phone_number || "",
        }}
        OnSubmitTitle={editingUser ? "Update Caddie" : "Create Caddie"}
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
          totalPages: caddieData?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
