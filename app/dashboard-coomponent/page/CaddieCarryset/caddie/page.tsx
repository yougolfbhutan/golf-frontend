/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetGloves, useGlovesMutations } from "./tanstack";
import { showToast } from "nextjs-toast-notify";
import {
  DataTable,
  type ActionConfig,
  type Column,
} from "../../../table/table";
import { CustomDialog } from "../../../customDialogbox";
import { GlovesFields } from "./data";
import type { Glove, GlovesPayloadAttribes } from "./interface";

export default function Gloves() {
  const [selected, setSelected] = useState<Glove[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGlove, setEditingGlove] = useState<Glove | null>(null);

  // Fetch gloves
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: glovesData, isFetching } = useGetGloves(page, limit);

  // Glove mutations
  const { createGloves, updateGloves, deleteGloves } = useGlovesMutations({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      setIsDialogOpen(false);
      setEditingGlove(null);
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

  const columns: Column<Glove>[] = [
    { header: "Name", accessor: "name" },
    {
      header: "Audience",
      render: (_value, row) => row.audience?.name || "N/A",
    },
    { header: "Size", accessor: "size" },
    { header: "Handedness", accessor: "handedness" },
    { header: "Tier", accessor: "tierName" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Price",
      render: (_value, row) => `${row.currency} ${row.price}`,
    },
    {
      header: "Available",
      render: (_value, row) => (row.isAvailable ? "Yes" : "No"),
    },
  ];

  // Table actions
  const getActions = (): ActionConfig<Glove>[] => [
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

  // Edit glove
  const handleEdit = (row: Glove) => {
    setEditingGlove(row);
    setIsDialogOpen(true);
  };

  // Delete glove
  const handleDelete = (row: Glove) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the glove "${row.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteGloves(row.id);
  };

  // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("audienceId", String(Number(values.audienceId)));
    formData.append("size", values.size);
    formData.append("handedness", values.handedness);
    formData.append("tierName", values.tierName);
    formData.append("quantity", String(Number(values.quantity)));
    formData.append("price", String(Number(values.price)));
    formData.append(
      "isAvailable",
      String(values.isAvailable ?? editingGlove?.isAvailable ?? true),
    );

    // image is either a new File or the existing URL string
    if (values.image instanceof File) {
      formData.append("image", values.image);
    } else if (typeof values.image === "string" && values.image) {
      // Tell the backend to keep the current image
      formData.append("imageUrl", values.image);
    }

    if (editingGlove?.id) {
      updateGloves({
        id: editingGlove.id,
        data: formData as unknown as GlovesPayloadAttribes,
      });
    } else {
      createGloves(formData as unknown as GlovesPayloadAttribes);
    }
  };

  // Filter gloves by search query
  const filteredGloves = useMemo(() => {
    const list = glovesData?.data?.data;
    if (!list) return [];
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (glove) =>
        glove.name.toLowerCase().includes(query) ||
        glove.tierName.toLowerCase().includes(query) ||
        glove.size.toLowerCase().includes(query),
    );
  }, [glovesData, searchQuery]);

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
            setEditingGlove(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 text-white hover:bg-orange-600 h-12 px-6 rounded-md shadow-md"
        >
          Create Glove
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingGlove(null);
        }}
        title={editingGlove ? "Edit Glove" : "Create Glove"}
        fields={GlovesFields}
        defaultValues={{
          name: editingGlove?.name || "",
          audienceId: editingGlove?.audienceId?.toString() || "",
          size: editingGlove?.size || "",
          handedness: editingGlove?.handedness || "",
          tierName: editingGlove?.tierName || "",
          quantity: editingGlove?.quantity ?? "",
          price: editingGlove?.price ?? "",
          image: editingGlove?.imageUrl || "",
        }}
        OnSubmitTitle={editingGlove ? "Update Glove" : "Create Glove"}
        CustomDialogBoxStyle="px-8 py-6 grid grid-cols-3 gap-5 overflow-y-auto flex-1"
        onSubmit={handleSubmit}
      />

      {/* Gloves Table */}
      <DataTable
        data={filteredGloves}
        columns={columns}
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages: glovesData?.data?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}