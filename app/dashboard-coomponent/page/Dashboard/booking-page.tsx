/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CheckCircle, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { showToast } from "nextjs-toast-notify";
import { DataTable, type ActionConfig, type Column } from "../../table/table";
// import {
//   useDashboardGetBookings,
//   useUpdateBookingMutations,
// } from "../Booking/tanstack";
import type { Booking } from "../Booking/interface";
import { VerticalModalForm } from "@/custom-components/vertical-modal";
import DynamicArrayForm from "@/custom-components/dynamic-array";
import { useGetBookings } from "../Booking/tanstack";

export default function DashboardBookingPage() {
  const [selected, setSelected] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Booking | null>(null);

  // Fetch bookings
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: bookingData, isFetching } = useGetBookings(
    page,
    limit,
  );

  // bookingData is BookingGetResponse:
  //   bookingData.data = { data: Booking[], total, page, limit, totalPages }
  const paginated = bookingData?.data;
  const bookings: Booking[] = paginated?.data ?? [];
  const totalPages = paginated?.totalPages ?? 1;

  // const { cancelBooking, approveBooking } = useUpdateBookingMutations({
  //   onSuccess: (data) => {
  //     showToast.success(data.message, {
  //       duration: 5000,
  //       position: "top-right",
  //       transition: "topBounce",
  //       icon: "",
  //       sound: true,
  //     });
  //     setIsModalOpen(false);
  //     setSelectedRow(null);
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

  const columns: Column<Booking>[] = [
    {
      header: "Name",
      render: (_value, row) => row.customer?.name || "N/A",
    },
    {
      header: "Email",
      render: (_value, row) => row.customer?.email || "N/A",
    },
    {
      header: "Phone",
      render: (_value, row) =>
        row.customer?.phone_no
          ? `${row.customer.country_code ?? ""} ${row.customer.phone_no}`.trim()
          : "N/A",
    },
    {
      header: "Golf Course",
      render: (_value, row) => row.golfCourse?.name || "N/A",
    },
    {
      header: "Tee Time",
      render: (_value, row) =>
        row.teeDate ? `${row.teeDate} ${row.teeTime?.slice(0, 5) ?? ""}` : "N/A",
    },
    { header: "Golfers", accessor: "numberOfGolfers" },
    {
      header: "Items",
      render: (_value, row) => {
        const names = (row.items ?? [])
          .map((item) => {
            const name =
              item.golfSet?.name ?? item.ball?.name ?? item.glove?.name;
            return name ? `${name} x${item.quantity}` : null;
          })
          .filter(Boolean);
        return names.length ? names.join(", ") : "N/A";
      },
    },
    {
      header: "Total Cost",
      render: (_value, row) => `${row.currency} ${row.totalAmount}`,
    },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const getActions = (): ActionConfig<Booking>[] => [
    {
      label: "Approve",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row) => handleApprove(row),
    },
    {
      label: "Cancel",
      icon: <XCircle className="h-4 w-4" />,
      onClick: (row) => handleCancel(row),
    },
  ];

  const handleApprove = (row: Booking) => {
    if (row.status !== "pending") {
      showToast.error("Only pending bookings can be approved", {
        duration: 3000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      return;
    }
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCancel = (row: Booking) => {
    if (row.status !== "pending") {
      showToast.error("Only pending bookings can be cancelled", {
        duration: 3000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      return;
    }
    const confirmed = window.confirm(
      `Cancel booking for "${row.customer?.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;
    // cancelBooking({ id: row.id });
  };

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;

    const query = searchQuery.toLowerCase();
    return bookings.filter(
      (booking) =>
        booking.customer?.name?.toLowerCase().includes(query) ||
        booking.customer?.email?.toLowerCase().includes(query) ||
        booking.customer?.phone_no?.toLowerCase().includes(query),
    );
  }, [bookings, searchQuery]);

  return (
    <div className="min-h-screen w-full p-6">
      {/* Search */}
      <div className="flex justify-between items-center gap-4 pb-3">
        <div className="relative w-1/3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <Input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-12 rounded-md border-slate-200 bg-white text-sm text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>
      </div>

      <DataTable
        data={filteredBookings}
        columns={columns}
        actions={getActions()}
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
          isFetching,
        }}
      />

      <VerticalModalForm
        title="Approve Booking"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow(null);
        }}
      >
       

        <DynamicArrayForm
          title="Payment Form"
          initialValues={{
            amount: selectedRow?.totalAmount || 0,
            paymentMode: "",
          }}
          buttonTitle="Approve"
          onSubmit={() => {
            if (!selectedRow) return;
            // approveBooking({ id: selectedRow.id });
            // If your backend needs the payment details too, pass the
            // submitted form values here, e.g. approveBooking({ id, ...values })
          }}
        />
      </VerticalModalForm>
    </div>
  );
}