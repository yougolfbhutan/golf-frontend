/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
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
      render: (_value, row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.isAvailable
              ? "bg-[#10B759]/10 text-[#1F4D36]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.isAvailable ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  // Table actions
  const getActions = (): ActionConfig<GolfSetData>[] => [
    {
      label: "Edit",
      title: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      title: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
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

    // image is a new File, or the existing URL (alone or inside an array)
    const rawImage = values.image;
    const first = Array.isArray(rawImage) ? rawImage[0] : rawImage;

    if (first instanceof File) {
      formData.append("image", first);
    } else if (typeof first === "string" && first) {
      formData.append("image", first); // keep existing image on edit
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
    <div className="min-h-screen w-full p-4 sm:p-6">
      {/* Search & Create */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            type="text"
            placeholder="Search by name, tier or audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 text-sm text-slate-900 shadow-md shadow-slate-900/5 transition-all duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#10B759] focus:outline-none focus:ring-2 focus:ring-[#10B759]/25 focus-visible:border-[#10B759] focus-visible:ring-2 focus-visible:ring-[#10B759]/25"
          />
        </div>

        <Button
          onClick={() => {
            setEditingGolfSet(null);
            setIsDialogOpen(true);
          }}
          className="h-12 gap-2 rounded-xl bg-[#1F4D36] px-6 font-semibold text-white shadow-md shadow-[#1F4D36]/25 transition hover:bg-[#173d2a] focus-visible:ring-2 focus-visible:ring-[#10B759]/40"
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
          // the dialog's image field expects a list, so the saved image shows as a preview
          image: editingGolfSet?.imageUrl ? [editingGolfSet.imageUrl] : [],
        }}
        OnSubmitTitle={editingGolfSet ? "Update Golf Set" : "Create Golf Set"}
        CustomDialogBoxStyle="px-8 py-6 grid grid-cols-3 gap-5 overflow-y-auto flex-1"
        onSubmit={handleSubmit}
      />

      {/* Golf Set Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/5">
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
    </div>
  );
}