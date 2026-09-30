/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Delete, Edit, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "nextjs-toast-notify";
import { DataTable, type ActionConfig, type Column } from "../../table/table";
import {
  useDashboardGetBookings,
  useUpdateBookingMutations,
} from "../Booking/tanstack";
import type { BookingResult } from "../Booking/interface";
import { VerticalModalForm } from "@/custom-components/vertical-modal";
import DynamicArrayForm from "@/custom-components/dynamic-array";
import PaymentsDetails from "../payment/helper-function";
import BookingDetailCard from "./helper-function/display";
import PartyDetails from "./helper-function/display";
import GolfCourseDetails from "./helper-function/golf-course";
import CarrysetDetails from "./helper-function/carryset";
import AccesoriesDetails from "./helper-function/order";

export default function DashboardBookingPage() {
  const [selected, setSelected] = useState<BookingResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BookingResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BookingResult | null>(null);
  // Fetch bookings
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: bookingData, isFetching } = useDashboardGetBookings(
    page,
    limit,
  );

  const { cancelBooking, approveBooking } = useUpdateBookingMutations({
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

  const columns: Column<BookingResult>[] = [
    {
      header: "Name",
      render: (_value, row) => row.party?.name || "N/A",
    },
    {
      header: "Email",
      render: (_value, row) => row.party?.email || "N/A",
    },
    {
      header: "Phone",
      render: (_value, row) => row.party?.phone || "N/A",
    },
    // {
    //   header: "Golf Course",
    //   render: (_value, row) => row.golfCourse?.name || "N/A",
    // },
    // {
    //   header: "Carry Set",
    //   render: (_value, row) => row.carrySet?.name || "N/A",
    // },
    {
      header: "Total Cost",
      render: (_value, row) => row.order.totalPrice || "N/A",
    },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const getActions = (): ActionConfig<BookingResult>[] => [
    {
      label: "Approve",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => handleApprove(row),
    },
    {
      label: "Cancel",
      icon: <Delete className="h-4 w-4" />,
      onClick: (row) => handleCancel(row),
    },
  ];

  const handleApprove = (row: BookingResult) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCancel = (row: BookingResult) => {
    const confirmed = window.confirm(
      `Cancel booking for "${row.party?.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    cancelBooking({ id: row.id });
  };

  const filteredUsers = useMemo(() => {
    const results = bookingData?.data?.data?.results;
    if (!results) return [];
    if (!searchQuery.trim()) return results;

    const query = searchQuery.toLowerCase();
    return results.filter(
      (booking) =>
        booking?.party?.name?.toLowerCase().includes(query) ||
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
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages: bookingData?.data?.data?.meta?.totalPages || 1,
          onPageChange: setPage,
          isFetching,
        }}
      />

      <VerticalModalForm
        title="Purchase Invoice Payment"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          {selectedRow && (
            <>
               {selectedRow && <BookingDetailCard data={selectedRow} />}

            </>
          )}
        </div>

        <DynamicArrayForm
          title="Invoice Form"
          // topFields={TopPaymentFieldsForms}
          initialValues={{
            // NOTE: guessed field names — replace with the real Booking payment fields
            amount: selectedRow?.golfCourse?.price || 0,
            paymentMode: (selectedRow as any)?.paymentMode || "",
          }}
          buttonTitle="Submit"
          onSubmit={() => console.log("hy")}
        />
      </VerticalModalForm>
    </div>
  );
}
