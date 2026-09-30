/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { DataTable, Column, ActionConfig } from "@/component/table";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetBookings, useUpdateBookingMutations } from "./tanstack";
import { DataTable, type ActionConfig, type Column } from "../../table/table";
import type { BookingResult } from "./interface";

export default function BookingPage() {
  const [selected, setSelected] = useState<BookingResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BookingResult | null>(null);

  //   // Fetch roles, permissions, and users
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: bookingData, isFetching } = useGetBookings(page, limit);

  // const { cancelBooking, approveBooking } = useUpdateBookingMutations({
  //   onSuccess: (data) => {
  //     showToast.success(data.message, {
  //       duration: 5000,
  //       position: "top-right",
  //       transition: "topBounce",
  //       icon: "",
  //       sound: true,
  //     });
  //     setIsDialogOpen(false);
  //     setEditingUser(null);
  //   },
  //   onError: (error) => {
  //     console.log("Error", error);
  //     showToast.error(error?.data?.message || "Something went wrong", {
  //       duration: 5000,
  //       position: "top-right",
  //       transition: "topBounce",
  //       icon: "",
  //       sound: true,
  //     });
  //   },
  // });
  const columns: Column<BookingResult>[] = [
    { header: "Name", accessor: "party" },
    // { header: "Email", accessor: "partyEmail" },
    // { header: "Phone", accessor: "partyPhone" },

    {
      header: "Golf Course",
      render: (_value, row) => row.golfCourse?.name || "N/A",
    },

    {
      header: "Carry Set",
      render: (_value, row) => row.carrySet?.caddieId || "N/A",
    },
    {
      header: "Golf Course Cost",
      render: (_value, row) => row.golfCourse?.price || "N/A",
    },
    { header: "Golf Booking Status", accessor: "status" },

    // {
    //   header: "category",
    //   render: (_value, row) => row.category?.name || "N/A",
    // },
  ];

  // Table actions — just call the mutation directly, no form/dialog
  // const getActions = (): ActionConfig<Booking>[] => [
  //   {
  //     label: "Approve",
  //     icon: <Edit className="h-4 w-4" />,
  //     onClick: (row) => handleApprove(row),
  //   },
  //   {
  //     label: "Cancel",
  //     icon: <Delete className="h-4 w-4" />,
  //     onClick: (row) => handleCancel(row),
  //   },
  // ];

  // const handleApprove = (row: Booking) => {
  //   const confirmed = window.confirm(`Approve booking for "${row.partyName}"?`);
  //   if (!confirmed) return;
  //   approveBooking({ id: row.id });
  // };

  // const handleCancel = (row: Booking) => {
  //   const confirmed = window.confirm(
  //     `Cancel booking for "${row.partyName}"? This action cannot be undone.`,
  //   );
  //   if (!confirmed) return;
  //   cancelBooking({ id: row.id });
  // };
  const filteredUsers = useMemo(() => {
    if (!bookingData?.data.data.results) return [];
    if (!searchQuery.trim()) return bookingData.data.data.results;

    const query = searchQuery.toLowerCase();
    return bookingData?.data?.data?.results.filter(
      (booking) =>
        booking?.party?.name.toLowerCase().includes(query) ||
        booking?.party?.email?.toLowerCase().includes(query) ||
        booking?.party?.phone?.toLowerCase().includes(query),
    );
  }, [bookingData, searchQuery]);

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
      </div>
      <DataTable
        data={filteredUsers}
        columns={columns}
        // actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages: bookingData?.data?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
