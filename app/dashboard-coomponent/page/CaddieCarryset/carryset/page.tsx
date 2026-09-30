/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "nextjs-toast-notify";
import {
  DataTable,
  type ActionConfig,
  type Column,
} from "../../../table/table";
import { CustomDialog } from "../../../customDialogbox";
import { useCarrySetMutations, useGetCarrySets } from "./tanstack";
import type {
  CarrySet,
  CarrySetAttributes,
  CarrySetData,
} from "./interface/indec";
import { CarrySetFields } from "./data";
import { useGetCaddiesList } from "../caddie/tanstack";

export default function Carryset() {
  const [selected, setSelected] = useState<CarrySet[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CarrySet | null>(null);

  //   // Fetch roles, permissions, and users
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: carrysetData, isFetching } = useGetCarrySets(page, limit);
  console.log("carrysetData", carrysetData?.data);
  const { data: caddiesData } = useGetCaddiesList();
  const carrysetCaddiesOptions =
    caddiesData?.data?.caddies.map((caddie) => ({
      label: caddie.caddiename,
      value: caddie.id.toString(),
    })) || [];

  const newCarrySetFields = CarrySetFields(carrysetCaddiesOptions);
  //   // User mutations
  const { createCarrySet, updateCarrySet, deleteCarrySet } =
    useCarrySetMutations({
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
  const columns: Column<CarrySet>[] = [
    { header: "Name", accessor: "carrysetname" },
    {
      header: "People Category",
      render: (_value, row) => row.peopleCategory?.peoplecategoryname || "N/A",
    },
    {
      header: "Round Type",
      render: (_value, row) => row.roundType?.roundname || "N/A",
    },
    {
      header: "Caddie Name",
      render: (_value, row) => row.caddie?.caddiename || "N/A",
    },
  ];

  //   // Table actions
  const getActions = (): ActionConfig<CarrySet>[] => [
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
  const handleEdit = (row: CarrySet) => {
    setEditingUser(row);
    setIsDialogOpen(true);
  };

  //   // Delete user
  const handleDelete = (row: CarrySet) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the caddie "${row.carrysetname}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteCarrySet(row.id);
  };

  //   // Handle form submit
  //   // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    formData.append("carrysetname", values.carrysetname);
    formData.append("peopleId", String(Number(values.peopleId)));
    formData.append("roundId", String(Number(values.roundId)));
    formData.append("caddieId", String(Number(values.caddieId)));
    formData.append("availability", String(values.availability ?? true));

    // urls is a mix of kept string URLs and new File objects
    const urlArray: (string | File)[] = Array.isArray(values.urls)
      ? values.urls
      : [];
    const existingUrls = urlArray.filter(
      (u): u is string => typeof u === "string",
    );
    const newFiles = urlArray.filter((u): u is File => u instanceof File);

    // Tell the backend which existing images to keep
    formData.append("existingUrls", JSON.stringify(existingUrls));

    // Attach new files for the backend to upload
    newFiles.forEach((file) => {
      formData.append("file", file);
    });

    if (editingUser?.id) {
      updateCarrySet({
        id: editingUser.id,
        data: formData as unknown as CarrySetAttributes,
      });
    } else {
      createCarrySet(formData as unknown as CarrySetAttributes);
    }
  };

  //   // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!carrysetData?.data?.carrySets) return [];
    if (!searchQuery.trim()) return carrysetData.data.carrySets;

    const query = searchQuery.toLowerCase();
    return carrysetData.data.carrySets.filter((carryset) =>
      carryset.carrysetname.toLowerCase().includes(query),
    );
  }, [carrysetData, searchQuery]);

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
          Create Carry Set
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Edit Carry Set" : "Create Carry Set"}
        fields={newCarrySetFields}
        defaultValues={{
          carrysetname: editingUser?.carrysetname || "",
          peopleId: editingUser?.peopleCategory?.id?.toString() || null,
          roundId: editingUser?.roundType?.id?.toString() || null,
          caddieId: editingUser?.caddie?.id?.toString() || null,
          urls: editingUser?.urls || [], // keep as array, not joined string
        }}
        OnSubmitTitle={editingUser ? "Update Carry Set" : "Create Carry Set"}
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
          totalPages: carrysetData?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
