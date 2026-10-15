/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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

import { useGetGolfSet, useGolfSetMutations } from "./tanstack";
import type { GolfSetAttributes, GolfSetData } from "./interface/indec";
import { GolfSetFields } from "./data";

export default function GolfSet() {
  const [selected, setSelected] = useState<GolfSetData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGolfSet, setEditingGolfSet] = useState<GolfSetData | null>(
    null,
  );

  // Fetch golf sets
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: golfSetData, isFetching } = useGetGolfSet(page, limit);

  // Golf set mutations
  const { createGolfSet, updateGolfSet, deleteGolfSet } = useGolfSetMutations({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      setIsDialogOpen(false);
      setEditingGolfSet(null);
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

  const columns: Column<GolfSetData>[] = [
    { header: "GolfSet Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Audience",
      render: (_value, row) => row.audience?.name || "N/A",
    },
    {
      header: "Handedness",
      render: (_value, row) =>
        row.handedness
          ? row.handedness.charAt(0).toUpperCase() + row.handedness.slice(1)
          : "N/A",
    },
    { header: "Tier", accessor: "tierName" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Price",
      render: (_value, row) => `${row.price}`,
    },
    {
      header: "Available",
      render: (_value, row) => (row.isAvailable ? "Yes" : "No"),
    },
  ];

  // Table actions
  const getActions = (): ActionConfig<GolfSetData>[] => [
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

  // Edit golf set
  const handleEdit = (row: GolfSetData) => {
    setEditingGolfSet(row);
    setIsDialogOpen(true);
  };

  // Delete golf set
  const handleDelete = (row: GolfSetData) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the golf set "${row.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteGolfSet(row.id);
  };

  // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("audienceId", String(Number(values.audienceId)));
    formData.append("handedness", values.handedness);
    formData.append("tierName", values.tierName);
    formData.append("quantity", String(Number(values.quantity)));
    formData.append("price", String(Number(values.price)));
    formData.append(
      "isAvailable",
      String(values.isAvailable ?? editingGolfSet?.isAvailable ?? true),
    );

    // image is either a new File or the existing URL string
    if (values.image instanceof File) {
      formData.append("image", values.image);
    } else if (typeof values.image === "string" && values.image) {
      // Tell the backend to keep the current image
      formData.append("imageUrl", values.image);
    }

    if (editingGolfSet?.id) {
      updateGolfSet({
        id: editingGolfSet.id,
        data: formData as unknown as GolfSetAttributes,
      });
    } else {
      createGolfSet(formData as unknown as GolfSetAttributes);
    }
  };

  // Filter golf sets by search query
  const filteredGolfSets = useMemo(() => {
    const list = golfSetData?.data?.data;
    if (!list) return [];
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (set) =>
        set.name.toLowerCase().includes(query) ||
        set.tierName.toLowerCase().includes(query) ||
        set.audience?.name?.toLowerCase().includes(query),
    );
  }, [golfSetData, searchQuery]);

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
            setEditingGolfSet(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 text-white hover:bg-orange-600 h-12 px-6 rounded-md shadow-md"
        >
          Create Golf Set
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingGolfSet(null);
        }}
        title={editingGolfSet ? "Edit Golf Set" : "Create Golf Set"}
        fields={GolfSetFields}
        defaultValues={{
          name: editingGolfSet?.name || "",
          description: editingGolfSet?.description || "",
          audienceId: editingGolfSet?.audienceId?.toString() || "",
          handedness: editingGolfSet?.handedness || "",
          tierName: editingGolfSet?.tierName || "",
          quantity: editingGolfSet?.quantity ?? "",
          price: editingGolfSet?.price ?? "",
          image: editingGolfSet?.imageUrl || "",
        }}
        OnSubmitTitle={editingGolfSet ? "Update Golf Set" : "Create Golf Set"}
        CustomDialogBoxStyle="px-8 py-6 grid grid-cols-3 gap-5 overflow-y-auto flex-1"
        onSubmit={handleSubmit}
      />

      {/* Golf Set Table */}
      <DataTable
        data={filteredGolfSets}
        columns={columns}
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages: golfSetData?.data?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
