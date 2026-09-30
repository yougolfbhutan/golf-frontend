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
import type {
  ItemVariant,
  ItemVariantUpdateBySkuAttributes,
} from "./interface";
import { useGetItemVariants, useItemVariantMutations } from "./tanstack";
import { useGetAllSouvenirs } from "../golf-souvenirs/tanstack";
import { ItemVariantFields } from "./data";

export default function ItemVariants() {
  const [selected, setSelected] = useState<ItemVariant[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ItemVariant | null>(null);
  const { data: souvenirData } = useGetAllSouvenirs();
  //   // Fetch roles, permissions, and users
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: ItemVariantData, isFetching } = useGetItemVariants(page, limit);

  const ItemVariantCaddiesOptions =
    souvenirData?.data?.souvenirs.map((souvenir) => ({
      label: souvenir.name,
      value: souvenir.id.toString(),
    })) || [];
  const newItemVariantFields = ItemVariantFields(ItemVariantCaddiesOptions);
  //   // User mutations
  const { createItemVariant, updateItemVariant, deleteItemVariant } =
    useItemVariantMutations({
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
  const columns: Column<ItemVariant>[] = [
    {
      header: "Item Name",
      render: (_value, row) => row.item?.name || "N/A",
    },
    { header: "Pack Quantity", accessor: "packQuantity" },
    { header: "Price", accessor: "price" },
    { header: "Stock Quantity", accessor: "stockQty" },
    { header: "Availability", accessor: "availability" },
  ];

  //   // Table actions
  const getActions = (): ActionConfig<ItemVariant>[] => [
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
  const handleEdit = (row: ItemVariant) => {
    setEditingUser(row);
    setIsDialogOpen(true);
  };

  //   // Delete user
  const handleDelete = (row: ItemVariant) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete the item "${row.item?.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteItemVariant(row.id);
  };

  //   // Handle form submit
  //   // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    formData.append("itemId", String(Number(values.itemId)));
    formData.append("color", values.color);
    formData.append("size", values.size);
    formData.append("packQuantity", String(Number(values.packQuantity)));
    formData.append("price", String(Number(values.price)));
    formData.append("stockQty", String(Number(values.stockQty)));
    formData.append("availability", String(values.availability ?? true));

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

    newFiles.forEach((file) => {
      formData.append("file", file);
    });

    if (editingUser?.id) {
      updateItemVariant({
        id: editingUser.id,
        data: formData as unknown as ItemVariantUpdateBySkuAttributes,
      });
    } else {
      createItemVariant(
        formData as unknown as ItemVariantUpdateBySkuAttributes,
      );
    }
  };

  //   // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!ItemVariantData?.data?.itemVariants) return [];
    if (!searchQuery.trim()) return ItemVariantData.data.itemVariants;

    const query = searchQuery.toLowerCase();
    return ItemVariantData.data.itemVariants.filter((itemVariant) =>
      itemVariant.item?.name.toLowerCase().includes(query),
    );
  }, [ItemVariantData, searchQuery]);

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
          Create Item Variant
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Edit Item Variant" : "Create Item Variant"}
        fields={newItemVariantFields}
        defaultValues={{
          itemId: editingUser?.itemId?.toString() || "",
          color: editingUser?.color || "",
          size: editingUser?.size || "",
          packQuantity: editingUser?.packQuantity ?? "",
          price: editingUser?.price ?? "",
          stockQty: editingUser?.stockQty ?? "",
          availability: editingUser?.availability?.toString() || "true",
          urls: editingUser?.urls?.map((u) => u.url) || [], // extract string urls
        }}
        OnSubmitTitle={
          editingUser ? "Update Item Variant" : "Create Item Variant"
        }
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
          totalPages: ItemVariantData?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
