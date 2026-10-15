/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetBookings } from "./tanstack";
import { DataTable, type Column } from "../../table/table";
import type { Booking } from "./interface";

export default function BookingPage() {
  const [selected, setSelected] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: bookingData, isFetching } = useGetBookings(page, limit);

  console.log(bookingData?.data.data);
  const paginated = bookingData?.data; // { data: Booking[], total, page, limit, totalPages }
  const bookings: Booking[] = paginated?.data ?? []; // the array
  const totalPages = paginated?.totalPages ?? 1;

  const columns: Column<Booking>[] = [
    {
      header: "Customer",
      render: (_value, row) => row.customer?.name || "N/A",
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
      header: "Golfer Category",
      render: (_value, row) => row.golferCategory?.name || "N/A",
    },
    { header: "Tee Date", accessor: "teeDate" },
    {
      header: "Tee Time",
      render: (_value, row) => row.teeTime?.slice(0, 5) || "N/A", // HH:mm
    },
    { header: "Golfers", accessor: "numberOfGolfers" },
    {
      header: "Golf Set",
      render: (_value, row) => {
        const sets = (row.items ?? [])
          .filter((item) => item.golfSet)
          .map((item) => `${item.golfSet!.name} x${item.quantity}`);
        return sets.length ? sets.join(", ") : "N/A";
      },
    },
    {
      header: "Total Amount",
      render: (_value, row) => `${row.currency} ${row.totalAmount}`,
    },
    { header: "Booking Status", accessor: "status" },
  ];

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
        selectable
        onSelectionChange={setSelected}
        serverPagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
          isFetching,
        }}
      />
    </div>
  );
}
