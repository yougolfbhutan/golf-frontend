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
import { CustomDialog } from "../../customDialogbox";
import { VerticalModalForm } from "@/custom-components/vertical-modal";
import DynamicArrayForm from "@/custom-components/dynamic-array";
import PaymentsDetails from "./helper-function";
import { TopPaymentFieldsForms } from "./data";
import type { BookingResult } from "../Booking/interface";

export default function PaymentPage() {
  const [selected, setSelected] = useState<BookingResult[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BookingResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BookingResult | null>(null);
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
    // 
  ];

  // Table actions — just call the mutation directly, no form/dialog
//   const getActions = (): ActionConfig<Booking>[] => [
//     {
//       label: "Approve",
//       icon: <Edit className="h-4 w-4" />,
//       onClick: (row) => handleApprove(row),
//     },
//     {
//       label: "Cancel",
//       icon: <Delete className="h-4 w-4" />,
//       onClick: (row) => handleCancel(row),
//     },
//   ];

//   const handleApprove = (row: Booking) => {
//     const confirmed = window.confirm(`Approve booking for "${row.partyName}"?`);
//     if (!confirmed) return;
//     approveBooking({ id: row.id });
//   };

//   const handleCancel = (row: Booking) => {
//     const confirmed = window.confirm(
//       `Cancel booking for "${row.partyName}"? This action cannot be undone.`,
//     );
//     if (!confirmed) return;
//     cancelBooking({ id: row.id });
//   };

  const filteredUsers = useMemo(() => {
    if (!bookingData?.data.data.results) return [];
    if (!searchQuery.trim()) return bookingData.data.data.results;

    const query = searchQuery.toLowerCase();
    return bookingData?.data?.data?.results.filter(
      (booking) =>
        booking?.party?.name.toLowerCase().includes(query) ||
        booking?.party?.email.toLowerCase().includes(query) ||
        booking?.party?.phone.toLowerCase().includes(query),
    );
  }, [bookingData, searchQuery]);

  const handleSubmit = (values: Record<string, any>) => {
    if (!selectedRow?.id) {
      return;
    }

    // TODO: restore once buildPaymentPayload / createPaymentReceipt are available
    // const payload = buildPaymentPayload(
    //   selectedRow.invoice.id,
    //   selectedRow.id, // payment UUID
    //   values,
    // );
    // createPaymentReceipt(payload as PaymentRecieptSendData);
  };

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
          onRowClick={(row) => {
          setSelectedRow(row);
          setIsModalOpen(true);
        }}
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

      <VerticalModalForm
        title="Purchase Invoice Payment"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedRow && (
          <PaymentsDetails data={selectedRow.order as any} />
        )}

        <DynamicArrayForm
          title="Invoice Form"
          topFields={TopPaymentFieldsForms}
          initialValues={{
            // NOTE: guessed field names — replace with the real Booking payment fields
            amount: selectedRow?.golfCourse?.price || 0,
            paymentMode: (selectedRow as any)?.paymentMode || "",
          }}
          buttonTitle="Submit"
          onSubmit={handleSubmit}
        />
      </VerticalModalForm>
    </div>
  );
}