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
import type { Balls, BallsPayloadAttribes } from "./interface";
import { GolfBallsFields } from "./data";
import { useBallsMutations, useGetBalls } from "./tanstack";

export default function GolfBalls() {
  const [selected, setSelected] = useState<Balls[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBall, setEditingBall] = useState<Balls | null>(null);

  // Fetch balls
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: ballsData, isFetching } = useGetBalls(page, limit);

  // Ball mutations
  const { createBalls, updateBalls, deleteBalls } = useBallsMutations({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      setIsDialogOpen(false);
      setEditingBall(null);
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

  const columns: Column<Balls>[] = [
    { header: "Name", accessor: "name" },
    { header: "Tier", accessor: "tierName" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Price",
      render: (_value, row) => `${row.currency} ${row.price}`,
    },
  ];

  // Table actions
  const getActions = (): ActionConfig<Balls>[] => [
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

  // Edit ball
  const handleEdit = (row: Balls) => {
    setEditingBall(row);
    setIsDialogOpen(true);
  };

  // Delete ball
  const handleDelete = (row: Balls) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete "${row.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    deleteBalls(row.id);
  };

  // Handle form submit
  const handleSubmit = (values: Record<string, any>) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("tierName", values.tierName);
    formData.append("quantity", String(Number(values.quantity)));
    formData.append("price", String(Number(values.price)));

    // image is either a new File or the existing URL string
    if (values.image instanceof File) {
      formData.append("image", values.image);
    } else if (typeof values.image === "string" && values.image) {
      // Tell the backend to keep the current image
      formData.append("imageUrl", values.image);
    }

    if (editingBall?.id) {
      updateBalls({
        id: editingBall.id,
        data: formData as unknown as BallsPayloadAttribes,
      });
    } else {
      createBalls(formData as unknown as BallsPayloadAttribes);
    }
  };

  // Filter balls by search query
  const filteredBalls = useMemo(() => {
    const list = ballsData?.data?.data;
    if (!list) return [];
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(
      (ball) =>
        ball.name.toLowerCase().includes(query) ||
        ball.tierName.toLowerCase().includes(query),
    );
  }, [ballsData, searchQuery]);

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
            setEditingBall(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 text-white hover:bg-orange-600 h-12 px-6 rounded-md shadow-md"
        >
          Create Golf Ball
        </Button>
      </div>

      {/* Custom Dialog for Create/Edit */}
      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBall(null);
        }}
        title={editingBall ? "Edit Golf Ball" : "Create Golf Ball"}
        fields={GolfBallsFields}
        defaultValues={{
          name: editingBall?.name || "",
          tierName: editingBall?.tierName || "",
          quantity: editingBall?.quantity ?? "",
          price: editingBall?.price ?? "",
          image: editingBall?.imageUrl || "",
        }}
        OnSubmitTitle={editingBall ? "Update Golf Ball" : "Create Golf Ball"}
        CustomDialogBoxStyle="px-8 py-6 grid grid-cols-3 gap-5 overflow-y-auto flex-1"
        onSubmit={handleSubmit}
      />

      {/* Balls Table */}
      <DataTable
        data={filteredBalls}
        columns={columns}
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages: ballsData?.data?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}