/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "nextjs-toast-notify";

import { DataTable, type ActionConfig, type Column } from "../../table/table";
import { useGetOrders } from "./tanstack";
import type { Order } from "./interface";

export default function ApprovalItemsPage() {
  const [selected, setSelected] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Order | null>(null);

  //   // Fetch roles, permissions, and users
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: orderData, isFetching } = useGetOrders(page, limit);

  //   // User mutations
  //   const { createSouvenir, updateSouvenir, deleteSouvenir } =
  //     useSouvenirMutations({
  //       onSuccess: (data) => {
  //         showToast.success(data.message, {
  //           duration: 5000,
  //           position: "top-right",
  //           transition: "topBounce",
  //           icon: "",
  //           sound: true,
  //         });
  //         setIsDialogOpen(false);
  //         setEditingUser(null);
  //       },
  //       onError: (error) => {
  //         console.log("Error", error);
  //         showToast.error(error?.data?.message || "Something went wrong", {
  //           duration: 5000,
  //           position: "top-right",
  //           transition: "topBounce",
  //           icon: "",
  //           sound: true,
  //         });
  //       },
  //     });
  const columns: Column<Order>[] = [
    {
      header: "Name",
      render: (_value, row) =>
        row?.bookings?.map((item) => item.partyName).join(", ") || "N/A",
    },

    {
      header: "Item Name",
      render: (_value, row) =>
        row?.cart?.items.map((item) => item.itemVariant.item.name).join(", ") ||
        "N/A",
    },

    {
      header: "Unit Price",
      render: (_value, row) =>
        row?.cart?.items.map((item) => item.itemVariant.price).join(", ") ||
        "N/A",
    },
    {
      header: "Stock Quantity",
      render: (_value, row) =>
        row.cart?.items.map((item) => item.quantity).join(", ") || "N/A",
    },
    {
      header: "Total Price",
      render: (_value, row) =>
        row.cart?.items
          .reduce((total: number, item) => {
            const price = Number(item.itemVariant.price);
            const qty = Number(item.quantity);
            return total + price * qty;
          }, 0)
          .toFixed(2),
    },
       {
      header: "Date",
      render: (_value, row) =>
        row?.bookings?.map((item) => item.date).join(", ") || "N/A",
    },

    { header: "Name", accessor: "status" },
  ];

  //   // Table actions
  //   const getActions = (): ActionConfig<Booking>[] => [
  //     {
  //       label: "Edit",
  //       icon: <Edit className="h-4 w-4" />,
  //       onClick: handleEdit,
  //     },
  //     {
  //       label: "Delete",
  //       icon: <Delete className="h-4 w-4" />,
  //       onClick: handleDelete,
  //     },
  //   ];

  //   // Edit user
  //   const handleEdit = (row: Souvenir) => {
  //     setEditingUser(row);
  //     setIsDialogOpen(true);
  //   };

  //   //   // Delete user
  //   const handleDelete = (row: Souvenir) => {
  //     const confirmed = window.confirm(
  //       `⚠️ Are you sure you want to delete the souvenir "${row.name}"? This action cannot be undone.`,
  //     );
  //     if (!confirmed) return;
  //     deleteSouvenir(row.id);
  //   };

  //   //   // Handle form submit
  //   const handleSubmit = (values: Record<string, any>) => {
  //     if (editingUser?.id) {
  //       console.log(values, "values <><><>");
  //       updateSouvenir({
  //         id: editingUser.id,
  //         data: values as SouvenirAttributes,
  //       });
  //     } else {
  //       createSouvenir(values as SouvenirAttributes);
  //     }
  //   };

  //   // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!orderData?.data?.data.order) return [];
    if (!searchQuery.trim()) return orderData.data.data.order;

    const query = searchQuery.toLowerCase();
    return orderData.data.data.order.filter(
      (order) =>
        order.status.toLowerCase().includes(query) 
    );
  }, [orderData, searchQuery]);

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
        {/* 
        <Button
          onClick={() => {
            console.log("hy");
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 text-white hover:bg-orange-600 h-12 px-6 rounded-md shadow-md"
        >
          Create Souvenir
        </Button> */}
      </div>

      {/* Custom Dialog for Create/Edit */}
      {/* <CustomDialog
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
      /> */}

      {/* User Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        // actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages: orderData?.data?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
